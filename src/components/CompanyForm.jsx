import React from "react";

export default function CompanyForm({ newCompany, setNewCompany, addCompany }) {
  return (
    <section>
      <h2 className="text-lg font-bold mb-3">Add New Company</h2>

      <form onSubmit={addCompany} className="grid sm:grid-cols-2 gap-4 gap-y-8">
        <div className="form-row">
            <input
            className="border p-2 rounded"
            placeholder="Company Name *"
            value={newCompany.name}
            required
            onChange={(e) =>
                setNewCompany({ ...newCompany, name: e.target.value })
            }
            />

            <input
            className="border p-2 rounded"
            placeholder="Contact Info"
            value={newCompany.contact}
            onChange={(e) =>
                setNewCompany({ ...newCompany, contact: e.target.value })
            }
            />

            <select
            className="border p-2 rounded"
            value={newCompany.status}
            onChange={(e) =>
                setNewCompany({ ...newCompany, status: e.target.value })
            }
            >
            <option>Potential</option>
            <option>Contacted</option>
            <option>Confirmed</option>
            <option>Declined</option>
            </select>

            <textarea
            className="border p-2 rounded sm:col-span-2"
            placeholder="Notes"
            value={newCompany.notes}
            onChange={(e) =>
                setNewCompany({ ...newCompany, notes: e.target.value })
            }
            />

            <button className="bg-emerald-700 text-white py-2 rounded sm:col-span-2">
            Add Company
            </button>
        </div>
      </form>
    </section>
  );
}
