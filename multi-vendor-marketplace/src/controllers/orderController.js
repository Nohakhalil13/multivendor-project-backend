const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Vendor = require("../models/Vendor");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

/**
 * Create a new order from the current user's cart
 */
exports.createOrder = catchAsync(async (req, res, next) => {
  const { shippingAddress } = req.body;
  
  // 1) Validate shipping address
  if (!shippingAddress || !shippingAddress.address) {
    return next(new AppError("Please provide a complete shipping address to proceed", 400));
  }

  // 2) Fetch user's cart and populate product details
  const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");

  if (!cart || cart.items.length === 0) {
    return next(new AppError("Your cart is empty. Cannot create an order", 400));
  }

  // 3) Filter valid items (ensure products still exist in the database)
  const validItems = cart.items.filter(item => item.product !== null);
  if (validItems.length === 0) {
    return next(new AppError("Sorry, the products in your cart are no longer available", 400));
  }

  // 4) Prepare order items data
  const orderItems = validItems.map((item) => ({
    product: item.product._id,
    quantity: item.quantity,
    price: item.product.price, // Lock in the current price at the time of purchase
  }));

  // 5) Calculate total amount
  const totalAmount = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // 6) Create the order record
  const order = await Order.create({
    user: req.user.id,
    items: orderItems,
    shippingAddress,
    totalPrice: totalAmount,
  });

  // 7) Clear the user's cart after successful order creation
  await Cart.findOneAndDelete({ user: req.user.id });

  res.status(201).json({
    status: "success",
    data: {
      order
    },
  });
});

/**
 * Get all orders placed by the current logged-in customer
 */
exports.getMyOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id })
    .populate("items.product", "name image price")
    .sort("-createdAt"); // Newest orders first

  res.status(200).json({
    status: "success",
    results: orders.length,
    data: {
      orders
    },
  });
});

/**
 * Get orders that contain products belonging to the current vendor
 */
exports.getVendorOrders = catchAsync(async (req, res, next) => {
  // 1) Find vendor profile associated with the user
  const vendor = await Vendor.findOne({ user: req.user.id });
  if (!vendor) {
    return next(new AppError("Vendor profile not found", 404));
  }

  // 2) Get IDs of products owned by this vendor
  const vendorProductIds = await Product.find({ vendor: vendor._id }).distinct("_id");
  
  // 3) Find orders containing any of these vendor products
  const orders = await Order.find({ "items.product": { $in: vendorProductIds } })
    .populate("user", "name email")
    .populate("items.product", "name image price")
    .sort("-createdAt");

  res.status(200).json({
    status: "success",
    results: orders.length,
    data: {
      orders
    },
  });
});