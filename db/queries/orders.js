import db from "#db/client";

export async function createOrder(date, userId) {
  const sql = `
    INSERT INTO orders 
    (date, user_id)
    VALUES 
    ($1,$2)
    RETURNING * 
    `;
  const {
    rows: [order],
  } = await db.query(sql, [date, userId]);
  return order;
}

export async function getOrders() {
  const sql = `
  SELECT * FROM orders
  `;
  const { rows: orders } = await db.query(sql);
  return orders;
}

export async function getOrdersByUserId(id) {
  const sql = `
    SELECT * 
    FROM orders 
    WHERE user_id = $1 
    `;
  const { rows: orders } = await db.query(sql, [id]);
  return orders;
}

export async function getOrderById(id) {
  const sql = `
    SELECT * FROM orders
    WHERE id=$1 
    `;
  const {
    rows: [order],
  } = await db.query(sql, [id]);
  return order;
}

export async function getOrdersByProductId(id) {
  const sql = `
  SELECT DISTINCT orders.*
  FROM 
  orders_products
  JOIN orders ON orders_products.order_id = orders.id
  WHERE 
  orders_products.product_id = $1
  `;
  const { rows: orders } = await db.query(sql, [id]);
  return orders;
}

export async function getOrdersByProductIdAndUserId(userId, productId) {
  const sql = `
  SELECT DISTINCT orders.*
  FROM orders_products
  JOIN orders ON orders_products.order_id = orders.id
  WHERE 
  orders.user_id = $1
  AND orders_products.product_id = $2
  `;
  const { rows: orders } = await db.query(sql, [userId, productId]);
  return orders;
}
