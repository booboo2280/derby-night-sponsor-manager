import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ maxWidth: "640px", margin: "3rem auto", textAlign: "left" }}>
      <h1 style={{ fontSize: "2.5rem", fontWeight: "700", marginBottom: "1rem" }}>
        Derby Night Tools
      </h1>

      <p style={{ fontSize: "1.1rem", color: "#475569", marginBottom: "1.5rem" }}>
        Use the navigation above to manage sponsors and plan decorations for Derby Night.
      </p>

      <p style={{ fontSize: "0.95rem", color: "#64748b" }}>
        Start by visiting the{" "}
        <Link to="/sponsors">Sponsorship Manager</Link> to add companies and
        track donations, or go to <Link to="/decorations">Decorations</Link> to
        plan event decor.
      </p>
    </div>
  );
}
