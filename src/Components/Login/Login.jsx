import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SignUp from "../Sign Up/SignUp";
import "./Login.css";

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  let navigate = useNavigate();

  async function loginUser() {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw Error("Invalid Login, Please Try Again.");
      }

      setErrorMsg("");
      const data = await response.json();
      localStorage.setItem("vinyl-shop-jwt", data.token);
      setIsLoggedIn(true);
      navigate("/");
    } catch (error) {
      setErrorMsg(error.message);
    }
  }
  return (
    <>
      <div id="login">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            loginUser();
          }}
        >
          <h2>Login</h2>
          <p className="error">{errorMsg}</p>
          <input
            type="text"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button>Login</button>
        </form>
      </div>
      <SignUp setIsLoggedIn={setIsLoggedIn} />
    </>
  );
};

export default Login;
