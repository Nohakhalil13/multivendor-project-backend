const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { 
  addToCart, 
  getCart, 
  updateCartQuantity, // هنضيف دي
  removeItemFromCart  // وهنضيف دي
} = require("../controllers/cartController");

const router = express.Router();

// كل العمليات محتاجة حماية (token)
router.get("/", protect, getCart);             // عرض الكارت
router.post("/", protect, addToCart);          // إضافة منتج جديد
router.put("/", protect, updateCartQuantity);   // تحديث الكمية (+ أو -)
router.delete("/:productId", protect, removeItemFromCart); // مسح منتج من الكارت

module.exports = router;