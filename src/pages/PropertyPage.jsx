import { useParams, Link } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/image-gallery.css";
import propertiesData from "../data/properties.json";
import { useFavourites } from "../context/FavouritesContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

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

    // properties.json stores the photo array under "images" (not "gallery"),
    // and the "|| []" guards against any single property missing this field
    // so one bad data entry can't crash the whole page.
    const galleryImages = (property.images || []).map((src) => ({
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

            {galleryImages.length > 0 ? (
                <ImageGallery items={galleryImages} showPlayButton={false} showFullscreenButton thumbnailPosition="bottom" />
            ) : (
                <p className="property-page__no-images">No photos available for this property yet.</p>
            )}

            <header className="property-page__header">
                <div>
                    <h1>{property.location}</h1>
                    <div className="property-page__tags">
                        <span className="tag tag--type">{property.type}</span>
                        <span className="tag tag--beds">{property.bedrooms} bed</span>
                        <span className="tag tag--tenure">{property.tenure}</span>
                    </div>
                </div>
                <div className="property-page__price-actions">
                    <p className="property-page__price">£{property.price.toLocaleString()}</p>
                    <button
                        type="button"
                        className={`btn ${fav ? "btn-primary" : "btn-outline"}`}
                        onClick={() => {
                            if (fav) {
                                removeFavourite(property.id);
                                showToast(`Removed ${property.location} from favourites`, "remove");
                            } else {
                                addFavourite(property);
                                showToast(`Added ${property.location} to favourites`, "success");
                            }
                        }}
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