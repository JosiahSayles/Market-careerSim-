import express from "express";
const router = express.Router();
export default router;
import requireUser from "#middleware/requireUser";
import requireBody from "#middleware/requireBody";
import {
  createOrder,
  getOrderById,
  getOrdersByUserId,
} from "#db/queries/orders";
import { getProductsByOrderId } from "#db/queries/products";
import { createOrderProducts } from "#db/queries/orders_prodcuts";

router.use(requireUser);

router.post("/", async (req, res) => {
  const { date } = req.body || {};
  if (!req.body) return res.status(400).send("Request body is required");
  if (!date) return res.status(400).send("Request body must have: date");
  const order = await createOrder(date, req.user.id);
  res.status(201).send(order);
});

router.get("/", async (req, res) => {
  const orders = await getOrdersByUserId(req.user.id);
  res.send(orders);
});

router.param("id", async (req, res, next, id) => {
  const order = await getOrderById(id);
  if (!order) return res.status(404).send("Order does not exist");
  req.order = order;
  next();
});

router.get("/:id", (req, res) => {
  if (req.user.id !== req.order.user_id) {
    return res.status(403).send("You are not authorized to view this order.");
  }
  res.send(req.order);
});

router.post(
  "/:id/products",
  requireBody(["productId", "quantity"]),
  async (req, res) => {
    const { productId, quantity } = req.body;
    if (!productId) return res.status(400).send("Product does not exist");
    const orderProducts = await createOrderProducts(
      req.order.id,
      productId,
      quantity
    );
    res.status(201).send(orderProducts);
  }
);

router.get("/:id/products", async (req, res) => {
  const orderProducts = await getProductsByOrderId(req.order.id);
  res.send(orderProducts);
});
