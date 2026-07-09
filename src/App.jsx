import { Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import PropertyPage from "./pages/PropertyPage.jsx";

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/property/:id" element={<PropertyPage />} />
        </Routes>
      </main>
    </>
  );
}