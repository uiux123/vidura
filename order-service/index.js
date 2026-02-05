// order/server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const orderRoutes = require("./routes/order.routes");

const app = express();

app.use(cors());
app.use(express.json());

/* ============================
   Health Check (for ALB/ECS)
   ============================ */
app.get("/health", (req, res) => {
  res.status(200).send("✅ Order Service Running");
});

/* ============================
   Main Order API
   ============================ */
app.use("/orders", orderRoutes);

/* ============================
   Root (optional)
   ============================ */
app.get("/", (req, res) => {
  res.send("Order Service OK");
});

const PORT = process.env.PORT || 3004;

app.listen(PORT, () => {
  console.log(`✅ Order Service running on port ${PORT}`);
});
