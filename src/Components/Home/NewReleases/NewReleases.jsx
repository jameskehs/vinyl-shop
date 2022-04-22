import { useEffect, useState } from "react";
import ProductCard from "../../ProductCard/ProductCard";
import "./NewReleases.css";

const NewReleases = ({ user }) => {
  const [newestVinyls, setNewestVinyls] = useState([]);
  useEffect(() => {
    async function getNewestVinyls() {
      const response = await fetch("/api/vinyls/latest");
      const data = await response.json();
      setNewestVinyls(data);
    }
    getNewestVinyls();
  }, []);
  return (
    <section id="new-releases">
      <h2>Newest Releases</h2>
      <div id="new-releases-container">
        {newestVinyls.map((vinyl, index) => {
          if (index <= 4) {
            return <ProductCard key={index} vinyl={vinyl} user={user} />;
          } else return "";
        })}
      </div>
    </section>
  );
};

export default NewReleases;
