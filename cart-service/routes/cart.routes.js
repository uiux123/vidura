const express = require("express");
const jwt = require("jsonwebtoken");
const AWS = require("aws-sdk");

const router = express.Router();

/**
 * ✅ DynamoDB config
 * ECS will inject credentials automatically via IAM Task Role
 */
AWS.config.update({
  region: process.env.AWS_REGION,
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();

/**
 * ✅ JWT middleware
 */
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId, email }
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

/**
 * ✅ ADD ITEM TO CART
 * POST /cart/add
 */
router.post("/add", verifyToken, async (req, res) => {
  const { productId, name, price, quantity } = req.body;

  if (!productId || !name || !price || !quantity) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const params = {
    TableName: process.env.DYNAMO_TABLE,
    Item: {
      userId: String(req.user.userId),   // PK
      productId: String(productId),      // SK
      name,
      price,
      quantity,
    },
  };

  try {
    await dynamoDB.put(params).promise();
    res.json({ message: "Item added to cart" });
  } catch (err) {
    console.error("DynamoDB PUT error:", err);
    res.status(500).json({ error: "Failed to add item" });
  }
});

/**
 * ✅ GET USER CART
 * GET /cart
 */
router.get("/", verifyToken, async (req, res) => {
  const params = {
    TableName: process.env.DYNAMO_TABLE,
    KeyConditionExpression: "userId = :uid",
    ExpressionAttributeValues: {
      ":uid": String(req.user.userId),
    },
  };

  try {
    const data = await dynamoDB.query(params).promise();
    res.json(data.Items);
  } catch (err) {
    console.error("DynamoDB QUERY error:", err);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

/**
 * ✅ CLEAR CART (logical placeholder)
 */
router.delete("/clear", verifyToken, async (req, res) => {
  res.json({ message: "Cart cleared during order placement" });
});

module.exports = router;
