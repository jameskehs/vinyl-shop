import "./SavedVinyls.css";
import ProductCard from "../ProductCard/ProductCard";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SavedVinyls = ({ user }) => {
  const [savedVinyls, setSavedVinyls] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    if (Object.keys(user).length < 1) {
      navigate("/login");
    }
    async function getSavedVinyls() {
      try {
        const response = await fetch("/api/vinyls/saved", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ savedVinyls: user.savedVinyls }),
        });
        const data = await response.json();
        setSavedVinyls(data);
      } catch (error) {
        console.log(error);
      }
    }

    getSavedVinyls();
  }, []);

  return (
    <section id="saved-vinyls">
      <h2>Saved Vinyls</h2>
      <div id="saved-vinyls-container">
        {savedVinyls.map((vinyl, index) => {
          if (user.savedVinyls.includes(vinyl.vinyl_id)) {
            return <ProductCard key={index} vinyl={vinyl} user={user} />;
          }
          return undefined;
        })}
      </div>
    </section>
  );
};

export default SavedVinyls;
