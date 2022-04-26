import React, { useEffect, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { userContext } from "../../App";

const OrderSuccess = () => {
  const [user, setUser] = useContext(userContext);
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  useEffect(() => {
    async function getUser() {
      try {
        const response = await fetch("/api/users/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("vinyl-shop-jwt")}`,
          },
        });
        if (!response.ok) {
          throw Error("Something went wrong");
        }
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.log(error);
      }
    }
    async function getSession() {
      await fetch(`/api/orders/success?session_id=${sessionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("vinyl-shop-jwt")}` },
      });
      getUser();
    }
    getSession();
  }, []);

  return <div>OrderSuccess</div>;
};

export default OrderSuccess;
