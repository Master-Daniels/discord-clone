import { NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";

import { db } from "@/lib/db";
import { ROLE } from "@prisma/client";

export async function POST(req: Request) {
    try {
        const { name, type } = await req.json();
        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get("serverId");

        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!serverId) return new NextResponse("Server ID missing", { status: 400 });
        if (name === "general") return new NextResponse('Name cannot be "general"', { status: 401 });

        const server = await db.server.update({
            where: {
                id: serverId,
                members: { some: { profileId: profile.id, role: { in: [ROLE.ADMIN, ROLE.MODERATOR] } } },
            },
            data: {
                channels: {
                    create: [
                        {
                            name,
                            type,
                            profileId: profile.id,
                        },
                    ],
                },
            },
        });
        return NextResponse.json({ server });
    } catch (error) {
        console.log("[CHANNELS_POST]: ", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
