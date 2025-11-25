import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import SponsorManager from "./components/SponsorManager";
import Decorations from "./components/Decorations";

export default function App() {
  return (
    <Router>
      <nav className="bg-slate-800 text-white p-4 flex gap-6">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/sponsors" className="hover:underline">Sponsorship Manager</Link>
        <Link to="/decorations" className="hover:underline">Decorations</Link>
      </nav>

      <div className="p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sponsors" element={<SponsorManager />} />
          <Route path="/decorations" element={<Decorations />} />
        </Routes>
      </div>
    </Router> 
  );
}
