const express = require("express");
const app = express();
const helmet = require("helmet");
const cors = require("cors");

// middlewares
app.use(express.json());

// 🟢 مهم: خلي CORS قبل أي route
// في ملف app.js (الباك إند)
app.use(cors({
  origin: "*", // دي هتخليه يقبل من 3000 و 3001 ومن أي مكان
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

// Optional: ممكن تحطي helmet بعد CORS
// app.use(helmet());

// routes
const authRoutes = require("./routes/authRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// test route
app.get("/", (req, res) => {
  res.send("Marketplace API Running");
});

// global error handler لو حابة تفصليه دلوقتي
// const globalErrorHandler = require("./middlewares/errorMiddleware");
// app.use(globalErrorHandler);

module.exports = app;