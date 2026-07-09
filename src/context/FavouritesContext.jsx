import { createContext, useContext, useEffect, useReducer } from "react";

const FavouritesContext = createContext(null);
const STORAGE_KEY = "estateAgentFavourites";

// Pure reducer - easy to unit test in isolation from React rendering.
export function favouritesReducer(state, action) {
    switch (action.type) {
        case "ADD": {
            if (state.some((p) => p.id === action.property.id)) return state; // no duplicates
            return [...state, action.property];
        }
        case "REMOVE":
            return state.filter((p) => p.id !== action.id);
        case "CLEAR":
            return [];
        case "LOAD":
            return action.items;
        default:
            return state;
    }
}

export function FavouritesProvider({ children }) {
    const [favourites, dispatch] = useReducer(favouritesReducer, []);

    // Load once on mount
    useEffect(() => {
        try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
            if (Array.isArray(saved) && saved.length) dispatch({ type: "LOAD", items: saved });
        } catch {
            // ignore corrupt storage
        }
    }, []);

    // Persist on every change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites));
    }, [favourites]);

    const addFavourite = (property) => dispatch({ type: "ADD", property });
    const removeFavourite = (id) => dispatch({ type: "REMOVE", id });
    const clearFavourites = () => dispatch({ type: "CLEAR" });
    const isFavourite = (id) => favourites.some((p) => p.id === id);

    return (
        <FavouritesContext.Provider
            value={{ favourites, addFavourite, removeFavourite, clearFavourites, isFavourite }}
        >
            {children}
        </FavouritesContext.Provider>
    );
}

export function useFavourites() {
    const ctx = useContext(FavouritesContext);
    if (!ctx) throw new Error("useFavourites must be used within a FavouritesProvider");
    return ctx;
}