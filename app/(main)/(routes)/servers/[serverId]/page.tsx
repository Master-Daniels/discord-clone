import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { redirect } from "next/navigation";
import { redirectToSignIn } from "@clerk/nextjs";

interface ServerIdPageProps {
    params: {
        serverId: string | undefined;
    };
}
export default async function ServerIdPage({ params }: ServerIdPageProps) {
    const profile = await currentProfile();
    if (!profile) {
        return redirectToSignIn();
    }
    const server = await db.server.findUnique({
        where: {
            id: params.serverId,
            members: {
                some: {
                    profileId: profile.id,
                },
            },
        },
        include: {
            channels: {
                where: {
                    name: "general",
                },
                orderBy: {
                    createdAt: "asc",
                },
            },
        },
    });
    const initialChannel = server?.channels[0];
    if (initialChannel?.name !== "general") return null;

    return redirect(`/servers/${server?.id}/channels/${initialChannel?.id}`);
}
