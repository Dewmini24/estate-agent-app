import { useMemo, useState } from "react";
import propertiesData from "../data/properties.json";
import SearchForm from "../components/SearchForm.jsx";
import ResultsList from "../components/ResultsList.jsx";
import FavouritesList from "../components/FavouritesList.jsx";
import { filterProperties, postcodeArea } from "../utils/search.js";
import { useFavourites } from "../context/FavouritesContext.jsx";

const ALL_PROPERTIES = propertiesData.properties;

export default function SearchPage() {
    const [results, setResults] = useState(ALL_PROPERTIES);
    const [hasSearched, setHasSearched] = useState(false);
    const { removeFavourite } = useFavourites();

    const postcodeOptions = useMemo(
        () => [...new Set(ALL_PROPERTIES.map((p) => postcodeArea(p.location)))].filter(Boolean).sort(),
        []
    );

    function handleSearch(criteria) {
        setResults(filterProperties(ALL_PROPERTIES, criteria));
        setHasSearched(true);
    }

    function handleClear() {
        setResults(ALL_PROPERTIES);
        setHasSearched(false);
    }

    // Dropping a favourite-list item back onto the results area removes it
    // from favourites (drag-out-to-remove), complementing the delete button.
    function handleResultsDrop(e) {
        const id = e.dataTransfer.getData("application/x-remove-favourite");
        if (id) removeFavourite(id);
    }

    return (
        <div className="search-page">
            <section className="hero">
                <div className="container hero__inner">
                    <h1>Find the perfect place</h1>
                    <p>Search houses and flats by type, price, bedrooms, date added and postcode area.</p>
                </div>
            </section>

            <div className="container search-page__layout">
                <div className="search-page__form-col">
                    <SearchForm postcodeOptions={postcodeOptions} onSearch={handleSearch} onClear={handleClear} />
                    <FavouritesList allProperties={ALL_PROPERTIES} />
                </div>

                <div
                    className="search-page__results-col"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleResultsDrop}
                >
                    <h2>{hasSearched ? `${results.length} propert${results.length === 1 ? "y" : "ies"} found` : "All properties"}</h2>
                    <ResultsList results={results} />
                </div>
            </div>
        </div>
    );
}