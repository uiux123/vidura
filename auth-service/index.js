const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);


app.get(["/auth", "/auth/"], (req, res) => {
  res.send(" Auth Service Running");
});

app.get("/", (req, res) => {
  res.send(" Auth Service Running");
});

app.listen(process.env.PORT, () => {
  console.log(`Auth Service running on port ${process.env.PORT}`);
});