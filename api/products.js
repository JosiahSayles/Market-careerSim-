import express from "express";
const router = express.Router();
export default router;
import { getProducts, getProductById } from "#db/queries/products";
import requireUser from "#middleware/requireUser";
import {
  getOrdersByProductId,
  getOrdersByProductIdAndUserId,
} from "#db/queries/orders";

router.get("/", async (req, res) => {
  const products = await getProducts();
  res.send(products);
});

router.param("id", async (req, res, next, id) => {
  const product = await getProductById(id);
  if (!product) return res.status(404).send("Product does not exsist");
  req.product = product;
  next();
});

router.get("/:id", async (req, res, id) => {
  const product = req.product;
  res.send(product);
});

router.get("/:id/orders", requireUser, async (req, res) => {
  const productId = req.product.id;
  const userId = req.user.id;
  const orders = await getOrdersByProductIdAndUserId(userId, productId);
  res.send(orders);
});
