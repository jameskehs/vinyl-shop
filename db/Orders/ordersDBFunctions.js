const { pool } = require("../index");
const { getUserCartProducts, getUserCartId } = require("../Users/usersDBFunctions");

async function doesSessionExist(order_id) {
  try {
    console.log("HEY");
    const { rows } = await pool.query("SELECT * FROM orders WHERE stripe_checkout_session=$1", [order_id]);
    console.log(rows);
    return rows.length > 0;
  } catch (error) {
    console.log(error);
  }
}

async function createOrder(user_id, session_id, orderInfo) {
  try {
    const { name, email, line1, line2, city, state, postal_code, amount_total } = orderInfo;
    const {
      rows: [newOrder],
    } = await pool.query(
      `INSERT INTO orders(user_id,stripe_checkout_session,name,email,address1,address2,city,state,zip,total) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *;`,
      [user_id, session_id, name, email, line1, line2, city, state, postal_code, amount_total]
    );
    return newOrder;
  } catch (error) {
    console.log(error);
  }
}
async function createOrderProducts(order_id, product) {
  try {
    console.log(product);
    const { name, artist, price, image_url, quantity } = product;
    const { rows } = pool.query(
      `INSERT INTO ordered_products(order_id, name, artist, price, image_url, quantity) VALUES($1,$2,$3,$4,$5,$6) RETURNING *;`,
      [order_id, name, artist, price, image_url, quantity]
    );
    return rows;
  } catch (error) {
    console.log(error);
  }
}

async function clearUserCart(user_id) {
  try {
    const cartId = await getUserCartId(user_id);
    await pool.query(`DELETE FROM cart_products WHERE cart_id =$1`, [cartId]);
  } catch (error) {
    console.log(error);
  }
}
async function convertUserCartIntoOrder(user_id, session_id, orderInfo) {
  try {
    if (await doesSessionExist(session_id)) {
      throw Error("Session already exists");
    }
    const newOrder = await createOrder(user_id, session_id, orderInfo);
    const products = await getUserCartProducts(user_id);
    console.log(newOrder);
    await Promise.all(products.map((product) => createOrderProducts(newOrder.order_id, product)));
    await clearUserCart(user_id);
    return newOrder;
  } catch (error) {
    console.log(error);
  }
}

module.exports = { convertUserCartIntoOrder };
