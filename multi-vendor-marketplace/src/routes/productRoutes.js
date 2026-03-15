const express = require("express");
const router = express.Router();
// استيراد الميدل وير اللي هيتعامل مع الصور (هننشئه في الخطوة الجاية)
const upload = require("../middlewares/uploadMiddleware"); 

const {
  createProduct,
  getProducts,
  getVendorProducts,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");

const { protect } = require("../middlewares/authMiddleware");

// جلب كل المنتجات (عام)
router.get("/", getProducts);

// جلب منتجات الفيندور (خاص بالفيندور)
router.get("/vendor", protect, getVendorProducts);

// إضافة منتج جديد - ضفنا upload.single("image")
// ده معناه: "يا باك إند، لو لقيت ملف مبعوت باسم image، استقبله"
router.post("/", protect, upload.single("image"), createProduct);

// تعديل منتج - برضه ضفنا إمكانية تعديل الصورة
router.put("/:id", protect, upload.single("image"), updateProduct);

router.delete("/:id", protect, deleteProduct);

module.exports = router;