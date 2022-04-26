require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || "5000";
const morgan = require("morgan");
const usersRouter = require("./api/usersRouter/usersRouter");
const vinylRouter = require("./api/vinylRouter/vinylRouter");
const jwt = require("jsonwebtoken");
const ordersRouter = require("./api/ordersRouter/ordersRouter");

app.use(morgan("dev"));
app.use(express.json());

app.use((req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (authHeader === undefined || !authHeader.startsWith("Bearer")) {
      next();
    } else {
      const token = authHeader.split(" ")[1];
      if (!token) {
        next();
      }

      const user = jwt.verify(token, process.env.JWTSECRET);
      if (!user) {
        next();
      }
      req.user = user.user_id;
      next();
    }
  } catch (error) {
    console.log(error);
  }
});

app.use("/api/users", usersRouter);
app.use("/api/vinyls", vinylRouter);
app.use("/api/orders", ordersRouter);

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});
app.listen(PORT, () => {
  console.log(`App is up on ${PORT}`);
});
