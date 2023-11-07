import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

export const currentProfile = async () => {
    try {
        const { userId } = auth();
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
