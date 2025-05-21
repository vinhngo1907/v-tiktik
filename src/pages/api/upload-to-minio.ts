// pages/api/upload-to-minio.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { Client } from "minio";
import { IncomingForm } from "formidable";
import fs from "fs";

export const config = {
    api: {
        bodyParser: false,
    },
};

export const minioClient = new Client({
    endPoint: process.env.MINIO_ENDPOINT!,
    port: parseInt(process.env.MINIO_PORT!, 10),
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: process.env.MINIO_ACCESS_KEY!,
    secretKey: process.env.MINIO_SECRET_KEY!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const form = new IncomingForm();
    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error("Formidable error:", err);
            return res.status(500).json({ error: "Failed to parse form" });
        }

        const fileOrFiles = files.file;
        if (!fileOrFiles) return res.status(400).json({ error: "No file uploaded" });

        const file = Array.isArray(fileOrFiles) ? fileOrFiles[0] : fileOrFiles;
        if (!file || !file.filepath) {
            return res.status(400).json({ error: "Invalid file uploaded" });
        }

        const bucket = process.env.MINIO_BUCKET_NAME!;
        const objectName = file.originalFilename || file.newFilename || `upload-${Date.now()}`;
        const fileStream = fs.createReadStream(file.filepath);

        try {
            await minioClient.putObject(bucket, objectName, fileStream, undefined, {
                "Content-Type": file.mimetype || "application/octet-stream",
            });

            const publicURL = `${process.env.MINIO_PUBLIC_URL}/${bucket}/${objectName}`;
            return res.status(200).json({ url: publicURL });
        } catch (e) {
            console.error("Error: >>>>>>", e);
            return res.status(500).json({ error: "Failed to upload to MinIO" });
        }
    });
}
