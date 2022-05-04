import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUp.css";

const SignUp = ({ setIsLoggedIn }) => {
  const [inputs, setInputs] = useState({});
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  function handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
    console.log(inputs);
  }

  async function handleSubmit(event) {
    try {
      event.preventDefault();
      const response = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs),
      });

      if (!response.ok) {
        throw Error("Something went wrong. Try again");
      }

      const data = await response.json();
      localStorage.setItem("vinyl-shop-jwt", data.token);
      setIsLoggedIn(true);
      navigate("/");
    } catch (error) {
      setErrorMsg(error.message);
    }
  }

  return (
    <div id="signup">
      <form onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        <p className="error">{errorMsg}</p>
        <input type="email" placeholder="Email" name="email" onChange={handleChange} value={inputs.email || ""} />
        <input type="password" placeholder="Password" name="password" onChange={handleChange} value={inputs.password || ""} />
        <input type="password" placeholder="Confirm Password" name="confirmPassword" onChange={handleChange} value={inputs.confirmPassword || ""} />
        <input type="text" placeholder="Name" name="name" onChange={handleChange} value={inputs.name || ""} />
        <button>Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
