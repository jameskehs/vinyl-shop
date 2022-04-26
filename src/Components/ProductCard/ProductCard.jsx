import "./ProductCard.css";
import { ReactComponent as Heart } from "../Icons/heart.svg";
import { useContext, useEffect, useState } from "react";
import { userContext } from "../../App";

const ProductCard = ({ vinyl }) => {
  const [user, setUser] = useContext(userContext);
  const [isSaved, setIsSaved] = useState(user.savedVinyls && user.savedVinyls.includes(vinyl.vinyl_id) ? true : false);
  const [inCart, setInCart] = useState(user.cart && user.cart.includes(vinyl.vinyl_id) ? true : false);

  useEffect(() => {
    setIsSaved(user.savedVinyls && user.savedVinyls.includes(vinyl.vinyl_id) ? true : false);
    setInCart(user.cart && user.cart.includes(vinyl.vinyl_id) ? true : false);
  }, [user]);

  function checkForUser() {
    if (Object.keys(user).length < 1 || localStorage.getItem("vinyl-shop-jwt") === undefined) {
      document.getElementById("login-notification").style.top = "10px";
      document.getElementById("login-notification").style.opacity = "1";

      setTimeout(() => {
        document.getElementById("login-notification").style.opacity = "0";
        document.getElementById("login-notification").style.top = "-150px";
      }, 2000);
    } else {
      return;
    }
  }

  async function saveTrack() {
    try {
      checkForUser();
      const response = await fetch("api/users/saveTrack", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("vinyl-shop-jwt")}`,
        },
        body: JSON.stringify({ vinyl_id: vinyl.vinyl_id }),
      });
      if (response.ok) {
        setUser({ ...user }, user.savedVinyls.push(vinyl.vinyl_id));
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function unsaveTrack() {
    try {
      checkForUser();
      const response = await fetch("api/users/saveTrack", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("vinyl-shop-jwt")}`,
        },
        body: JSON.stringify({ vinyl_id: vinyl.vinyl_id }),
      });
      if (response.ok) {
        const savedVinylIndex = user.savedVinyls.indexOf(vinyl.vinyl_id);
        setUser({ ...user }, user.savedVinyls.splice(savedVinylIndex, 1));
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function addToCart() {
    try {
      checkForUser();
      const response = await fetch("/api/users/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("vinyl-shop-jwt")}` },
        body: JSON.stringify({ vinyl_id: vinyl.vinyl_id }),
      });
      if (response.ok) {
        setInCart(true);
        setUser({ ...user }, user.cart.push(vinyl.vinyl_id));
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function removeFromCart() {
    try {
      checkForUser();
      const response = await fetch("api/users/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("vinyl-shop-jwt")}` },
        body: JSON.stringify({ vinyl_id: vinyl.vinyl_id }),
      });
      if (response.ok) {
        setInCart(false);
        const cartVinylIndex = user.cart.indexOf(vinyl.vinyl_id);
        setUser({ ...user }, user.cart.splice(cartVinylIndex, 1));
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="product-card">
      <img src={vinyl.image_url} alt="Album Cover" />
      <p className="product-name">{vinyl.name}</p>
      <p className="product-artist">{vinyl.artist}</p>
      <p className="product-price">${vinyl.price}</p>
      <div className="product-options">
        <button className={inCart ? "remove-from-cart-btn" : undefined} onClick={inCart ? removeFromCart : addToCart}>
          {inCart ? "Remove from Cart" : "Add to Cart"}
        </button>
        <button className={isSaved ? "saved-vinyl" : undefined} onClick={isSaved ? unsaveTrack : saveTrack}>
          {<Heart />}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
