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

  async function loginUser() {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "jamesekehs@gmail.com",
          password: "password",
        }),
      });

      if (!response.ok) {
        throw Error("Invalid Login, Please Try Again.");
      }
      const data = await response.json();
      localStorage.setItem("vinyl-shop-jwt", data.token);
      setIsLoggedIn(true);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <BrowserRouter>
      <userContext.Provider value={[user, setUser]}>
        <div className="App">
          <Nav isLoggedIn={isLoggedIn} />
          <button
            style={{ position: "absolute" }}
            onClick={() => {
              localStorage.removeItem("vinyl-shop-jwt");
              setIsLoggedIn(false);
              window.location.reload();
            }}
          >
            Logout
          </button>
          <button
            style={{ position: "absolute", left: "50px" }}
            onClick={() => {
              loginUser();
            }}
          >
            Login
          </button>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/saved" element={<SavedVinyls />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          </Routes>
          <Footer />
          <LoginNotification />
        </div>
      </userContext.Provider>
    </BrowserRouter>
  );
}

export default App;
