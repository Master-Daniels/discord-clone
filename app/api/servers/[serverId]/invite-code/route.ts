import { randomUUID } from "crypto";

import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";

export async function PATCH(req: Request, { params }: { params: { serverId: string } }) {
    try {
        const profile = await currentProfile();
        if (!profile) return new NextResponse("Unauthorized", { status: 401 });

        const serverId = params.serverId;
        if (!serverId) return new NextResponse("Missing ServerId", { status: 400 });

        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id,
            },
            data: {
                inviteCode: randomUUID(),
            },
        });

        return NextResponse.json(server);
    } catch (error) {
        console.log("[SERVER_ID]: ", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
