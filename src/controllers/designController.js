import UserDesign from '../models/UserDesign.js';
import Product from '../models/Product.js';
import { uploadToS3 } from '../utils/s3Upload.js';
import { signDesignUrls } from '../utils/s3SignedUrl.js';

export const saveUserDesign = async (req, res) => {
    try {
        const { productId, designData, designName } = req.body;

        // 1. Validate basic input
        if (!productId || !designData) {
            return res.status(400).json({
                message: "Missing required fields: productId and designData are required."
            });
        }

        // 2. Check if product exists (Optional but recommended)
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        // 3. Handle S3 uploads for stickers if they are data URLs
        if (designData.meshStickers) {
            for (const [meshName, stickers] of Object.entries(designData.meshStickers)) {
                if (Array.isArray(stickers)) {
                    for (let i = 0; i < stickers.length; i++) {
                        const sticker = stickers[i];
                        if (sticker.url && sticker.url.startsWith('data:')) {
                            const fileName = `${productId}_${meshName}_sticker_${i}.png`;
                            const s3Url = await uploadToS3(sticker.url, 'designs/stickers', fileName);
                            sticker.url = s3Url;
                        }
                    }
                } else if (typeof stickers === 'object' && stickers !== null) {
                    // Handle case where meshStickers might be an object of stickers instead of array
                    for (const [stickerId, sticker] of Object.entries(stickers)) {
                        if (sticker.url && sticker.url.startsWith('data:')) {
                            const fileName = `${productId}_${meshName}_${stickerId}.png`;
                            const s3Url = await uploadToS3(sticker.url, 'designs/stickers', fileName);
                            sticker.url = s3Url;
                        }
                    }
                }
            }
        }

        // 4. Create the design entry
        const design = await UserDesign.create({
            productId,
            designData,
            designName: designName || 'My Custom Design'
        });

        return res.status(201).json({
            success: true,
            message: "Design saved successfully",
            data: design
        });

    } catch (error) {
        console.error("Error saving design:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

export const getUserDesigns = async (req, res) => {

    try {
        const designs = await UserDesign.findAll({
            include: [{ model: Product, as: 'Product' }],
            order: [['createdAt', 'DESC']]
        });
        const signedDesigns = await Promise.all(designs.map(d => signDesignUrls(d.toJSON())));

        return res.status(200).json({
            success: true,
            data: signedDesigns
        });
    } catch (error) {
        console.error("Error fetching designs:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

export const getDesignById = async (req, res) => {
    try {
        const { id } = req.params;
        const design = await UserDesign.findByPk(id, {
            include: [{ model: Product, as: 'Product' }]
        });

        if (!design) {
            return res.status(404).json({ message: "Design not found" });
        }

        const signedDesign = await signDesignUrls(design.toJSON());

        return res.status(200).json(signedDesign);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
