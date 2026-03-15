const Order = require("../models/Order");
const Cart = require("../models/Cart");

exports.createOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;
    
    // تأكدي إن العنوان وصل كامل
    if (!shippingAddress || !shippingAddress.address) {
       return res.status(400).json({ message: "من فضلك أدخل بيانات العنوان كاملة" });
    }

    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "سلتك فارغة" });
    }

    // فلترة المنتجات عشان لو فيه منتج ممسوح ميبوظش الأوردر
    const validItems = cart.items.filter(item => item.product !== null);

    const orderItems = validItems.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.price || item.product.price, // استخدام السعر المتسيف في السلة أضمن
    }));

    const totalAmount = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      shippingAddress, // ده هينزل كـ Object (city, address, phone)
      totalPrice: totalAmount,
    });

    await Cart.findOneAndDelete({ user: req.user.id });
    res.status(201).json({ success: true, order });

  } catch (error) {
    console.error("ORDER_ERROR_LOG:", error); // السطر ده هيعرفك الغلط فين بالظبط في تيرمينال الـ VS Code
    res.status(500).json({ message: error.message });
  }
};

// لازم الاسم ده يكون نفس اللي في الـ Routes
exports.getMyOrders = async (req, res) => { 
  try {
    const orders = await Order.find({ user: req.user.id });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
};