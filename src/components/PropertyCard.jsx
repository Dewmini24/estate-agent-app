import { Link } from "react-router-dom";
import { useFavourites } from "../context/FavouritesContext.jsx";

function shortDescription(text, max = 110) {
    const plain = text.replace(/<[^>]*>/g, ""); // strip any inline HTML from the JSON description
    return plain.length > max ? plain.slice(0, max).trimEnd() + "…" : plain;
}

export default function PropertyCard({ property }) {
    const { isFavourite, addFavourite, removeFavourite } = useFavourites();
    const fav = isFavourite(property.id);

    function handleDragStart(e) {
        e.dataTransfer.setData("text/plain", property.id);
        e.dataTransfer.effectAllowed = "copy";
    }

    function toggleFavourite() {
        if (fav) removeFavourite(property.id);
        else addFavourite(property);
    }

    return (
        <article
            className="property-card card"
            draggable
            onDragStart={handleDragStart}
            aria-label={`${property.type} in ${property.location}`}
        >
            <div className="property-card__media">
                <img src={property.picture} alt={`${property.type} at ${property.location}`} loading="lazy" />
                <button
                    type="button"
                    className={`favourite-btn ${fav ? "favourite-btn--active" : ""}`}
                    onClick={toggleFavourite}
                    aria-pressed={fav}
                    aria-label={fav ? "Remove from favourites" : "Add to favourites"}
                    title={fav ? "Remove from favourites" : "Add to favourites"}
                >
                    {fav ? "♥" : "♡"}
                </button>
            </div>
            <div className="property-card__body">
                <p className="property-card__price">£{property.price.toLocaleString()}</p>
                <h3 className="property-card__location">{property.location}</h3>
                <p className="property-card__meta">{property.type} · {property.bedrooms} bed</p>
                <p className="property-card__desc">{shortDescription(property.description)}</p>
                <Link to={`/property/${property.id}`} className="btn btn-outline property-card__link">
                    View details
                </Link>
            </div>
        </article>
    );
}