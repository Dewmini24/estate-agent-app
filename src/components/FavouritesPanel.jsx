import { useState } from "react";
import { Link } from "react-router-dom";
import { useFavourites } from "../context/FavouritesContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

/**
 * Replaces the old static sidebar FavouritesList. A floating action button
 * (bottom-right) shows the saved count and doubles as a drop target for
 * drag-and-drop; clicking it opens a slide-in drawer with the full list.
 */
export default function FavouritesPanel({ allProperties }) {
    const { favourites, addFavourite, removeFavourite, clearFavourites } = useFavourites();
    const [isOpen, setIsOpen] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const { showToast } = useToast();

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
        if (property) {
            addFavourite(property); // reducer already prevents duplicates
            setIsOpen(true); // reveal the drawer so the drop feels confirmed
        }
        showToast(`Added ${property.location} to favourites`, "success");
    }

    // Dragging a favourite row back out onto the FAB removes it - a second
    // drag-to-remove path alongside the delete button.
    function handleFavDragStart(e, id) {
        e.dataTransfer.setData("application/x-remove-favourite", id);
    }

    return (
        <>
            <button
                type="button"
                className={`fav-fab ${isDragOver ? "fav-fab--over" : ""}`}
                onClick={() => {
                    removeFavourite(p.id);
                    showToast(`Removed ${p.location} from favourites`, "remove");
                }}
                onDragOver={handleDragOver}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                aria-label={`Favourites, ${favourites.length} saved`}
                aria-expanded={isOpen}
            >
                <span className="fav-fab__icon" aria-hidden="true">♥</span>
                {favourites.length > 0 && <span className="fav-fab__badge">{favourites.length}</span>}
            </button>

            <aside className={`fav-drawer ${isOpen ? "fav-drawer--open" : ""}`} aria-hidden={!isOpen} aria-label="Favourite properties">
                <div className="fav-drawer__header">
                    <h2>Favourites <span className="fav-drawer__count">{favourites.length}</span></h2>
                    <div className="fav-drawer__header-actions">
                        {favourites.length > 0 && (
                            <button type="button" className="btn btn-outline btn-small" onClick={clearFavourites}>
                                Clear all
                            </button>
                        )}
                        <button type="button" className="fav-drawer__close" onClick={() => setIsOpen(false)} aria-label="Close favourites">
                            ×
                        </button>
                    </div>
                </div>

                {favourites.length === 0 ? (
                    <p className="favourites-panel__empty">
                        Drag a property onto the ♥ button, or use the ♡ icon on any listing, to save it here.
                    </p>
                ) : (
                    <ul className="favourites-panel__list">
                        {favourites.map((p) => (
                            <li key={p.id} draggable onDragStart={(e) => handleFavDragStart(e, p.id)}>
                                <img src={p.picture} alt="" width="48" height="48" />
                                <div className="favourites-panel__info">
                                    <Link to={`/property/${p.id}`} onClick={() => setIsOpen(false)}>{p.location}</Link>
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

            {isOpen && <div className="fav-drawer__scrim" onClick={() => setIsOpen(false)} aria-hidden="true" />}
        </>
    );
}