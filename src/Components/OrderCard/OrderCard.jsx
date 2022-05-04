import "./OrderCard.css";
const OrderCard = ({ order }) => {
  const { order_id, status, address1, address2, city, state, zip, name, total, products } = order;
  return (
    <div className="order-card">
      <div className="order-info">
        <h3>Order #{order_id}</h3>
        <p className={`order-status ${status.toLowerCase()}`}>{status}</p>
      </div>
      <div className="ship-info">
        <p>{name}</p>
        <p>
          {address1} {address2 !== null && address2}
        </p>
        <p>
          {city} {state}, {zip}
        </p>
      </div>
      <div id="ordered-products">
        {products.map((product) => {
          const { image_url, name, price, quantity, id } = product;
          return (
            <div key={id} className="order-item">
              <img src={image_url} alt={name} />
              <div className="order-details">
                <h3>
                  {name} x {quantity}
                </h3>
                <p className="order-price">${(price * quantity).toFixed(2)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderCard;
