import { useEffect, useState } from "react";
import OrderCard from "../OrderCard/OrderCard";

const RecentOrders = () => {
  const [recentOrders, setRecentOrders] = useState([]);
  useEffect(() => {
    async function getRecentOrders() {
      try {
        const response = await fetch("/api/orders/latest", {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("vinyl-shop-jwt")}` },
        });
        const data = await response.json();
        console.log(data);
        setRecentOrders(data);
      } catch (error) {
        console.error(error);
      }
    }
    getRecentOrders();
  }, []);
  return (
    <div id="recent-order">
      <h4>Recent Order</h4>
      <a href="/orders">View all</a>
      {recentOrders.map((order) => {
        return <OrderCard key={order.order_id} order={order} />;
      })}
    </div>
  );
};

export default RecentOrders;
