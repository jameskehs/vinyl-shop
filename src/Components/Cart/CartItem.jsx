import { useEffect, useState } from "react";
import { ReactComponent as Trash } from "../Icons/trash.svg";

const CartItem = ({ vinyl, updateQuantity, deleteCartItem }) => {
  const [quantity, setQuantity] = useState(vinyl.quantity);
  const { vinyl_id, price, name, image_url } = vinyl;

  useEffect(() => {
    updateQuantity(vinyl_id, quantity);
  }, [quantity]);

  return (
    <div className="cart-item">
      <img src={image_url} alt={name} />
      <div className="cart-item-details">
        <h3>{name}</h3>
        <Trash onClick={() => deleteCartItem(vinyl_id)} />
        <div className="cart-item-quantity">
          <button onClick={() => setQuantity(quantity - 1)} disabled={quantity <= 1}>
            -
          </button>
          <input type="number" value={quantity} readOnly />
          <button onClick={() => setQuantity(quantity + 1)}>+</button>
        </div>
        <p className="cart-item-price">${(price * quantity).toFixed(2)}</p>
      </div>
    </div>
  );
};

export default CartItem;
