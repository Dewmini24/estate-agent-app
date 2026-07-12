import { useState } from "react";
import DropdownList from "react-widgets/DropdownList";
import NumberPicker from "react-widgets/NumberPicker";
import DatePicker from "react-widgets/DatePicker";
import Combobox from "react-widgets/Combobox";

const TYPES = ["Any", "House", "Flat"];
const DATE_MODES = ["Any time", "Added after", "Added between"];

const icons = {
    type: "⌂",
    price: "£",
    beds: "☾",
    date: "♡",
    postcode: "⌖",
};

export default function SearchForm({ postcodeOptions, onSearch, onClear }) {
    const [type, setType] = useState("Any");
    const [minPrice, setMinPrice] = useState(null);
    const [maxPrice, setMaxPrice] = useState(null);
    const [minBedrooms, setMinBedrooms] = useState(null);
    const [maxBedrooms, setMaxBedrooms] = useState(null);
    const [dateMode, setDateMode] = useState("Any time");
    const [dateAfter, setDateAfter] = useState(null);
    const [dateFrom, setDateFrom] = useState(null);
    const [dateTo, setDateTo] = useState(null);
    const [postcode, setPostcode] = useState("");

    function toISO(d) {
        return d ? d.toISOString().slice(0, 10) : null;
    }

    function handleSubmit(e) {
        e.preventDefault();

        onSearch({
            type: type === "Any" ? "" : type,
            minPrice,
            maxPrice,
            minBedrooms,
            maxBedrooms,
            dateAfter: dateMode === "Added after" ? toISO(dateAfter) : null,
            dateFrom: dateMode === "Added between" ? toISO(dateFrom) : null,
            dateTo: dateMode === "Added between" ? toISO(dateTo) : null,
            postcode: postcode.trim(),
        });
    }

    function handleClear() {
        setType("Any");
        setMinPrice(null);
        setMaxPrice(null);
        setMinBedrooms(null);
        setMaxBedrooms(null);
        setDateMode("Any time");
        setDateAfter(null);
        setDateFrom(null);
        setDateTo(null);
        setPostcode("");

        onClear();
    }

    return (
        <form
            className="search-form cute-search"
            onSubmit={handleSubmit}
            aria-label="Property search"
        >
            <div className="cute-search__header">
                <div className="cute-search__header-icon">⌕</div>

                <div>
                    <h2>Find your happy place</h2>
                    <p>Mix & match filters to discover your perfect home ✨</p>
                </div>
            </div>

            <div className="cute-search__scroll">
                <fieldset className="cute-filter">
                    <legend>
                        <span className="cute-filter__icon">
                            {icons.type}
                        </span>

                        <span>
                            <strong>Property type</strong>
                            <small>What are you looking for?</small>
                        </span>
                    </legend>

                    <DropdownList
                        data={TYPES}
                        value={type}
                        onChange={setType}
                        aria-label="Property type"
                    />
                </fieldset>

                <fieldset className="cute-filter">
                    <legend>
                        <span className="cute-filter__icon cute-filter__icon--pink">
                            {icons.price}
                        </span>

                        <span>
                            <strong>Your budget</strong>
                            <small>Choose a comfortable price range</small>
                        </span>
                    </legend>

                    <div className="cute-range">
                        <div className="cute-range__item">
                            <span className="cute-range__label">MIN</span>

                            <NumberPicker
                                placeholder="£ Min"
                                value={minPrice}
                                onChange={setMinPrice}
                                min={0}
                                step={5000}
                                aria-label="Minimum price"
                            />
                        </div>

                        <span className="cute-range__line">—</span>

                        <div className="cute-range__item">
                            <span className="cute-range__label">MAX</span>

                            <NumberPicker
                                placeholder="£ Max"
                                value={maxPrice}
                                onChange={setMaxPrice}
                                min={0}
                                step={5000}
                                aria-label="Maximum price"
                            />
                        </div>
                    </div>
                </fieldset>

                <fieldset className="cute-filter">
                    <legend>
                        <span className="cute-filter__icon cute-filter__icon--blue">
                            {icons.beds}
                        </span>

                        <span>
                            <strong>Bedrooms</strong>
                            <small>How much space do you need?</small>
                        </span>
                    </legend>

                    <div className="cute-range">
                        <div className="cute-range__item">
                            <span className="cute-range__label">MIN</span>

                            <NumberPicker
                                placeholder="Min beds"
                                value={minBedrooms}
                                onChange={setMinBedrooms}
                                min={0}
                                max={10}
                                aria-label="Minimum bedrooms"
                            />
                        </div>

                        <span className="cute-range__line">—</span>

                        <div className="cute-range__item">
                            <span className="cute-range__label">MAX</span>

                            <NumberPicker
                                placeholder="Max beds"
                                value={maxBedrooms}
                                onChange={setMaxBedrooms}
                                min={0}
                                max={10}
                                aria-label="Maximum bedrooms"
                            />
                        </div>
                    </div>
                </fieldset>

                <fieldset className="cute-filter">
                    <legend>
                        <span className="cute-filter__icon cute-filter__icon--orange">
                            {icons.date}
                        </span>

                        <span>
                            <strong>Date added</strong>
                            <small>Discover fresh listings</small>
                        </span>
                    </legend>

                    <DropdownList
                        data={DATE_MODES}
                        value={dateMode}
                        onChange={setDateMode}
                        aria-label="Date filter mode"
                    />

                    {dateMode === "Added after" && (
                        <div className="cute-search__reveal">
                            <DatePicker
                                value={dateAfter}
                                onChange={setDateAfter}
                                placeholder="Choose a date"
                                aria-label="Added after"
                            />
                        </div>
                    )}

                    {dateMode === "Added between" && (
                        <div className="cute-date-range cute-search__reveal">
                            <DatePicker
                                value={dateFrom}
                                onChange={setDateFrom}
                                placeholder="From"
                                aria-label="Added from"
                            />

                            <span>→</span>

                            <DatePicker
                                value={dateTo}
                                onChange={setDateTo}
                                placeholder="To"
                                aria-label="Added to"
                            />
                        </div>
                    )}
                </fieldset>

                <fieldset className="cute-filter">
                    <legend>
                        <span className="cute-filter__icon cute-filter__icon--green">
                            {icons.postcode}
                        </span>

                        <span>
                            <strong>Postcode area</strong>
                            <small>Where would you love to live?</small>
                        </span>
                    </legend>

                    <Combobox
                        data={postcodeOptions}
                        value={postcode}
                        onChange={setPostcode}
                        placeholder="Try BR5..."
                        aria-label="Postcode area"
                    />
                </fieldset>
            </div>

            <div className="cute-search__actions">
                <button
                    type="submit"
                    className="cute-search__submit"
                >
                    <span>⌕</span>
                    Find my home
                </button>

                <button
                    type="button"
                    className="cute-search__clear"
                    onClick={handleClear}
                >
                    Clear all
                </button>
            </div>
        </form>
    );
}