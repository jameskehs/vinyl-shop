const { pool } = require("../index");

async function createVinyl(vinyl) {
  try {
    console.log("CREATING RECORD");
    const { name, artist, price, image_url } = vinyl;
    console.log(image_url);
    await pool.query(
      `INSERT INTO vinyls(name, artist, price, image_url) VALUES($1,$2,$3,$4) RETURNING *;`,
      [name, artist, price, image_url]
    );
  } catch (error) {
    throw error;
  }
}

async function getAllVinyls() {
  try {
    const { rows } = await pool.query(`SELECT * FROM vinyls`);
    return rows;
  } catch (error) {
    throw error;
  }
}

async function getVinylsByIds(vinylIds) {
  try {
    let WHERECLAUSE = "";
    vinylIds.forEach((id, index) => {
      if (index === vinylIds.length - 1) {
        WHERECLAUSE += `$${index + 1}`;
      } else {
        WHERECLAUSE += `$${index + 1},`;
      }
    });
    console.log(WHERECLAUSE);
    const { rows } = await pool.query(
      `SELECT * FROM vinyls WHERE vinyl_id = (${WHERECLAUSE})`,
      vinylIds
    );
    return rows;
  } catch (error) {
    console.log(error);
  }
}

async function getNewestVinyls() {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM vinyls ORDER BY vinyl_id DESC LIMIT 3;`
    );
    return rows;
  } catch (error) {
    console.log(error);
  }
}

module.exports = { createVinyl, getAllVinyls, getNewestVinyls, getVinylsByIds };
