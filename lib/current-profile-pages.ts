import { NextApiRequest } from "next";

import { getAuth } from "@clerk/nextjs/server";

import { db } from "@/lib/db";

export const currentProfilePages = async (req: NextApiRequest) => {
    try {
        const { userId } = getAuth(req);
        if (!userId) return null;
        return await db.profile.findUnique({
            where: {
                userId,
            },
        });
    } catch (err) {
        console.log(err);
    }
};
