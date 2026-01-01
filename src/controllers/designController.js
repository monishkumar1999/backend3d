import UserDesign from '../models/UserDesign.js';
import Product from '../models/Product.js';
import { uploadToS3 } from '../utils/s3Upload.js';
import { signDesignUrls } from '../utils/s3SignedUrl.js';

export const saveUserDesign = async (req, res) => {
    try {
        let { productId, designData, designName, design_data } = req.body;

        // Handle input names consistently
        designData = designData || design_data;

        // 1. Validate basic input
        if (!productId || !designData) {
            return res.status(400).json({
                message: "Missing required fields: productId and designData are required."
            });
        }

        // If designData is a string (from multipart/form-data), parse it
        if (typeof designData === 'string') {
            try {
                designData = JSON.parse(designData);
            } catch (e) {
                return res.status(400).json({ message: "Invalid JSON format for designData" });
            }
        }

        // 2. Check if product exists
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        // 3. Handle S3 uploads for stickers
        if (designData.meshStickers) {
            const files = req.files || [];

            for (const [meshName, stickers] of Object.entries(designData.meshStickers)) {
                if (!Array.isArray(stickers)) continue;

                for (let i = 0; i < stickers.length; i++) {
                    const sticker = stickers[i];

                    // A. Check if the sticker was uploaded as a file (matching by sticker id or a custom field)
                    // We assume the frontend sends the file with the field name equal to the sticker id
                    const uploadedFile = files.find(f => f.fieldname === sticker.id || f.fieldname === `sticker_${sticker.id}`);

                    if (uploadedFile) {
                        // Use the S3 location from multer-s3
                        sticker.url = uploadedFile.location;
                    }
                    // B. Else check if it's a data URL (base64)
                    else if (sticker.url && sticker.url.startsWith('data:')) {
                        const fileName = `${productId}_${meshName}_sticker_${sticker.id || i}.png`;
                        const s3Url = await uploadToS3(sticker.url, 'users_stickers', fileName);
                        sticker.url = s3Url;
                    }
                    // C. Note: If it's a blob URL and wasn't uploaded, it will likely fail on the frontend or be broken here.
                }
            }
        }

        // 4. Create the design entry
        const design = await UserDesign.create({
            productId,
            designData,
            designName: designName || 'My Custom Design',
            customerId: req.user?.id // Save customer ID if available
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
        const queryOptions = {
            include: [{ model: Product, as: 'Product' }],
            order: [['createdAt', 'DESC']]
        };

        // Filter by customerId if user is a customer
        if (req.user && req.user.role === 'customer') {
            queryOptions.where = { customerId: req.user.id };
        }

        const designs = await UserDesign.findAll(queryOptions);
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
