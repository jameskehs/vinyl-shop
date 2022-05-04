import { useEffect, useState, createContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Nav from "./Components/Nav/Nav.jsx";
import Footer from "./Components/Footer/Footer";
import Home from "./Components/Home/Home";
import Catalog from "./Components/Catalog/Catalog";
import SavedVinyls from "./Components/SavedVinyls/SavedVinyls";
import Cart from "./Components/Cart/Cart";
import Login from "./Components/Login/Login";
import LoginNotification from "./Components/LoginNotification/LoginNotification";
import OrderSuccess from "./Components/OrderSuccess/OrderSuccess";
import MyAccount from "./Components/MyAccount/MyAccount";

export const userContext = createContext([{}, () => {}]);

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("vinyl-shop-jwt") === null ? false : true);
  const [user, setUser] = useState({});

  useEffect(() => {
    async function getUser() {
      try {
        if (isLoggedIn) {
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
        } else {
          setUser({});
        }
      } catch (error) {
        console.log(error);
      }
    }
    getUser();
  }, [isLoggedIn]);

  return (
    <BrowserRouter>
      <userContext.Provider value={[user, setUser]}>
        <div className="App">
          <Nav isLoggedIn={isLoggedIn} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/saved" element={<SavedVinyls />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/success" element={<OrderSuccess />} />
            <Route path="/myaccount" element={<MyAccount />} />
          </Routes>
          {/* {window.location.path !== "/cart" && <Footer />} */}
          <LoginNotification />
        </div>
      </userContext.Provider>
    </BrowserRouter>
  );
}

export default App;
