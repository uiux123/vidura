// cart/server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const cartRoutes = require("./routes/cart.routes");

const app = express();

app.use(cors());
app.use(express.json());

/* ============================
   Health Check (for ALB/ECS)
   ============================ */
app.get("/health", (req, res) => {
  res.status(200).send("✅ Cart Service Running");
});

/* ============================
   Main Cart API
   ============================ */
app.use("/cart", cartRoutes);

/* ============================
   Root (optional)
   ============================ */
app.get("/", (req, res) => {
  res.send("Cart Service OK");
});

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log(`✅ Cart Service running on port ${PORT}`);
});
