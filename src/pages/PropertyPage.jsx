import { useParams, Link } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/image-gallery.css";
import propertiesData from "../data/properties.json";
import { useFavourites } from "../context/FavouritesContext.jsx";

const ALL_PROPERTIES = propertiesData.properties;

export default function PropertyPage() {
    const { id } = useParams();
    const property = ALL_PROPERTIES.find((p) => p.id === id);
    const { isFavourite, addFavourite, removeFavourite } = useFavourites();

    if (!property) {
        return (
            <div className="container">
                <p>Property not found.</p>
                <Link to="/" className="btn btn-outline">Back to search</Link>
            </div>
        );
    }

    const fav = isFavourite(property.id);
    const galleryImages = property.gallery.map((src) => ({
        original: src,
        thumbnail: src,
        originalAlt: `${property.location} photo`,
        thumbnailAlt: `${property.location} thumbnail`,
    }));

    const mapQuery = encodeURIComponent(property.location);
    const mapSrc = `https://www.google.com/maps?q=${mapQuery}&output=embed`;

    return (
        <div className="container property-page">
            <Link to="/" className="btn btn-outline property-page__back">← Back to search</Link>

            <ImageGallery items={galleryImages} showPlayButton={false} showFullscreenButton thumbnailPosition="bottom" />

            <header className="property-page__header">
                <div>
                    <h1>{property.location}</h1>
                    <p className="property-page__meta">{property.type} · {property.bedrooms} bed · {property.tenure}</p>
                </div>
                <div className="property-page__price-actions">
                    <p className="property-page__price">£{property.price.toLocaleString()}</p>
                    <button
                        type="button"
                        className={`btn ${fav ? "btn-primary" : "btn-outline"}`}
                        onClick={() => (fav ? removeFavourite(property.id) : addFavourite(property))}
                        aria-pressed={fav}
                    >
                        {fav ? "♥ Saved to favourites" : "♡ Add to favourites"}
                    </button>
                </div>
            </header>

            <Tabs>
                <TabList>
                    <Tab>Description</Tab>
                    <Tab>Floor plan</Tab>
                    <Tab>Map</Tab>
                </TabList>

                <TabPanel>
                    <p className="property-page__description">{property.description}</p>
                </TabPanel>

                <TabPanel>
                    <img src={property.floorplan} alt={`Floor plan for ${property.location}`} className="property-page__floorplan" />
                </TabPanel>

                <TabPanel>
                    <iframe
                        title={`Map for ${property.location}`}
                        src={mapSrc}
                        width="100%"
                        height="420"
                        style={{ border: 0, borderRadius: "var(--radius-md)" }}
                        loading="lazy"
                    />
                </TabPanel>
            </Tabs>
        </div>
    );
}