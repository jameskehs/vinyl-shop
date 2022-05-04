import { useEffect, useState, useRef, useContext } from "react";
import "./Cart.css";
import CartItem from "./CartItem";
import { userContext } from "../../App";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useContext(userContext);
  const [loginMsg, setLoginMsg] = useState("");
  const total = useRef(0.0);

  useEffect(() => {
    async function getCart() {
      try {
        if (localStorage.getItem("vinyl-shop-jwt")) {
          const response = await fetch("api/users/cart", {
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("vinyl-shop-jwt")}` },
          });
          const data = await response.json();
          if (response.ok) {
            setCart(data);
          }
        } else {
          setLoginMsg("Login to view cart and checkout");
        }
      } catch (error) {
        console.error(error);
      }
    }

    getCart();
  }, []);

  async function updateQuantity(vinyl_id, quantity) {
    try {
      const response = await fetch("api/users/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("vinyl-shop-jwt")}` },
        body: JSON.stringify({ vinyl_id: vinyl_id, quantity: quantity }),
      });
      if (response.ok) {
        const cartCopy = [...cart];
        const updateIndex = cartCopy.findIndex((vinyl) => vinyl.vinyl_id === vinyl_id);
        cartCopy[updateIndex].quantity = quantity;
        const sum = cartCopy.reduce((prev, next) => {
          return prev + parseFloat(next.price * next.quantity);
        }, 0.0);
        total.current = sum;
        setCart(cartCopy);
      }
    } catch (error) {
      console.error(error);
    }
  }
  async function deleteCartItem(vinyl_id) {
    try {
      const response = await fetch("api/users/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("vinyl-shop-jwt")}` },
        body: JSON.stringify({ vinyl_id }),
      });
      if (response.ok) {
        const cartVinylIndex = cart.findIndex((item) => item.vinyl_id === vinyl_id);
        const cartCopy = [...cart];
        cartCopy.splice(cartVinylIndex, 1);
        setCart(cartCopy);
        const sum = cartCopy.reduce((prev, next) => {
          return prev + parseFloat(next.price * next.quantity);
        }, 0.0);
        total.current = sum;
        const userCartIndex = user.cart.indexOf(vinyl_id);
        setUser({ ...user }, user.cart.splice(userCartIndex, 1));
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div id="cart">
      <h2>My Cart</h2>
      <p>{cart.length} items</p>
      <p>{loginMsg}</p>
      <div id="cart-products-container">
        {cart.map((vinyl, index) => {
          return <CartItem vinyl={vinyl} key={vinyl.vinyl_id} deleteCartItem={deleteCartItem} updateQuantity={updateQuantity} />;
        })}
      </div>
      <div id="cart-checkout-box">
        <div id="cart-total">
          <h3>Grand Total:</h3>
          <p>${total.current.toFixed(2)}</p>
        </div>
        <button
          onClick={async () => {
            try {
              const response = await fetch("api/orders/create-checkout-session", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("vinyl-shop-jwt")}` },
              });
              const data = await response.json();
              window.location.href = data;
            } catch (error) {
              console.error(error);
            }
          }}
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
