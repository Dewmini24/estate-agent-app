import { useState } from "react";
import { Link } from "react-router-dom";
import { useFavourites } from "../context/FavouritesContext.jsx";

export default function FavouritesList({ allProperties }) {
    const { favourites, addFavourite, removeFavourite, clearFavourites } = useFavourites();
    const [isDragOver, setIsDragOver] = useState(false);

    function handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
        setIsDragOver(true);
    }

    function handleDrop(e) {
        e.preventDefault();
        setIsDragOver(false);
        const id = e.dataTransfer.getData("text/plain");
        const property = allProperties.find((p) => p.id === id);
        if (property) addFavourite(property); // reducer already prevents duplicates
    }

    // Dragging a favourite back OUT of the list removes it (drag-to-remove).
    function handleFavDragStart(e, id) {
        e.dataTransfer.setData("application/x-remove-favourite", id);
    }

    function handleContainerDragLeave() {
        setIsDragOver(false);
    }

    return (
        <aside
            className={`favourites-panel card ${isDragOver ? "favourites-panel--over" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleContainerDragLeave}
            onDrop={handleDrop}
            aria-label="Favourite properties"
        >
            <div className="favourites-panel__header">
                <h2>Favourites ({favourites.length})</h2>
                {favourites.length > 0 && (
                    <button type="button" className="btn btn-outline btn-small" onClick={clearFavourites}>
                        Clear all
                    </button>
                )}
            </div>

            {favourites.length === 0 ? (
                <p className="favourites-panel__empty">
                    Drag a property here, or use the ♡ button on any listing, to save it.
                </p>
            ) : (
                <ul className="favourites-panel__list">
                    {favourites.map((p) => (
                        <li key={p.id} draggable onDragStart={(e) => handleFavDragStart(e, p.id)}>
                            <img src={p.picture} alt="" width="48" height="48" />
                            <div className="favourites-panel__info">
                                <Link to={`/property/${p.id}`}>{p.location}</Link>
                                <span>£{p.price.toLocaleString()}</span>
                            </div>
                            <button
                                type="button"
                                className="favourites-panel__remove"
                                onClick={() => removeFavourite(p.id)}
                                aria-label={`Remove ${p.location} from favourites`}
                            >
                                ×
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </aside>
    );
}