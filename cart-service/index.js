const express = require("express");
const cors = require("cors");
require("dotenv").config();

const cartRoutes = require("./routes/cart.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/cart", cartRoutes);

app.get("/", (req, res) => {
  res.send("✅ Cart Service Running");
});

app.listen(process.env.PORT, () => {
  console.log(`✅ Cart Service running on port ${process.env.PORT}`);
});
