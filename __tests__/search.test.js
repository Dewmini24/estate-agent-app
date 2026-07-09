import { filterProperties, postcodeArea, toDate } from "../src/utils/search.js";

const sample = [
	{ id: "a", type: "House", bedrooms: 3, price: 750000, location: "Petts Wood Road, Orpington BR5", added: { month: "October", day: 12, year: 2022 } },
	{ id: "b", type: "Flat", bedrooms: 2, price: 399995, location: "Crofton Road, Orpington BR6", added: { month: "September", day: 14, year: 2022 } },
	{ id: "c", type: "House", bedrooms: 5, price: 1250000, location: "Hollybush Lane, Sevenoaks TN13", added: { month: "June", day: 8, year: 2025 } },
];

test("filters by a single criterion (type)", () => {
	const result = filterProperties(sample, { type: "Flat" });
	expect(result).toHaveLength(1);
	expect(result[0].id).toBe("b");
});

test("filters by multiple simultaneous criteria (type + price + bedrooms)", () => {
	const result = filterProperties(sample, { type: "House", minPrice: 500000, maxPrice: 900000, minBedrooms: 2, maxBedrooms: 4 });
	expect(result).toHaveLength(1);
	expect(result[0].id).toBe("a");
});

test("returns all properties when no criteria are supplied", () => {
	expect(filterProperties(sample, {})).toHaveLength(3);
});

test("filters by postcode area extracted from a full address", () => {
	expect(postcodeArea("Petts Wood Road, Orpington BR5")).toBe("BR5");
	const result = filterProperties(sample, { postcode: "TN13" });
	expect(result).toHaveLength(1);
	expect(result[0].id).toBe("c");
});

test("filters by date added after a given date", () => {
	const result = filterProperties(sample, { dateAfter: "2024-01-01" });
	expect(result).toHaveLength(1);
	expect(result[0].id).toBe("c");
	expect(toDate(sample[2].added).getFullYear()).toBe(2025);
});