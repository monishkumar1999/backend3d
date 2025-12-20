import Product from "../models/Product.js";
import ProductMesh from "../models/ProductMesh.js";
import sequelize from "../config/db.js";

export const createProduct = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    // console.log("Req Body:", req.body);
    // console.log("Req Files:", req.files);

    // 1. Parse product details from req.body
    // Multer might produce keys like 'product_details[name]' or nested objects depending on setup.
    // We will handle both cases or assume flattened keys if that's what multer gives by default.
    // To be safe, let's construct an object manually if needed.

    let productData = {};
    if (req.body.product_details && typeof req.body.product_details === 'object' && !Array.isArray(req.body.product_details)) {
      productData = req.body.product_details;
    } else {
      // Parse keys like "product_details[name]"
      for (const key in req.body) {
        if (key.startsWith('product_details[')) {
          const innerKey = key.match(/\[(.*?)\]/)[1];
          productData[innerKey] = req.body[key];
        }
      }
    }

    // 2. Find GLB file
    const glbFile = req.files.find(f => f.fieldname === 'product_details[glb]' || f.fieldname === 'glb');
    if (!glbFile) {
      throw new Error("GLB file is deleting/missing");
    }

    // 3. Create Product
    const newProduct = await Product.create({
      name: productData.name,
      subCategoryId: productData.subcategory || productData.subCategoryId,
      base_model_url: 'uploads/products/' + glbFile.filename, // Using relative path
      slug: productData.slug || (productData.name.toLowerCase().replace(/ /g, '-') + '-' + Date.now()), // Auto-generate slug if missing
      configuration: {}, // Default empty config
    }, { transaction: t });

    // 4. Parse SVG details and Map Files
    // We need to group text fields for meshes and their corresponding files.
    // Expected keys: svgdetails[0][mesh_name], svgdetails[0][white] (file), etc.
    // OR nested: req.body.svgdetails = [{ mesh_name: '...' }]

    const meshMap = {}; // index -> { mesh_name, whiteMaskPath, originalSvgPath }

    // Helper to separate nested vs flat
    if (req.body.svgdetails) {
      if (Array.isArray(req.body.svgdetails)) {
        req.body.svgdetails.forEach((item, index) => {
          if (!meshMap[index]) meshMap[index] = {};
          if (item.mesh_name) meshMap[index].mesh_name = item.mesh_name;
        });
      } else if (typeof req.body.svgdetails === 'object') {
        for (const index in req.body.svgdetails) {
          if (!meshMap[index]) meshMap[index] = {};
          if (req.body.svgdetails[index].mesh_name) meshMap[index].mesh_name = req.body.svgdetails[index].mesh_name;
        }
      }
    }

    // Also populate from flat keys if any (fallback)
    for (const key in req.body) {
      if (key.startsWith('svgdetails[')) {
        const match = key.match(/svgdetails\[(\d+)\]\[(.*?)\]/);
        if (match) {
          const index = match[1];
          const field = match[2];
          if (!meshMap[index]) meshMap[index] = {};
          meshMap[index][field] = req.body[key];
        }
      }
    }

    // Parse Files for SVGs
    for (const file of req.files) {
      if (file.fieldname.startsWith('svgdetails[')) {
        const match = file.fieldname.match(/svgdetails\[(\d+)\]\[(.*?)\]/);
        if (match) {
          const index = match[1];
          const field = match[2]; // 'white' or 'original'
          if (!meshMap[index]) meshMap[index] = {};

          // Map field to db column
          if (field === 'white') meshMap[index].whiteMaskPath = 'uploads/products/' + file.filename;
          if (field === 'original') meshMap[index].originalSvgPath = 'uploads/products/' + file.filename;
        }
      }
    }

    // 5. Create ProductMesh entries
    const meshPromises = Object.values(meshMap).map(meshData => {
      return ProductMesh.create({
        productId: newProduct.id,
        meshName: meshData.mesh_name,
        whiteMaskPath: meshData.whiteMaskPath,
        originalSvgPath: meshData.originalSvgPath,
      }, { transaction: t });
    });

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
      include: [{ model: ProductMesh, as: 'meshes' }]
    });
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, product });
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
