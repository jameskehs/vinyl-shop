import "./ProductCard.css";
import { ReactComponent as Heart } from "../Icons/heart.svg";
import { useState } from "react";

const ProductCard = ({ vinyl, user }) => {
  const [isSaved, setIsSaved] = useState(
    user.savedVinyls && user.savedVinyls.includes(vinyl.vinyl_id) ? true : false
  );
  const [inCart, setInCart] = useState(
    user.cart && user.cart.includes(vinyl.vinyl_id) ? true : false
  );

  async function saveTrack() {
    try {
      const response = await fetch("api/users/saveTrack", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("vinyl-shop-jwt")}`,
        },
        body: JSON.stringify({ vinyl_id: vinyl.vinyl_id }),
      });
      const data = await response.json();
      console.log(data);
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
        <button className={inCart ? "remove-from-cart-btn" : undefined}>
          {inCart ? "Remove from Cart" : "Add to Cart"}
        </button>
        <button
          className={isSaved ? "saved-vinyl" : undefined}
          onClick={isSaved ? null : saveTrack}
        >
          {<Heart />}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
