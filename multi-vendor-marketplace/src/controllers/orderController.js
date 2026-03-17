const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product"); // ضيفي السطر ده
const Vendor = require("../models/Vendor");   // وضيفي السطر ده

exports.createOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;
    
    if (!shippingAddress || !shippingAddress.address) {
       return res.status(400).json({ message: "من فضلك أدخل بيانات العنوان كاملة" });
    }

    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "سلتك فارغة" });
    }

    const validItems = cart.items.filter(item => item.product !== null);

    const orderItems = validItems.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.price || item.product.price,
    }));

    const totalAmount = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      shippingAddress,
      totalPrice: totalAmount,
    });

    await Cart.findOneAndDelete({ user: req.user.id });
    res.status(201).json({ success: true, order });

  } catch (error) {
    console.error("ORDER_ERROR_LOG:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getMyOrders = async (req, res) => { 
  try {
    const orders = await Order.find({ user: req.user.id });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
};

exports.getVendorOrders = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user.id });
    if (!vendor) return res.status(404).json({ message: "Vendor profile not found" });

    // بنجيب الأوردرات اللي فيها منتجات تخص التاجر ده
    const vendorProductIds = await Product.find({ vendor: vendor._id }).distinct("_id");
    
    const orders = await Order.find({ "items.product": { $in: vendorProductIds } })
      .populate("user", "name email")
      .populate("items.product");

    res.status(200).json(orders);
  } catch (error) {
    console.error("VENDOR_ORDER_ERROR:", error);
    res.status(500).json({ message: "Error fetching orders" });
  }
};