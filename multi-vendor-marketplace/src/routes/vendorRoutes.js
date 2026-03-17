const express = require("express");
const router = express.Router();
const { createVendor, getVendorProfile } = require("../controllers/vendorController");
const { protect } = require("../middlewares/authMiddleware"); // هننشئه بعدين

router.post("/", protect, createVendor);
router.get("/me", protect, getVendorProfile);

module.exports = router;