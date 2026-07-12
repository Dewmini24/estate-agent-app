import { Routes, Route } from "react-router-dom";
import SearchPage from "./pages/SearchPage.jsx";
import PropertyPage from "./pages/PropertyPage.jsx";
import FavouritesPanel from "./components/FavouritesPanel.jsx";
import propertiesData from "./data/properties.json";

const ALL_PROPERTIES = propertiesData.properties;

export default function App() {
  return (
    <>
      <main>
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/property/:id" element={<PropertyPage />} />
        </Routes>
      </main>
      {/* Global so favourites are reachable from every page, not just search */}
      <FavouritesPanel allProperties={ALL_PROPERTIES} />
    </>
  );
}