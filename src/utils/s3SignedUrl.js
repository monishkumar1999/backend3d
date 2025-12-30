import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3 from "../config/s3.js";

export const createSignedUrl = async (key, expiresIn = 3600) => {
    if (!key) return null;
    const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET,
        Key: key,
    });

    return await getSignedUrl(s3, command, { expiresIn });
};

/**
 * Signs a full S3 URL by extracting the key
 * @param {string} fullUrl 
 * @returns {Promise<string>} signed URL
 */
export const signUrlByFullUrl = async (fullUrl) => {
    if (!fullUrl || typeof fullUrl !== 'string' || !fullUrl.startsWith('http')) {
        return fullUrl;
    }

    try {
        const url = new URL(fullUrl);
        let key = url.pathname.substring(1); // Remove leading slash

        // Remove bucket name from path if present (MinIO/Localstack style)
        const bucketMatch = new RegExp(`^${process.env.AWS_BUCKET}/`);
        key = key.replace(bucketMatch, "");

        return await createSignedUrl(key);
    } catch (error) {
        console.error("Error signing URL:", fullUrl, error);
        return fullUrl;
    }
};

/**
 * Signs all URLs within a product object (base_model_url and meshes)
 * @param {object} product 
 * @returns {Promise<object>} product with signed URLs
 */
export const signProductUrls = async (product) => {
    if (!product) return product;

    if (product.base_model_url) {
        product.base_model_url = await signUrlByFullUrl(product.base_model_url);
    }

    if (product.meshes && Array.isArray(product.meshes)) {
        for (const mesh of product.meshes) {
            if (mesh.whiteMaskPath) {
                mesh.whiteMaskPath = await signUrlByFullUrl(mesh.whiteMaskPath);
            }
            if (mesh.originalSvgPath) {
                mesh.originalSvgPath = await signUrlByFullUrl(mesh.originalSvgPath);
            }
        }
    }

    return product;
};

/**
 * Signs all URLs within a design object (nested product and stickers)
 * @param {object} design 
 * @returns {Promise<object>} design with signed URLs
 */
export const signDesignUrls = async (design) => {
    if (!design) return design;

    // Handle nested Product
    if (design.Product) {
        design.Product = await signProductUrls(design.Product);
    }

    // Handle stickers in designData
    if (design.designData) {
        let isString = false;
        let designData = design.designData;

        if (typeof designData === 'string') {
            try {
                designData = JSON.parse(designData);
                isString = true;
            } catch (e) {
                console.error("Failed to parse designData string", e);
                return design;
            }
        }

        if (designData.meshStickers) {
            for (const [meshName, stickers] of Object.entries(designData.meshStickers)) {
                if (Array.isArray(stickers)) {
                    for (const sticker of stickers) {
                        if (sticker.url) {
                            sticker.url = await signUrlByFullUrl(sticker.url);
                        }
                    }
                } else if (typeof stickers === 'object' && stickers !== null) {
                    for (const sticker of Object.values(stickers)) {
                        if (sticker.url) {
                            sticker.url = await signUrlByFullUrl(sticker.url);
                        }
                    }
                }
            }
        }

        if (isString) {
            design.designData = JSON.stringify(designData);
        } else {
            design.designData = designData;
        }
    }

    return design;
};
