import { redirect } from "next/navigation";

import { redirectToSignIn } from "@clerk/nextjs";

import { currentProfile } from "@/lib/current-profile";

import { db } from "@/lib/db";
import { ROLE } from "@prisma/client";

interface InviteCodePageProps {
    params: {
        inviteCode: string;
    };
}
export default async function InviteCodepage({ params }: InviteCodePageProps) {
    const profile = await currentProfile();
    if (!profile) return redirectToSignIn();

    if (!params.inviteCode) return redirect("/create-server");

    const alreadyInServer = await db.server.findFirst({
        where: {
            inviteCode: params.inviteCode,
            members: {
                some: {
                    profileId: profile.id,
                },
            },
        },
    });

    if (alreadyInServer) return redirect(`/servers/${alreadyInServer.id}`);

    const server = await db.server.update({
        where: {
            inviteCode: params.inviteCode,
        },
        data: {
            members: {
                create: [
                    {
                        profileId: profile.id,
                        role: ROLE.GUEST,
                    },
                ],
            },
        },
    });

    if (server) return redirect(`/servers/${server.id}`);
    return null;
}
