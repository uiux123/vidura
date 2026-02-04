const express = require("express");
const cors = require("cors");
require("dotenv").config();

const productRoutes = require("./routes/product.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/products", productRoutes);

app.get("/", (req, res) => {
  res.send("✅ Product Service Running");
});

app.listen(process.env.PORT, () => {
  console.log(`✅ Product Service running on port ${process.env.PORT}`);
});
