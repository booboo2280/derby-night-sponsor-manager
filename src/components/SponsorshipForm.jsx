// src/components/SponsorshipForm.jsx
import React from "react";

export default function SponsorshipForm({
  companies,
  newSponsorship,
  setNewSponsorship,
  addSponsorship,
}) {
  const handleChange = (field) => (e) => {
    setNewSponsorship({
      ...newSponsorship,
      [field]: e.target.value,
    });
  };

  return (
    <section>
      <h2 className="text-lg font-bold mb-3">Add Sponsorship / Donation</h2>

      <form onSubmit={addSponsorship}>
        {/* SINGLE ROW: all controls left-to-right */}
        <div className="form-row" style={{ flexWrap: "wrap" }}>
          {/* Company selector */}
          <select
            className="border p-2 rounded"
            required
            value={newSponsorship.companyId}
            onChange={handleChange("companyId")}
            style={{ minWidth: "180px" }}
          >
            <option value="">Select company…</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Type / level */}
          <input
            className="border p-2 rounded"
            placeholder="Sponsorship Type (e.g. Gold, Silent Auction, Gift Card)"
            value={newSponsorship.donationType}
            onChange={handleChange("donationType")}
            style={{ minWidth: "220px" }}
          />

          {/* Amount */}
          <input
            type="number"
            min="0"
            step="0.01"
            className="border p-2 rounded"
            placeholder="Value ($)"
            value={newSponsorship.value}
            onChange={handleChange("value")}
            style={{ width: "120px" }}
          />

          {/* Notes – stretches to fill remaining space */}
          <textarea
            className="border p-2 rounded notes-wide"
            rows="2"
            placeholder="Notes (item description, restrictions, etc.)"
            value={newSponsorship.notes}
            onChange={handleChange("notes")}
          />

          {/* Submit button */}
          <button
            type="submit"
            className="bg-emerald-700 text-white py-2 px-4 rounded"
            style={{ whiteSpace: "nowrap" }}
          >
            Add Sponsorship
          </button>
        </div>
      </form>
    </section>
  );
}
