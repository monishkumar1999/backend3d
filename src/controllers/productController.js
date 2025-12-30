import Product from "../models/Product.js";
import ProductMesh from "../models/ProductMesh.js";
import sequelize from "../config/db.js";
import { createSignedUrl, signProductUrls } from "../utils/s3SignedUrl.js";


export const createProduct = async (req, res) => {
  const t = await sequelize.transaction();

  console.log("FILES:", req.files);
  console.log("BODY:", req.body);


  try {
    let productData = {};

    if (req.body.product_details && typeof req.body.product_details === "object") {
      productData = req.body.product_details;
    } else {
      for (const key in req.body) {
        if (key.startsWith("product_details[")) {
          const innerKey = key.match(/\[(.*?)\]/)[1];
          productData[innerKey] = req.body[key];
        }
      }
    }

    const glbFile = req.files.find(
      f => f.fieldname === "product_details[glb]" || f.fieldname === "glb"
    );

    if (!glbFile) throw new Error("GLB file missing");

    const newProduct = await Product.create({
      name: productData.name,
      subCategoryId: productData.subcategory || productData.subCategoryId,
      base_model_url: glbFile.location, // ✅ S3 URL
      slug: productData.slug || `${productData.name.toLowerCase().replace(/ /g, "-")}-${Date.now()}`,
      configuration: {},
    }, { transaction: t });

    const meshMap = {};

    if (req.body.svgdetails) {
      Object.entries(req.body.svgdetails).forEach(([index, item]) => {
        meshMap[index] = { mesh_name: item.mesh_name };
      });
    }

    for (const key in req.body) {
      const match = key.match(/svgdetails\[(\d+)\]\[(.*?)\]/);
      if (match) {
        const [, index, field] = match;
        if (!meshMap[index]) meshMap[index] = {};
        meshMap[index][field] = req.body[key];
      }
    }

    for (const file of req.files) {
      const match = file.fieldname.match(/svgdetails\[(\d+)\]\[(.*?)\]/);
      if (match) {
        const [, index, field] = match;
        if (!meshMap[index]) meshMap[index] = {};

        if (field === "white") meshMap[index].whiteMaskPath = file.location;      // ✅
        if (field === "original") meshMap[index].originalSvgPath = file.location; // ✅
      }
    }

    const meshPromises = Object.values(meshMap).map(meshData =>
      ProductMesh.create({
        productId: newProduct.id,
        meshName: meshData.mesh_name,
        whiteMaskPath: meshData.whiteMaskPath,
        originalSvgPath: meshData.originalSvgPath,
      }, { transaction: t })
    );

    await Promise.all(meshPromises);
    await t.commit();

    res.status(201).json({ success: true, product: newProduct });

  } catch (error) {
    await t.rollback();
    console.error("Error creating product:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};



export const getProductBySlug = async (req, res) => {
  try {


    const product = await Product.findOne({
      where: { id: req.params.slug },
      include: [{ model: ProductMesh, as: "meshes" }],
    });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const productJson = await signProductUrls(product.toJSON());

    res.json({ success: true, product: productJson });

  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};



export const getProductsList = async (req, res) => {
  try {
    const products = await Product.findAll({
      attributes: ['id', 'name', 'slug', 'thumbnail_url']
    });
    res.json({ success: true, products });
  } catch (error) {
    console.error("Error fetching product list:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
