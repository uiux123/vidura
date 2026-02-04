const express = require("express");
const cors = require("cors");
require("dotenv").config();

const orderRoutes = require("./routes/order.routes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/orders", orderRoutes);

app.get("/", (req, res) => {
  res.send("✅ Order Service Running");
});

const PORT = process.env.PORT || 3004;

app.listen(PORT, () => {
  console.log(`✅ Order Service running on port ${PORT}`);
});
