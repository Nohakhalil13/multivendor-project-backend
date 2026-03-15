const Product = require("../models/Product");
const Vendor = require("../models/Vendor");

// إضافة منتج جديد مع صورة
// إضافة منتج جديد مع صورة - نسخة تصحيح الأخطاء
exports.createProduct = async (req, res) => {
  try {
    console.log("--- New Upload Attempt ---");
    console.log("1. Body Data:", req.body);
    console.log("2. File Data:", req.file);

    // التأكد من وجود الفيندور
    const vendor = await Vendor.findOne({ user: req.user.id });
    if (!vendor) {
      console.log("❌ Error: Vendor not found for user ID:", req.user.id);
      return res.status(400).json({ message: "Vendor profile missing" });
    }

    const { name, description, price, stock, category } = req.body;

    // التأكد من وجود الـ Category قبل ما نبعتها للمونجو
    if (!category || category === "undefined" || category === "") {
      console.log("❌ Error: Category ID is missing or invalid");
      return res.status(400).json({ message: "Please select a valid category" });
    }

    const imageUrl = req.file ? req.file.path : "";

    // إنشاء المنتج
    const product = await Product.create({
      name,
      description,
      price: Number(price), // تحويل السعر لرقم لضمان الفاليديشن
      stock: Number(stock), // تحويل الاستوك لرقم
      category: category.trim(), 
      image: imageUrl,
      vendor: vendor._id,
    });

    console.log("✅ Product Created Successfully!");
    res.status(201).json(product);

  } catch (error) {
    // السطر ده هيطبع لك في التيرمينال بالظبط إيه اللي ناقص (اسم الحقل)
    if (error.name === "ValidationError") {
      console.error("❌ Mongoose Validation Error:", error.message);
      return res.status(400).json({ message: "Validation Error: " + error.message });
    }
    
    console.error("❌ FULL ERROR:", error);
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

// جلب كل المنتجات (للمشترين)
// جلب كل المنتجات (للمشترين)
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category", "name")
      .populate({
        path: "vendor",
        select: "name email", // لو الـ ref على User، استخدمي الحقول اللي في User زي Name
      });
    
    console.log("Products found:", products.length); // عشان نتأكد في التيرمينال
    res.status(200).json(products);
  } catch (error) {
    console.error("Error Fetching Products:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// جلب منتجات الفيندور الحالي
exports.getVendorProducts = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user.id });
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    const products = await Product.find({ vendor: vendor._id }).populate("category", "name");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// تحديث منتج (بما في ذلك الصورة)
exports.updateProduct = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user.id });
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    // التأكد إن الفيندور هو صاحب المنتج
    if (product.vendor.toString() !== vendor._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updateData = { ...req.body };

    // لو الفيندور رفع صورة جديدة في التعديل، نحدث اللينك
    if (req.file) {
      updateData.image = req.file.path;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// حذف منتج
exports.deleteProduct = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user.id });
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.vendor.toString() !== vendor._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await product.deleteOne();
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};