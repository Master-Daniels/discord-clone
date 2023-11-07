import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { CHANNELTYPE, ROLE } from "@prisma/client";
import { redirect } from "next/navigation";
import ServerHeader from "@components/server/server-header";
import { ScrollArea } from "@components/ui/scroll-area";
import ServerSearch from "@components/server/server-search";
import { Hash, Mic, ShieldAlert, ShieldCheck, UserCircleIcon, Video } from "lucide-react";
import { Separator } from "@components/ui/separator";
import ServerSection from "@components/server/server-section";
import ServerChannel from "@components/server/server-channel";
import ServerMember from "@components/server/server-member";

interface ServerSidebarProps {
    serverId: string;
}

const iconMap = {
    [CHANNELTYPE.TEXT]: <Hash className="mr-2 h-4 w-4" />,
    [CHANNELTYPE.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
    [CHANNELTYPE.VIDEO]: <Video className="mr-2 h-4 w-4" />,
};

const roleIconMap = {
    [ROLE.GUEST]: <UserCircleIcon className="h-4 w-4 mr-2" />,
    [ROLE.MODERATOR]: <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />,
    [ROLE.ADMIN]: <ShieldAlert className="h-4 w-4 mr-2 text-rose-500" />,
};

const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
    const profile = await currentProfile();

    if (!profile) return redirect("/create-server");

    const server = await db.server.findUnique({
        where: {
            id: serverId,
        },
        include: {
            channels: {
                orderBy: {
                    createdAt: "asc",
                },
            },
            members: {
                include: {
                    profile: true,
                },
                orderBy: {
                    role: "asc",
                },
            },
        },
    });

    const textChannels = server?.channels.filter((channel) => channel.type === CHANNELTYPE.TEXT);
    const videoChannels = server?.channels.filter((channel) => channel.type === CHANNELTYPE.VIDEO);
    const audioChannels = server?.channels.filter((channel) => channel.type === CHANNELTYPE.AUDIO);
    const members = server?.members
    .filter((member) => member.profileId !== profile.id);

    if (!server) return redirect("/create-server");

    const role = server.members.find((member) => {
        return member.profileId === profile.id;
    })?.role;

    return (
        <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
            <ServerHeader {...{ server, role }} />
            <ScrollArea className="flex-1 px-3">
                <div className="mt-2">
                    <ServerSearch
                        data={[
                            {
                                label: "Text Channels",
                                type: "channel",
                                data: textChannels?.map((channel) => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type],
                                })),
                            },
                            {
                                label: "Voice Channels",
                                type: "channel",
                                data: audioChannels?.map((channel) => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type],
                                })),
                            },
                            {
                                label: "Video Channels",
                                type: "channel",
                                data: videoChannels?.map((channel) => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type],
                                })),
                            },
                            {
                                label: "Members",
                                type: "member",
                                data: members?.map((member) => ({
                                    id: member.id,
                                    name: member.profile.name,
                                    icon: roleIconMap[member.role],
                                })),
                            },
                        ]}
                    />
                </div>
                <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
                {!!textChannels?.length && (
                    <>
                        <div className="mb-2">
                            <ServerSection
                                {...{
                                    sectionType: "channels",
                                    channelType: CHANNELTYPE.TEXT,
                                    role,
                                    label: "Text Channels",
                                }}
                            />
                            {textChannels.map((channel) => (
                                <ServerChannel key={channel.id} {...{ channel, role, server }} />
                            ))}
                        </div>
                        <Separator className="bg-zinc-300 dark:bg-zinc-700 rounded-md my-2" />
                    </>
                )}
                {!!audioChannels?.length && (
                    <>
                        <div className="mb-2">
                            <ServerSection
                                {...{
                                    sectionType: "channels",
                                    channelType: CHANNELTYPE.AUDIO,
                                    role,
                                    label: "Audio Channels",
                                }}
                            />
                            {audioChannels.map((channel) => (
                                <ServerChannel key={channel.id} {...{ channel, role, server }} />
                            ))}
                        </div>
                        <Separator className="bg-zinc-300 dark:bg-zinc-700 rounded-md my-2" />
                    </>
                )}
                {!!videoChannels?.length && (
                    <>
                        <div className="mb-2">
                            <ServerSection
                                {...{
                                    sectionType: "channels",
                                    channelType: CHANNELTYPE.VIDEO,
                                    role,
                                    label: "Video Channels",
                                }}
                            />
                            {videoChannels.map((channel) => (
                                <ServerChannel key={channel.id} {...{ channel, role, server }} />
                            ))}
                        </div>
                        <Separator className="bg-zinc-300 dark:bg-zinc-700 rounded-md my-2" />
                    </>
                )}
                {!!members?.length && (
                    <div className="mb-2">
                        <ServerSection
                            {...{
                                sectionType: "members",
                                role,
                                server,
                                label: "Members",
                            }}
                        />
                        {members.map((member) => (
                            <ServerMember key={member.id} {...{ member, server }} />
                        ))}
                    </div>
                )}
            </ScrollArea>
        </div>
    );
};

export default ServerSidebar;
