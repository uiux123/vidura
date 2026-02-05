// product/server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const productRoutes = require("./routes/product.routes");

const app = express();

app.use(cors());
app.use(express.json());

/* ============================
   Health Check (for ALB/ECS)
   ============================ */
app.get("/health", (req, res) => {
  res.status(200).send("✅ Product Service Running");
});

/* ============================
   Main Product API
   ============================ */
app.use("/products", productRoutes);

/* ============================
   Root (optional)
   ============================ */
app.get("/", (req, res) => {
  res.send("Product Service OK");
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`✅ Product Service running on port ${PORT}`);
});
