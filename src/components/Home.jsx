import { Link } from "react-router-dom";
import "../styles/home.css";
import DerbyHero from "./DerbyHero";

export default function Home() {
  return (
    <main>
      <DerbyHero />

      <div className="home-container">
        <h1 className="home-title">Derby Night Tools</h1>

        <p className="home-lead">
          Use the navigation above to manage sponsors and plan decorations for Derby Night.
        </p>

        <p className="home-text">
          Start by visiting the <Link to="/sponsors">Sponsorship Manager</Link> to add companies and
          track donations, or go to <Link to="/decorations">Decorations</Link> to plan event decor.
        </p>
      </div>
    </main>
  );
}
