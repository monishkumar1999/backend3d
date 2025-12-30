import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../config/s3.js";
import path from "path";

/**
 * Uploads a buffer or data URL to S3
 * @param {Buffer|String} data - Buffer or Data URL (base64)
 * @param {String} folder - Folder name in bucket (e.g., 'designs/stickers')
 * @param {String} fileName - Desired filename
 * @param {String} mimeType - Optional mime type (if data is Buffer)
 * @returns {Promise<String>} - The S3 location URL
 */
export const uploadToS3 = async (data, folder, fileName, mimeType = "image/png") => {
    let body = data;
    let contentType = mimeType;

    if (typeof data === "string" && data.startsWith("data:")) {
        const matches = data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
            contentType = matches[1];
            body = Buffer.from(matches[2], "base64");
        }
    }

    const key = `${folder}/${Date.now()}-${fileName}`;

    const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET,
        Key: key,
        Body: body,
        ContentType: contentType,
        ACL: "public-read", // Adjust if needed, but usually designs are public-ish
    });

    await s3.send(command);

    // Return the URL. Note: Depending on your S3 config, you might need to construct this manually
    // if you're using a custom endpoint or if .location isn't available from .send()
    const region = process.env.AWS_REGION;
    const bucket = process.env.AWS_BUCKET;
    const endpoint = process.env.AWS_ENDPOINT;

    if (endpoint && endpoint.includes("localhost")) {
        return `${endpoint}/${bucket}/${key}`;
    }

    return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
};
