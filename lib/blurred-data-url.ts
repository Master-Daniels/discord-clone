import { getPlaiceholder } from "plaiceholder";

export const blurredDataUrl = async (url: string) => {
    try {
        const buffer = Buffer.from(url);

        const { base64 } = await getPlaiceholder(buffer);

        return base64;
    } catch (err) {
        console.log(err);
    }
};
