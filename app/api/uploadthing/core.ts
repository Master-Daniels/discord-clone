import { auth } from "@clerk/nextjs";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const getAuth = () => {
    const { userId } = auth();
    if (!userId) throw new Error("Unauthorized");
    return { userId };
};

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    serverImage: f({
        image: {
            maxFileSize: "8MB",
            maxFileCount: 1,
        },
    })
        .middleware(getAuth)
        .onUploadComplete(() => {}),

    messageFile: f(["image", "pdf", "text"])
        .middleware(getAuth)
        .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
