const { pool } = require("../index");
const bcrypt = require("bcrypt");

async function createUser(user) {
  try {
    const { email, firstName, lastName, address, city, state, zip } = user;
    const password = await bcrypt.hash(user.password, 10);
    const {
      rows: [newUser],
    } = await pool.query(
      `INSERT INTO users(email,password,first_name,last_name,address,city,state,zip) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *;`,
      [email, password, firstName, lastName, address, city, state, zip]
    );
    await createUserCart(newUser.user_id);
    return newUser;
  } catch (error) {
    throw error;
  }
}

async function getUserByLogin(email, password) {
  try {
    const {
      rows: [user],
    } = await pool.query(`SELECT * FROM users WHERE email=$1`, [email]);

    if (!user) {
      throw new Error("Invalid Credentials. Please try again");
    }
    const isCorrectCredentials = await bcrypt.compare(password, user.password);
    if (isCorrectCredentials) {
      delete user.password;
      return user;
    } else {
      throw new Error("Invalid Credentials. Please try again.");
    }
  } catch (error) {
    throw error;
  }
}

async function getUserById(userId) {
  try {
    const {
      rows: [user],
    } = await pool.query(`SELECT * FROM users WHERE user_id=$1`, [userId]);
    user.savedVinyls = await getUsersSavedVinyls(user.user_id);
    user.cart = await getUserCartProductIds(user.user_id);
    delete user.password;
    return user;
  } catch (error) {
    console.log(error);
  }
}

async function createUserCart(userId) {
  try {
    const {
      rows: [{ cart_id }],
    } = await pool.query(`INSERT INTO carts(user_id) VALUES($1) RETURNING cart_id;`, [userId]);
    return cart_id;
  } catch (error) {
    throw error;
  }
}
async function getUserCartId(userId) {
  try {
    const {
      rows: [{ cart_id }],
    } = await pool.query(`SELECT cart_id FROM carts WHERE user_id=$1`, [userId]);
    return cart_id;
  } catch (error) {
    throw error;
  }
}
async function getUserCartProductIds(userId) {
  try {
    const cartId = await getUserCartId(userId);
    let cartVinylIds = [];
    const { rows } = await pool.query(`SELECT vinyl_id FROM cart_products WHERE cart_id=$1`, [cartId]);
    rows.forEach((row) => {
      cartVinylIds.push(row.vinyl_id);
    });
    return cartVinylIds;
  } catch (error) {
    throw error;
  }
}
async function getUserCartProducts(userId) {
  try {
    const cartId = await getUserCartId(userId);
    const { rows } = await pool.query(
      `SELECT vinyls.*, cart_products.quantity FROM cart_products JOIN vinyls ON cart_products.vinyl_id = vinyls.vinyl_id WHERE cart_id = $1 `,
      [cartId]
    );
    return rows;
  } catch (error) {
    throw error;
  }
}

async function addToUserCart(userId, vinylId) {
  try {
    const cartId = await getUserCartId(userId);
    await pool.query(`INSERT INTO cart_products(cart_id, vinyl_id) VALUES($1,$2);`, [cartId, vinylId]);
    return;
  } catch (error) {
    throw error;
  }
}

async function removeFromUserCart(userId, vinylId) {
  try {
    const cartId = await getUserCartId(userId);
    await pool.query(`DELETE FROM cart_products WHERE cart_id = $1 AND vinyl_id = $2`, [cartId, vinylId]);
    return;
  } catch (error) {
    throw error;
  }
}
async function getUsersSavedVinyls(userId) {
  try {
    const { rows } = await pool.query(`SELECT vinyl_id FROM saved_vinyls WHERE user_id=$1`, [userId]);
    let savedVinylIds = [];
    rows.forEach((row) => {
      savedVinylIds.push(row.vinyl_id);
    });
    return savedVinylIds;
  } catch (error) {
    console.log(error);
  }
}

async function addVinylToUserSaved(userId, vinylId) {
  try {
    await pool.query(`INSERT INTO saved_vinyls(user_id, vinyl_id) VALUES ($1,$2)`, [userId, vinylId]);
  } catch (error) {
    throw error;
  }
}

async function removeVinylFromUserSaved(userId, vinylID) {
  try {
    await pool.query(`DELETE FROM saved_vinyls WHERE user_id = ($1) AND vinyl_id = ($2)`, [userId, vinylID]);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

module.exports = {
  addToUserCart,
  addVinylToUserSaved,
  createUser,
  getUserByLogin,
  getUserById,
  removeVinylFromUserSaved,
  getUserCartProducts,
  removeFromUserCart,
};
