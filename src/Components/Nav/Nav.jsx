import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ReactComponent as Vinyl } from "../Icons/vinyl.svg";
import { ReactComponent as Heart } from "../Icons/heart.svg";
import { ReactComponent as Cart } from "../Icons/cart.svg";
import { ReactComponent as MyAccount } from "../Icons/account.svg";
import { ReactComponent as Hamburger } from "../Icons/hamburger.svg";

import "./Nav.css";
const Nav = ({ isLoggedIn }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
    window.innerWidth < 768 ? true : false
  );

  function detectWindowSize() {
    window.innerWidth < 768 ? setIsMobile(true) : setIsMobile(false);
  }
  window.onresize = detectWindowSize;

  return (
    <nav>
      <div id="nav-corner-square">
        {
          <Hamburger
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
            }}
          />
        }
      </div>
      <div id="nav-title">
        <Link to="/" onClick={() => setIsMenuOpen(false)}>
          <h1>Vinyl Shop</h1>
        </Link>
      </div>

      <div
        id="nav-icons"
        className={!isMenuOpen && isMobile ? "menu-closed" : undefined}
      >
        <Link to="/catalog" onClick={() => setIsMenuOpen(false)}>
          <Vinyl className="vinyl-icon" />
          <p>Catalog</p>
        </Link>
        <Link to="/saved" onClick={() => setIsMenuOpen(false)}>
          <Heart className="heart-icon" />
          <p>Saved Vinyls</p>
        </Link>
        <Link to="/cart" onClick={() => setIsMenuOpen(false)}>
          <Cart className="cart-icon" />
        </Link>

        {isLoggedIn ? (
          <>
            <Link to="/myaccount" onClick={() => setIsMenuOpen(false)}>
              <MyAccount />
              <p>My Account</p>
            </Link>
          </>
        ) : (
          <Link
            id="nav-login-btn"
            to="login"
            onClick={() => setIsMenuOpen(false)}
          >
            Login
          </Link>
        )}
      </div>

      <Link
        className="cart-icon-mobile"
        to="/cart"
        onClick={() => setIsMenuOpen(false)}
      >
        <Cart />
      </Link>
    </nav>
  );
};

export default Nav;
