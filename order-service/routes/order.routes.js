const express = require("express");
const axios = require("axios");
const pool = require("../db");
const verifyToken = require("../middleware/auth");
const AWS = require("aws-sdk");

const router = express.Router();

// SNS client
const sns = new AWS.SNS({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

router.post("/", verifyToken, async (req, res) => {
  const client = await pool.connect();

  try {
    // 1) Get cart items
    const cartResponse = await axios.get(`${process.env.CART_SERVICE_URL}/cart`, {
      headers: { Authorization: req.headers.authorization },
    });

    const cartItems = cartResponse.data;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // 2) Total
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // 3) Transaction
    await client.query("BEGIN");

    // 4) Insert order
    const orderResult = await client.query(
      "INSERT INTO orders (user_id, total) VALUES ($1, $2) RETURNING *",
      [req.user.userId, total]
    );

    const order = orderResult.rows[0];

    // 5) Insert items
    for (const item of cartItems) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, name, price, quantity)
         VALUES ($1, $2, $3, $4, $5)`,
        [order.id, item.productId, item.name, item.price, item.quantity]
      );
    }

    // 6) Commit
    await client.query("COMMIT");

    // 7) Publish SNS event (non-blocking for order success)
    console.log("DEBUG SNS_TOPIC_ARN =", process.env.SNS_TOPIC_ARN);
    console.log("DEBUG AWS_REGION =", process.env.AWS_REGION);

    try {
      await sns.publish({
        TopicArn: process.env.SNS_TOPIC_ARN,
        Message: JSON.stringify({
          eventType: "OrderPlaced",
          orderId: order.id,
          userId: req.user.userId,
          total: order.total,
          items: cartItems,
          createdAt: new Date().toISOString(),
        }),
      }).promise();

      console.log("✅ SNS publish success for order:", order.id);
    } catch (snsErr) {
      console.error("⚠️ SNS publish failed (order still placed):", snsErr.message);
    }

    // 8) Response
    return res.status(201).json({
      message: "Order placed successfully",
      orderId: order.id,
      total: order.total,
      items: cartItems,
    });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("ORDER ERROR:", err.message);

    return res.status(500).json({
      error: "Order failed",
      details: err.message,
    });
  } finally {
    client.release();
  }
});

router.get("/my", verifyToken, async (req, res) => {
  try {
    const orders = await pool.query(
      "SELECT * FROM orders WHERE user_id=$1 ORDER BY id DESC",
      [req.user.userId]
    );

    res.json(orders.rows);
  } catch (err) {
    res.status(500).json({
      error: "Server error",
      details: err.message,
    });
  }
});

module.exports = router;
