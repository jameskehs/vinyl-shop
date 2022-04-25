import "./SavedVinyls.css";
import ProductCard from "../ProductCard/ProductCard";
import { useEffect, useState, useContext } from "react";
import { userContext } from "../../App";

const SavedVinyls = () => {
  const [user, setUser] = useContext(userContext);
  const [savedVinyls, setSavedVinyls] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (Object.keys(user).length < 1) {
      setErrorMsg("Please log in to view saved vinyls");
      return;
    }
    async function getSavedVinyls() {
      try {
        const response = await fetch("/api/vinyls/saved", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user.savedVinyls),
        });
        const data = await response.json();
        if (data === null) {
          setErrorMsg("You have not saved any vinyls yet!");
          return;
        }
        setSavedVinyls(data);
      } catch (error) {
        console.log(error);
      }
    }
    if (user !== undefined) {
      getSavedVinyls();
    }
  }, [user]);

  return (
    <section id="saved-vinyls">
      <h2>Saved Vinyls</h2>
      <p>{errorMsg}</p>
      <div id="saved-vinyls-container">
        {savedVinyls.map((vinyl, index) => {
          if (user.savedVinyls.includes(vinyl.vinyl_id)) {
            return <ProductCard key={vinyl.vinyl_id} vinyl={vinyl} />;
          }
          return undefined;
        })}
      </div>
    </section>
  );
};

export default SavedVinyls;
