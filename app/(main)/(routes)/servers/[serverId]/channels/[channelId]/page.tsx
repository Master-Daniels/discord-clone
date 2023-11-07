import { redirect } from "next/navigation";
import { redirectToSignIn } from "@clerk/nextjs";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";

import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatMessages from "@/components/chat/chat-messages";
import { CHANNELTYPE } from "@prisma/client";
import MediaRoom from "@/components/custom/media-room";

interface ChannelIdPageProps {
    params: {
        channelId: string;
        serverId: string;
    };
}
async function ChannelIdPage({ params }: ChannelIdPageProps) {
    const profile = await currentProfile();
    if (!profile) return redirectToSignIn();

    const channel = await db.channel.findUnique({
        where: {
            id: params.channelId,
        },
    });

    const member = await db.member.findFirst({
        where: {
            profileId: profile.id,
            serverId: params.serverId,
        },
    });
    if (!channel || !member) {
        return redirect("/create-server");
    }

    return (
        <div className="bg-white dark:bg-[#313333] flex flex-col h-full">
            <ChatHeader serverId={params.serverId} type="channel" name={channel.name} />
            {channel.type === CHANNELTYPE.TEXT && (
                <>
                    <ChatMessages
                        member={member}
                        name={channel.name}
                        chatId={channel.id}
                        type="channel"
                        apiUrl="/api/messages"
                        socketUrl="/api/socket/messages"
                        socketQuery={{
                            channelId: channel.id,
                            serverId: channel.serverId,
                        }}
                        paramKey="channelId"
                        paramValue={channel.id}
                    />
                    <ChatInput
                        name={channel.name}
                        type="channel"
                        apiUrl="/api/socket/messages"
                        query={{
                            channelId: channel.id,
                            serverId: channel.serverId,
                        }}
                    />
                </>
            )}
            {channel.type === CHANNELTYPE.AUDIO && <MediaRoom video={false} audio chatId={channel.id} />}
            {channel.type === CHANNELTYPE.VIDEO && <MediaRoom video audio chatId={channel.id} />}
        </div>
    );
}

export default ChannelIdPage;
