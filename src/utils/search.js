// Converts a property's "added" object into a real Date for comparisons.
export function toDate(added) {
    return new Date(`${added.month} ${added.day}, ${added.year}`);
}

// Extracts the first part of a UK postcode, e.g. "BR5 1AA" -> "BR5", "BR5" -> "BR5"
export function postcodeArea(location) {
    const match = location.match(/\b([A-Z]{1,2}\d{1,2}[A-Z]?)\b(?:\s+\d[A-Z]{2})?$/);
    return match ? match[1] : "";
}

/**
 * Filters properties against any combination of the 5 supported criteria.
 * Every criterion is optional; omitted/empty criteria are ignored so the
 * search works correctly for 1, 2, 3, 4 or all 5 criteria at once.
 *
 * criteria = {
 *   type: "House" | "Flat" | "" (any),
 *   minPrice, maxPrice: number | null,
 *   minBedrooms, maxBedrooms: number | null,
 *   dateAfter: string (yyyy-mm-dd) | null,
 *   dateFrom, dateTo: string (yyyy-mm-dd) | null,
 *   postcode: string | ""
 * }
 */
export function filterProperties(properties, criteria = {}) {
    return properties.filter((p) => {
        if (criteria.type && criteria.type !== "Any" && p.type !== criteria.type) {
            return false;
        }
        if (criteria.minPrice != null && p.price < criteria.minPrice) return false;
        if (criteria.maxPrice != null && p.price > criteria.maxPrice) return false;

        if (criteria.minBedrooms != null && p.bedrooms < criteria.minBedrooms) return false;
        if (criteria.maxBedrooms != null && p.bedrooms > criteria.maxBedrooms) return false;

        const added = toDate(p.added);
        if (criteria.dateAfter) {
            if (added < new Date(criteria.dateAfter)) return false;
        }
        if (criteria.dateFrom && criteria.dateTo) {
            if (added < new Date(criteria.dateFrom) || added > new Date(criteria.dateTo)) return false;
        }

        if (criteria.postcode) {
            const area = postcodeArea(p.location).toUpperCase();
            if (area !== criteria.postcode.toUpperCase()) return false;
        }

        return true;
    });
}