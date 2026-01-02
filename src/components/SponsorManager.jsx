import React, { useState, useEffect } from "react";
import CompanyForm from "./CompanyForm";
import SponsorshipForm from "./SponsorshipForm";
import CompanyList from "./CompanyList";
import DerbyHero from "./DerbyHero";
import "../styles/forms.css";

// Use your live Railway backend
const API_BASE =
  "https://derby-night-sponsor-manager-production.up.railway.app";

export default function SponsorManager() {
  // ----------------------
  // STATE
  // ----------------------
  const [companies, setCompanies] = useState([]);
  const [sponsorships, setSponsorships] = useState([]);

  const [newCompany, setNewCompany] = useState({
    name: "",
    contact: "",
    status: "Potential",
    notes: "",
  });

  const [newSponsorship, setNewSponsorship] = useState({
    companyId: "",
    value: "",
    level: "",
    donationType: "",
    item: "",
    notes: "",
  });

  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [loadingSponsorships, setLoadingSponsorships] = useState(false);
  const [error, setError] = useState("");

  // ----------------------
  // LOAD DATA ON MOUNT
  // ----------------------
  useEffect(() => {
    const loadCompanies = async () => {
      try {
        setLoadingCompanies(true);
        setError("");

        const res = await fetch(`${API_BASE}/api/companies`);
        if (!res.ok) throw new Error("Failed to fetch companies");

        const data = await res.json();
        setCompanies(data);
      } catch (err) {
        console.error("Error loading companies", err);
        setError("Could not load companies. Make sure the server is running.");
      } finally {
        setLoadingCompanies(false);
      }
    };

    loadCompanies();
  }, []);

  // fetch sponsorships (extracted so we can reuse after mutations)
  const loadSponsorships = async () => {
    try {
      setLoadingSponsorships(true);
      setError("");

      const res = await fetch(`${API_BASE}/api/sponsorships`);
      if (!res.ok) throw new Error("Failed to fetch sponsorships");

      const data = await res.json();
      setSponsorships(data);
    } catch (err) {
      console.error("Error loading sponsorships", err);
      setError("Could not load sponsorships. Make sure the server is running.");
    } finally {
      setLoadingSponsorships(false);
    }
  };

  useEffect(() => {
    loadSponsorships();
  }, []);

  // ----------------------
  // COMPANY FUNCTIONS
  // ----------------------
  const addCompany = async (e) => {
    e.preventDefault();

    if (!newCompany.name.trim()) {
      alert("Company name is required.");
      return;
    }

    try {
      setError("");

      const res = await fetch(`${API_BASE}/api/companies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCompany),
      });

      if (!res.ok) throw new Error("Failed to save company");

      const saved = await res.json();

      // Prepend newest on top
      setCompanies((prev) => [saved, ...prev]);

      // Reset form
      setNewCompany({
        name: "",
        contact: "",
        status: "Potential",
        notes: "",
      });
    } catch (err) {
      console.error("Error saving company", err);
      setError("Could not save company. Please try again.");
    }
  };

  const deleteCompany = async (id) => {
    if (!window.confirm("Delete company and all its sponsorships?")) return;

    try {
      setError("");

      const res = await fetch(`${API_BASE}/api/companies/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete company");

      setCompanies((prev) => prev.filter((c) => c.id !== id));
      setSponsorships((prev) => prev.filter((s) => s.companyId !== id));
    } catch (err) {
      console.error("Error deleting company", err);
      setError("Could not delete company.");
    }
  };

  const updateCompany = async (id, updates) => {
    try {
      setError("");

      const res = await fetch(`${API_BASE}/api/companies/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!res.ok) throw new Error("Failed to update company");

      const saved = await res.json();

      setCompanies((prev) => prev.map((c) => (c.id === id ? saved : c)));
    } catch (err) {
      console.error("Error updating company", err);
      setError("Could not update company.");
    }
  };

  // ----------------------
  // SPONSORSHIP FUNCTIONS
  // ----------------------
  const addSponsorship = async (e) => {
    e.preventDefault();

    if (!newSponsorship.companyId) {
      alert("Please select a company for this sponsorship.");
      return;
    }

    if (!newSponsorship.value && !newSponsorship.item) {
      alert("Please enter a dollar value or item description.");
      return;
    }

    try {
      setError("");

      const payload = {
        companyId: Number(newSponsorship.companyId),
        value: newSponsorship.value ? Number(newSponsorship.value) : 0,
        type: newSponsorship.donationType, // FIXED NAME
        item: newSponsorship.item,
        notes: newSponsorship.notes,
      };

      const res = await fetch(`${API_BASE}/api/sponsorships`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save sponsorship");

      const saved = await res.json();

      // Refresh from server to ensure consistent shape and ordering
      await loadSponsorships();

      setNewSponsorship({
        companyId: "",
        value: "",
        level: "",
        donationType: "",
        item: "",
        notes: "",
      });
    } catch (err) {
      console.error("Error saving sponsorship", err);
      setError("Could not save sponsorship. Please try again.");
    }
  };

  const deleteSponsorship = async (id) => {
    if (!window.confirm("Delete this sponsorship?")) return;

    try {
      setError("");

      const res = await fetch(`${API_BASE}/api/sponsorships/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete sponsorship");

      // Refresh list after deletion
      await loadSponsorships();
    } catch (err) {
      console.error("Error deleting sponsorship", err);
      setError("Could not delete sponsorship.");
    }
  };

  // ----------------------
  // RENDER
  // ----------------------
  return (
    <main>
      <DerbyHero />

      <div className="mt-8">
        <section className="bg-white shadow-md rounded-xl p-4 sm:p-6 mb-6">
          <h2 className="text-2xl font-bold text-emerald-800 mb-4">
            Sponsor Manager
          </h2>

        {error && (
          <div className="mb-4 p-3 rounded bg-red-50 text-sm text-red-700 border border-red-200">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {/* LEFT: Companies */}
          <div>
            <CompanyForm
              newCompany={newCompany}
              setNewCompany={setNewCompany}
              addCompany={addCompany}
              loading={loadingCompanies}
            />
          </div>

          {/* RIGHT: Sponsorship form */}
          <div>
            <SponsorshipForm
              companies={companies}
              newSponsorship={newSponsorship}
              setNewSponsorship={setNewSponsorship}
              addSponsorship={addSponsorship}
              loading={loadingSponsorships}
            />
          </div>
        </div>
      </section>

      <section className="bg-white shadow-md rounded-xl p-4 sm:p-6">
        <div>
          <CompanyList
            companies={companies}
            sponsorships={sponsorships}
            updateCompany={updateCompany}
            deleteCompany={deleteCompany}
            deleteSponsorship={deleteSponsorship}
          />
        </div>
      </section>
    </div>
    </main>
  );
}
