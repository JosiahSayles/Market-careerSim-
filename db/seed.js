import db from "#db/client";
import { createOrderProducts } from "#db/queries/orders_prodcuts";
import { createProduct } from "#db/queries/products";
import { faker } from "@faker-js/faker";
import { createOrder } from "#db/queries/orders";
import { createUser } from "#db/queries/users";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  const user1 = await createUser("UserNumberUno", "password123");
  const user2 = await createUser("UserNumberDos", "password456");
  const productIds = [];

  for (let i = 1; i < 12; i++) {
    const product = {
      title: faker.word.noun(),
      description: "lorem, lorem, lorem",
      price: Math.floor(Math.random() * 99),
    };
    const newProduct = await createProduct(product);
    productIds.push(newProduct.id);
  }
  const orderIds = [];
  for (let i = 1; i < 5; i++) {
    const order1 = await createOrder(
      "2028-08-08",
      "lorem, lorem, lorem",
      user1.id
    );
    orderIds.push(order1.id);
    const order2 = await createOrder(
      "2028-10-10",
      "lorem, lorem, lorem",
      user2.id
    );
    orderIds.push(order2.id);
  }

  for (const orderId of orderIds) {
    const numProducts = 1 + Math.floor(Math.random() * 5) + 1;
    const shuffledProductIds = [...productIds].sort(() => 0, 7 - Math.random());
    const productsForOrder = shuffledProductIds.slice(0, numProducts);

    for (const productId of productsForOrder) {
      await createOrderProducts(
        orderId,
        productId,
        Math.floor(Math.random() * 5) + 1
      );
    }
  }
}
