const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Vendor = require("../models/Vendor");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const COMMISSION_RATE = 0.1; // 10%

/**
 * Create a new order from the current user's cart
 */
exports.createOrder = catchAsync(async (req, res, next) => {
  const { shippingAddress } = req.body;

  // 1) Validate shipping address
  if (!shippingAddress || !shippingAddress.address) {
    return next(
      new AppError("Please provide a complete shipping address to proceed", 400)
    );
  }

  // 2) Fetch user's cart and populate product details (including vendor)
  const cart = await Cart.findOne({ user: req.user.id }).populate({
    path: "items.product",
    select: "price vendor name",
  });

  if (!cart || cart.items.length === 0) {
    return next(
      new AppError("Your cart is empty. Cannot create an order", 400)
    );
  }

  // 3) Filter valid items
  const validItems = cart.items.filter((item) => item.product !== null);

  if (validItems.length === 0) {
    return next(
      new AppError(
        "Sorry, the products in your cart are no longer available",
        400
      )
    );
  }

  // 4) Prepare order items with commission
  const orderItems = validItems.map((item) => {
    const price = item.product.price;
    const quantity = item.quantity;

    const commission = price * COMMISSION_RATE;
    const vendorEarning = price - commission;

    return {
      product: item.product._id,
      vendor: item.product.vendor,
      quantity,
      price,
      commission,
      vendorEarning,
    };
  });

  // 5) Calculate totals
  const totalAmount = orderItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const totalCommission = orderItems.reduce(
    (acc, item) => acc + item.commission * item.quantity,
    0
  );

  // 6) Create order
  const order = await Order.create({
    user: req.user.id,
    items: orderItems,
    shippingAddress,
    totalPrice: totalAmount,
    totalCommission,
  });

  // 7) Clear cart
  await Cart.findOneAndDelete({ user: req.user.id });

  res.status(201).json({
    status: "success",
    data: {
      order,
    },
  });
});

/**
 * Get all orders for logged-in user
 */
exports.getMyOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id })
    .populate("items.product", "name image price")
    .sort("-createdAt");

  res.status(200).json({
    status: "success",
    results: orders.length,
    data: {
      orders,
    },
  });
});

/**
 * Get orders for vendor
 */
exports.getVendorOrders = catchAsync(async (req, res, next) => {
  const vendor = await Vendor.findOne({ user: req.user.id });

  if (!vendor) {
    return next(new AppError("Vendor profile not found", 404));
  }

  const vendorProductIds = await Product.find({
    vendor: vendor._id,
  }).distinct("_id");

  const orders = await Order.find({
    "items.product": { $in: vendorProductIds },
  })
    .populate("user", "name email")
    .populate("items.product", "name image price")
    .sort("-createdAt");

  res.status(200).json({
    status: "success",
    results: orders.length,
    data: {
      orders,
    },
  });
});