import "./Catalog.css";
import ProductCard from "../ProductCard/ProductCard";
import { useEffect, useState } from "react";

const Catalog = () => {
  const [allVinyls, setAllVinyls] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState(allVinyls);
  useEffect(() => {
    async function getAllVinyls() {
      try {
        const data = await fetch("/api/vinyls/all");
        const allVinyls = await data.json();
        setAllVinyls(allVinyls);
      } catch (error) {
        console.log(error);
      }
    }
    getAllVinyls();
  }, []);

  useEffect(() => {
    setSearchResults(
      allVinyls.filter((vinyl) => {
        if (vinyl.name.toLowerCase().includes(search.toLowerCase()) || vinyl.artist.toLowerCase().includes(search.toLowerCase())) {
          return vinyl;
        } else {
          return "";
        }
      })
    );
  }, [search, allVinyls]);

  return (
    <section id="catalog">
      <h2>Catalog</h2>
      <p className="results-counter">{searchResults.length} results</p>
      <input id="search" type="text" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} autoComplete="off" />
      <div id="catalog-container">
        {searchResults.map((vinyl, index) => {
          console.log(vinyl);
          return <ProductCard key={vinyl.vinyl_id} vinyl={vinyl} />;
        })}
      </div>
    </section>
  );
};

export default Catalog;
