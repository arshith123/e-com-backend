import Product from "../models/productModel.js";
import fs from "fs";
import path from "path";


export const createOrUpdate = async (req, res) => {
  const { id } = req.body;

  if (id) {
    return update(req, res);
  } else {
    return insert(req, res);
  }
};


function parseSizes(sizes) {
  if (!sizes) return [];
  if (Array.isArray(sizes)) return sizes; // Already an array
  if (typeof sizes === 'string') {
    try {
      return JSON.parse(sizes);
    } catch {
      // fallback: split by comma and trim
      return sizes.split(',').map(s => s.trim().toUpperCase());
    }
  }
  return [];
}

// CREATE PRODUCT
export const insert = async (req, res) => {
  try {
    let { id, name, description, sellingPrice, discount, variants, category, sizes } = req.body;

    // Parse sizes safely
    sizes = parseSizes(sizes);

    // Parse variants if string
    if (typeof variants === 'string') {
      try {
        variants = JSON.parse(variants);
      } catch (err) {
        return res.status(400).json({ message: "Invalid JSON for variants." });
      }
    }

    // Basic validation
    if (!name || !description || sellingPrice == null || discount == null || !variants || !category || sizes.length === 0) {
      return res.status(400).json({ message: "All required fields must be filled." });
    }

    // Group uploaded files by fieldname
    const grouped = {};
    (req.files || []).forEach(file => {
      if (!grouped[file.fieldname]) grouped[file.fieldname] = [];
      grouped[file.fieldname].push(file);
    });

    // Process variants to add image paths
    const processedVariants = variants.map((variant, index) => {
      const mainImage = grouped['mainImages']?.[index];
      const sideImages = grouped[`sideImages${index}`] || [];

      return {
        ...variant,
        mainImage: mainImage ? `/uploads/${mainImage.filename}` : null,
        sideImages: sideImages.map(img => `/uploads/${img.filename}`),
      };
    });

    // Create new product
    const newProduct = new Product({
      name,
      category,
      description,
      sellingPrice,
      discount,
      sizes,
      variants: processedVariants,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({
      message:"Saved Succesfully".
      savedProduct});

  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(500).json({ message: "Server error while creating product." });
  }
};

// UPDATE PRODUCT
export const update = async (req, res) => {
  try {
    let { id, name, description, sellingPrice, discount, variants, category, sizes } = req.body;

    if (!id || !name || !description || sellingPrice == null || discount == null || !variants || !category || !sizes) {
      return res.status(400).json({ message: "All required fields must be filled." });
    }

    // Parse sizes safely
    sizes = parseSizes(sizes);

    // Parse variants if string
    if (typeof variants === 'string') {
      variants = JSON.parse(variants);
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Group uploaded files
    const grouped = {};
    (req.files || []).forEach(file => {
      if (!grouped[file.fieldname]) grouped[file.fieldname] = [];
      grouped[file.fieldname].push(file);
    });

    // Process variants with image paths or keep old images if no new uploads
    const processedVariants = variants.map((variant, index) => {
      const mainImageFile = grouped['mainImages']?.[index];
      const sideImagesFiles = grouped[`sideImages${index}`] || [];

      return {
        ...variant,
        mainImage: mainImageFile
          ? `/uploads/${mainImageFile.filename}`
          : product.variants[index]?.mainImage || null,
        sideImages: sideImagesFiles.length > 0
          ? sideImagesFiles.map(img => `/uploads/${img.filename}`)
          : product.variants[index]?.sideImages || [],
      };
    });

    product.name = name;
    product.description = description;
    product.sellingPrice = sellingPrice;
    product.discount = discount;
    product.category = category;
    product.sizes = sizes;
    product.variants = processedVariants;

    const updatedProduct = await product.save();
    res.status(200).json({
      message: 'Update successful',
      product: updatedProduct
    });

  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({ message: "Server error while updating product." });
  }
};



// function to list all product and filter
export const getIntialData = async (req, res) => {
  try {
    const { name, inStock, sortPrice, category } = req.query;

    const filter = {};

    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }

    if (inStock === 'true') {
      filter['variants.stock'] = { $gt: 0 };
    }

    if (category) {
      filter.category = category;
    }

    let sort = {};

    if (sortPrice) {
      if (sortPrice === 'low') {
        sort.sellingPrice = 1;
      } else if (sortPrice === 'high') {
        sort.sellingPrice = -1;
      }
    }

    const products = await Product.find(filter).sort(sort);

    res.status(200).json(products);
  } catch (error) {
    console.error('Search Products Error:', error);
    res.status(500).json({ message: 'Server error while searching products.' });
  }
};



//function for delteion of images
export const delteImages = (imagePaths) => {
  imagePaths.forEach(img => {
    const filePath = path.join(process.cwd(), "uploads", path.basename(img));
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`failed to delete image files: ${filePath}`, err);
      }
    });
  });
};



export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found." });

    const allImagePaths = [];
    product.variants.forEach(variant => {
      if (variant.mainImage) allImagePaths.push(variant.mainImage);
      if (variant.sideImages?.length) allImagePaths.push(...variant.sideImages);
    });

    delteImages(allImagePaths);

    await product.deleteOne();

    res.status(200).json({ message: "Product deleted successfully." });
  } catch (error) {
    console.error("Delete Product Error:", error);
    res.status(500).json({ message: "Server error while deleting product." });
  }
}