const Vendor = require("../models/Vendor");
const User = require("../models/User");

// إنشاء متجر جديد
exports.createVendor = async (req, res) => {
  try {
    const { storeName } = req.body;
    const userId = req.user.id; // هنعمل auth middleware بعدين

    const existingVendor = await Vendor.findOne({ user: userId });
    if (existingVendor)
      return res.status(400).json({ message: "Vendor already exists" });

    const vendor = await Vendor.create({
      user: userId,
      storeName,
      status: "pending",
    });

    res.status(201).json(vendor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// جلب بيانات Vendor حسب المستخدم
exports.getVendorProfile = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user.id }).populate("user", "name email role");
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    res.status(200).json(vendor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// جلب الطلبات اللي فيها منتجات التاجر الحالي
exports.getVendorOrders = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user.id });
    if (!vendor) return res.status(404).json({ message: "Vendor profile not found" });

    // بنبحث عن الأوردرات اللي فيها منتج الـ vendor ID بتاعه موجود في الـ items
    const orders = await Order.find({ "items.product": { $in: await Product.find({ vendor: vendor._id }).distinct("_id") } })
      .populate("user", "name email")
      .populate("items.product");

    // فلترة الأوردر عشان التاجر يشوف حاجته بس (اختياري حسب رغبتك)
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching vendor orders" });
  }
};