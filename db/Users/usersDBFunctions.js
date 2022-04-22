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
    user.cart = [];
    delete user.password;
    return user;
  } catch (error) {
    console.log(error);
  }
}

async function getUsersSavedVinyls(userId) {
  try {
    const { rows } = await pool.query(
      `SELECT vinyl_id FROM saved_vinyls WHERE user_id=$1`,
      [userId]
    );
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
    await pool.query(
      `INSERT INTO saved_vinyls(user_id, vinyl_id) VALUES ($1,$2)`,
      [userId, vinylId]
    );
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  addVinylToUserSaved,
  createUser,
  getUserByLogin,
  getUserById,
};
