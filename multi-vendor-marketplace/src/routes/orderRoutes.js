const express = require("express");
const router = express.Router();
const { 
  createOrder, 
  getMyOrders, 
  getVendorOrders // ضيفي الاستيراد ده
} = require("../controllers/orderController");

const { protect } = require("../middlewares/authMiddleware");

// 1. للمشتري: إنشاء طلب جديد
router.post("/", protect, createOrder);

// 2. للمشتري: رؤية طلباته الشخصية
router.get("/my", protect, getMyOrders);

// 3. للتاجر: رؤية الطلبات اللي تخص منتجاته (السطر اللي سألتي عليه)
router.get("/vendor/orders", protect, getVendorOrders);

module.exports = router;