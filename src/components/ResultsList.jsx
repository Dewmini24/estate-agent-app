import PropertyCard from "./PropertyCard.jsx";

export default function ResultsList({ results }) {
  if (!results.length) {
    return <p className="results-empty">No properties match your search. Try widening your criteria.</p>;
  }
  return (
    <div className="results-grid">
      {results.map((p) => (
        <PropertyCard key={p.id} property={p} />
      ))}
    </div>
  );
}