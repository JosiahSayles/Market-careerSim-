import express from "express";
const app = express();
export default app;

import userRouter from "#api/users";
import ordersRouter from "#api/orders";
import productsRouter from "#api/products";
import getUserFromToken from "#middleware/getUserFromToken";

app.use(express.json());

app.use(getUserFromToken);

app.use("/users", userRouter);
app.use("/products", productsRouter);
app.use("/orders", ordersRouter);

app.use((err, req, res, next) => {
  switch (err.code) {
    case "22P02":
      return res.status(400).send(err.message);

    case "23505":

    case "23503":
      return res.status(400).send(err.detail);
    default:
      next(err);
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Sorry! Something went wrong!");
});
