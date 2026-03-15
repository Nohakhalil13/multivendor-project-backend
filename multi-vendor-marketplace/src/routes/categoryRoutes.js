const express = require("express");
const router = express.Router();
const { createCategory, getCategories } = require("../controllers/categoryController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/", protect, createCategory);
router.get("/", getCategories);

module.exports = router;