import { useState } from "react";
import DropdownList from "react-widgets/DropdownList";
import NumberPicker from "react-widgets/NumberPicker";
import DatePicker from "react-widgets/DatePicker";
import Combobox from "react-widgets/Combobox";

const TYPES = ["Any", "House", "Flat"];
const DATE_MODES = ["Any time", "Added after", "Added between"];

/**
 * Controlled search form. Every field is optional - the parent's search
 * handler (filterProperties) simply ignores fields left blank, which is
 * what lets any combination of 1-5 criteria work.
 */
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
        <form className="search-form card" onSubmit={handleSubmit} aria-label="Property search">
            <fieldset className="search-form__group">
                <legend>Property type</legend>
                <DropdownList data={TYPES} value={type} onChange={setType} aria-label="Property type" />
            </fieldset>

            <fieldset className="search-form__group">
                <legend>Price range (£)</legend>
                <div className="search-form__row">
                    <NumberPicker
                        placeholder="Min price"
                        value={minPrice}
                        onChange={setMinPrice}
                        min={0}
                        step={5000}
                        aria-label="Minimum price"
                    />
                    <span aria-hidden="true">to</span>
                    <NumberPicker
                        placeholder="Max price"
                        value={maxPrice}
                        onChange={setMaxPrice}
                        min={0}
                        step={5000}
                        aria-label="Maximum price"
                    />
                </div>
            </fieldset>

            <fieldset className="search-form__group">
                <legend>Bedrooms</legend>
                <div className="search-form__row">
                    <NumberPicker
                        placeholder="Min beds"
                        value={minBedrooms}
                        onChange={setMinBedrooms}
                        min={0}
                        max={10}
                        aria-label="Minimum bedrooms"
                    />
                    <span aria-hidden="true">to</span>
                    <NumberPicker
                        placeholder="Max beds"
                        value={maxBedrooms}
                        onChange={setMaxBedrooms}
                        min={0}
                        max={10}
                        aria-label="Maximum bedrooms"
                    />
                </div>
            </fieldset>

            <fieldset className="search-form__group">
                <legend>Date added</legend>
                <DropdownList data={DATE_MODES} value={dateMode} onChange={setDateMode} aria-label="Date filter mode" />
                {dateMode === "Added after" && (
                    <DatePicker value={dateAfter} onChange={setDateAfter} placeholder="Choose a date" aria-label="Added after" />
                )}
                {dateMode === "Added between" && (
                    <div className="search-form__row">
                        <DatePicker value={dateFrom} onChange={setDateFrom} placeholder="From" aria-label="Added from" />
                        <DatePicker value={dateTo} onChange={setDateTo} placeholder="To" aria-label="Added to" />
                    </div>
                )}
            </fieldset>

            <fieldset className="search-form__group">
                <legend>Postcode area</legend>
                <Combobox
                    data={postcodeOptions}
                    value={postcode}
                    onChange={setPostcode}
                    placeholder="e.g. BR5"
                    aria-label="Postcode area"
                />
            </fieldset>

            <div className="search-form__actions">
                <button type="submit" className="btn btn-primary">Search properties</button>
                <button type="button" className="btn btn-outline" onClick={handleClear}>Clear</button>
            </div>
        </form>
    );
}