const express = require("express");
const { getAllVinyls, getNewestVinyls, getVinylsByIds } = require("../../db/Vinyls/vinylDBFunctions");
const vinylRouter = express.Router();

vinylRouter.get("/all", async (req, res, next) => {
  try {
    const allVinyls = await getAllVinyls();
    res.json(allVinyls);
  } catch (error) {
    next(error);
  }
});

vinylRouter.get("/latest", async (req, res, next) => {
  try {
    const newestVinyls = await getNewestVinyls();
    res.json(newestVinyls);
  } catch (error) {
    next(error);
  }
});

vinylRouter.post("/saved", async (req, res, next) => {
  try {
    const savedVinyls = await getVinylsByIds(req.body);
    res.json(savedVinyls);
  } catch (error) {
    next(error);
  }
});

module.exports = vinylRouter;
