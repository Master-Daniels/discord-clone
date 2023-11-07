import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ROLE } from "@prisma/client";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: { channelId: string } }) {
    try {
        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get("serverId");
        if (!serverId) {
            return new NextResponse("Server ID missing", { status: 401 });
        }

        const { channelId } = params;
        if (!channelId) {
            return new NextResponse("Missing Channel ID", { status: 400 });
        }

        const profile = await currentProfile();
        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [ROLE.ADMIN, ROLE.MODERATOR],
                        },
                    },
                },
            },
            data: {
                channels: {
                    delete: {
                        id: channelId,
                        name: {
                            not: "general",
                        },
                    },
                },
            },
        });
        return NextResponse.json(server);
    } catch (error) {
        console.log("[CHANNEL_ID_DELETE]: ", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: { channelId: string } }) {
    try {
        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get("serverId");
        if (!serverId) {
            return new NextResponse("Server ID missing", { status: 401 });
        }

        const { channelId } = params;
        if (!channelId) {
            return new NextResponse("Missing Channel ID", { status: 400 });
        }

        const profile = await currentProfile();
        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { name, type } = await req.json();
        if (name === "general") {
            return new NextResponse("Name cannotbe general", { status: 403 });
        }
        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [ROLE.ADMIN, ROLE.MODERATOR],
                        },
                    },
                },
            },
            data: {
                channels: {
                    update: {
                        where: {
                            id: channelId,
                            NOT: {
                                name: "general",
                            },
                        },
                        data: {
                            name,
                            type,
                        },
                    },
                },
            },
        });
        return NextResponse.json(server);
    } catch (error) {
        console.log("[CHANNEL_ID_PATCH]: ", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
