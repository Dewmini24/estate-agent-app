import { Link } from "react-router-dom";

// Simple top bar. Kept deliberately calm so the hero/search area carries
// the visual weight, echoing the reference UI's minimal top nav.
export default function Header() {
    return (
        <header className="site-header">
            <div className="container site-header__inner">
                <Link to="/" className="brand">
                    <span className="brand__mark">N</span>
                    <span className="brand__name">Nestly</span>
                </Link>
                <p className="brand__tag">Find your next place, faster.</p>
            </div>
        </header>
    );
}