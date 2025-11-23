// src/App.jsx
import React, { useEffect, useState } from "react";
import DerbyHero from "./components/DerbyHero";
import SponsorManager from "./components/SponsorManager";
import Login from "./components/Login";

export default function App() {
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    // check if user already logged in previously
    const stored = localStorage.getItem("derby-authed");
    if (stored === "true") {
      setIsAuthed(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthed(true);
  };

  if (!isAuthed) {
    // show login screen until authenticated
    return <Login onSuccess={handleLoginSuccess} />;
  }

  // once logged in, show the actual app
  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <DerbyHero />
      <SponsorManager />
    </div>
  );
}
