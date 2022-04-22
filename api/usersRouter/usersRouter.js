const express = require("express");
const jwt = require("jsonwebtoken");
const {
  getUserByLogin,
  createUser,
  getUsersSavedVinyls,
  getUserById,
  addVinylToUserSaved,
} = require("../../db/Users/usersDBFunctions");
const usersRouter = express.Router();

usersRouter.post("/", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await getUserByLogin(email, password);
    const token = jwt.sign({ user_id: user.user_id }, process.env.JWTSECRET);
    res.json({ user, token });
  } catch (error) {
    next(error);
  }
});

usersRouter.put("/", async (req, res, next) => {
  try {
    const newUser = await createUser(req.body);
    const token = jwt.sign({ user_id: newUser.user_id }, process.env.JWTSECRET);
    res.json({ newUser, token });
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/me", async (req, res, next) => {
  try {
    console.log(req.user);
    if (!req.user) {
      throw Error("Invalid Credentials. Please try again");
    }
    const user = await getUserById(req.user);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

usersRouter.put("/saveTrack", async (req, res, next) => {
  try {
    if (!req.user) {
      next("INVALID USER ID");
    }
    await addVinylToUserSaved(req.user, req.body.vinyl_id);
    res.json(`${req.body.vinyl_id} added to saved`);
  } catch (error) {
    next(error);
  }
});

module.exports = usersRouter;
