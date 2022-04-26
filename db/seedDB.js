const { pool } = require("./index.js");
const { seedVinyls, seedUsers } = require("./seedData.js");
const { createUser, addToUserCart, getUserCartProducts, removeFromUserCart } = require("./Users/usersDBFunctions.js");
const { createVinyl } = require("./Vinyls/vinylDBFunctions.js");
async function dropTables() {
  try {
    await pool.query(`
      DROP TABLE IF EXISTS ordered_products CASCADE;
      DROP TABLE IF EXISTS orders CASCADE;
      DROP TABLE IF EXISTS cart_products CASCADE;
      DROP TABLE IF EXISTS carts CASCADE;
      DROP TABLE IF EXISTS saved_vinyls CASCADE;
      DROP TABLE IF EXISTS vinyls CASCADE;
      DROP TABLE IF EXISTS users CASCADE;`);
  } catch (error) {
    console.log(error);
  }
}

async function buildTables() {
  try {
    await pool.query(`
      CREATE TABLE users(
        user_id SERIAL PRIMARY KEY,
        email VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(75) NOT NULL
    );
    CREATE TABLE vinyls(
        vinyl_id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        artist VARCHAR(255) NOT NULL,
        price NUMERIC(5,2) NOT NULL,
        active BOOLEAN DEFAULT TRUE,
        image_url VARCHAR(255) DEFAULT '../Images/NoImage.png'
    );
    CREATE TABLE saved_vinyls(
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
      vinyl_id INTEGER REFERENCES vinyls(vinyl_id) ON DELETE CASCADE,
      UNIQUE (user_id, vinyl_id)
  );
    CREATE TABLE carts(
        cart_id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE
    );
    CREATE TABLE cart_products(
      id SERIAL PRIMARY KEY,
      cart_id INTEGER REFERENCES carts(cart_id) ON DELETE CASCADE,
      vinyl_id INTEGER REFERENCES vinyls(vinyl_id) ON DELETE CASCADE,
      quantity INTEGER DEFAULT 1 NOT NULL
    );
    CREATE TABLE orders(
        order_id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
        stripe_checkout_session VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        address1 VARCHAR(255) NOT NULL,
        address2 VARCHAR(255),
        city VARCHAR(50) NOT NULL,
        state VARCHAR(2) NOT NULL,
        zip VARCHAR(5) NOT NULL,
        status VARCHAR(255) DEFAULT 'Processing',
        total NUMERIC(5,2) NOT NULL,
        UNIQUE(order_id, user_id)
    );
    CREATE TABLE ordered_products(
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(order_id),
        name VARCHAR(255) NOT NULL,
        artist VARCHAR(255) NOT NULL,
        price NUMERIC(5,2) NOT NULL,
        image_url VARCHAR(255),
        quantity INTEGER NOT NULL
    );
      `);
  } catch (error) {
    console.log(error);
  }
}

async function seedDB() {
  try {
    await dropTables();
    console.log("TABLES DROPPED");
    await buildTables();
    console.log("TABLES BUILT");
    await Promise.all(seedVinyls.map(createVinyl));
    await Promise.all(seedUsers.map(createUser));
  } catch (error) {
    console.log(error);
  } finally {
    pool.end();
  }
}

seedDB();
