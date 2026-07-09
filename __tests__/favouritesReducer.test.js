import { favouritesReducer } from "../src/context/FavouritesContext.jsx";

const propA = { id: "a", location: "Test Street" };
const propB = { id: "b", location: "Other Street" };

test("adds a property to an empty favourites list", () => {
    const state = favouritesReducer([], { type: "ADD", property: propA });
    expect(state).toEqual([propA]);
});

test("does not add the same property twice", () => {
    const state = favouritesReducer([propA], { type: "ADD", property: propA });
    expect(state).toHaveLength(1);
});

test("removes a property by id and clears the whole list", () => {
    let state = favouritesReducer([propA, propB], { type: "REMOVE", id: "a" });
    expect(state).toEqual([propB]);
    state = favouritesReducer(state, { type: "CLEAR" });
    expect(state).toEqual([]);
});