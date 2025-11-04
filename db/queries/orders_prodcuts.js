import db from "#db/client";

export async function createOrderProducts(orderId, productId, quantity) {
  const sql = ` 
    INSERT INTO orders_products
    (order_id, product_id, quantity)
    VALUES 
    ($1, $2, $3)
    RETURNING *
    `;
  const {
    rows: [orderProducts],
  } = await db.query(sql, [orderId, productId, quantity]);
  return orderProducts;
}
