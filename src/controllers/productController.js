import Product from "../models/Product.js";
import { v4 as uuidv4 } from "uuid";

// SAVE PRODUCT
export const saveProduct = async (req, res) => {
  try {
    const {
      name,
      modelSource,
      stickerZones,
      materialZones,
      variantGroups,
      globalTransform,
    } = req.body;

    const slug =
      name.toLowerCase().replace(/ /g, "-") + "-" + Date.now();

    const configData = {
      globalTransform,
      variantGroups,
      stickerZones,
      materialZones,
    };

    const newProduct = await Product.create({
      name,
      slug,
      base_model_url: modelSource,
      configuration: configData,
    });

    res.status(201).json({
      success: true,
      message: "Product configuration saved successfully",
      productId: newProduct.id,
      slug: newProduct.slug,
    });
  } catch (error) {
    console.error("Error saving product:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// GET PRODUCT BY SLUG
export const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const product = await Product.findOne({ where: { slug } });

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const responseData = {
      id: product.id,
      name: product.name,
      modelSource: product.base_model_url,
      ...product.configuration,
    };

    res.status(200).json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res
      .status(500)
      .json({ success: false, message: "Server Error" });
  }
};
