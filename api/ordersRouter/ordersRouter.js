const express = require("express");
const { convertUserCartIntoOrder } = require("../../db/Orders/ordersDBFunctions");
const { getUserCartProducts } = require("../../db/Users/usersDBFunctions");
const ordersRouter = express.Router();
const stripe = require("stripe")("sk_test_51KspZ0ERzzvCwxqBFJvBf09OpmKAu36HDI4Hbbs5ZKhXjzQvECIDWjNhZ7es0UJdYSKnI66oVsGDhMgBlsU9IQ0A005E0cJffH");

ordersRouter.post("/create-checkout-session", async (req, res, next) => {
  try {
    const userCart = await getUserCartProducts(req.user);
    let line_items = [];
    userCart.forEach((cartItem) => {
      line_items.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: cartItem.name,
          },
          unit_amount: cartItem.price * 100,
        },
        quantity: cartItem.quantity,
      });
    });
    const session = await stripe.checkout.sessions.create({
      shipping_address_collection: {
        allowed_countries: ["US"],
      },
      line_items,
      mode: "payment",
      success_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:3000/`,
    });
    res.json(session.url);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

ordersRouter.put("/success", async (req, res, next) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
    const customer = await stripe.customers.retrieve(session.customer);

    const { id, payment_status, amount_total } = session;
    let {
      email,
      address: { line1, line2, city, state, postal_code },
      name,
    } = customer;

    const orderInfo = { name, email, line1, line2, city, state, postal_code, amount_total: amount_total / 100 };
    console.log(orderInfo);
    if (payment_status === "paid") {
      const newOrder = await convertUserCartIntoOrder(req.user, id, orderInfo);
      res.json(newOrder);
    } else {
      throw Error("Payment not complete");
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = ordersRouter;
