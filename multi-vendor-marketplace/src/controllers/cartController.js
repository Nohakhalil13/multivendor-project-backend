const Cart = require("../models/Cart");
const Product = require("../models/Product");

// 1. إضافة منتج للسلة (شغالة تمام عندك)
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [{ product: productId, quantity, price: product.price }],
      });
    } else {
      const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity, price: product.price });
      }
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// 2. جلب سلة المستخدم (حدثتها عشان تجيب الصورة image)
exports.getCart = async (req, res) => {
  try {
    // ضفت "image" هنا عشان تظهر في الكارت
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product", "name price image");
    
    if (!cart) return res.status(200).json({ cart: { items: [] }, total: 0 });

    const total = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    res.status(200).json({ cart, total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// 3. 👇 تحديث الكمية (مهمة لزراير + و -)
exports.updateCartQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      await cart.save();
      res.status(200).json(cart);
    } else {
      res.status(404).json({ message: "Item not found in cart" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating quantity" });
  }
};

// 4. 👇 حذف منتج من السلة (مهمة لزرار إزالة)
exports.removeItemFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // فلترة المنتجات عشان نشيل المنتج اللي اخترناه
    cart.items = cart.items.filter(item => item.product.toString() !== req.params.productId);

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error removing item" });
  }
};