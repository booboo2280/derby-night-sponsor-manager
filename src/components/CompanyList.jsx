// src/components/CompanyList.jsx
import React from "react";

export default function CompanyList({
  companies,
  sponsorships,
  updateCompany,
  deleteCompany,
  deleteSponsorship,
}) {
  // All sponsorships for a given company
  const getCompanySponsorships = (companyId) =>
    sponsorships.filter((s) => s.companyId === companyId);

  // Total value for that company
  const getCompanyTotalValue = (companyId) =>
    getCompanySponsorships(companyId).reduce(
      (sum, s) => sum + (Number(s.value) || 0),
      0
    );

  if (!companies || companies.length === 0) {
    return (
      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4">
          Companies &amp; Sponsorships
        </h2>
        <p className="text-sm text-slate-600">No companies added yet.</p>
      </section>
    );
  }

  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold mb-4">
        Companies &amp; Sponsorships
      </h2>

      {/* GRID OF COMPANY CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
          gap: "20px",
          alignItems: "start",
        }}
      >
        {companies.map((company) => {
          const companySponsorships = getCompanySponsorships(company.id);
          const totalCompanyValue = getCompanyTotalValue(company.id);

          return (
            <div
              key={company.id}
              className="bg-slate-50 border border-slate-200 rounded-xl p-4"
            >
              {/* TOP: name + delete button */}
              <div className="flex items-center justify-between mb-3 gap-2">
                <h3 className="text-lg font-bold">{company.name}</h3>

                <button
                  type="button"
                  onClick={() => deleteCompany(company.id)}
                  className="text-xs sm:text-sm px-3 py-1 rounded-full border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                >
                  Delete Company
                </button>
              </div>

              {/* SUMMARY STRIP */}
              <div className="text-xs sm:text-sm text-slate-700 mb-3 flex flex-wrap gap-x-4 gap-y-1">
                <span>
                  <strong>Total Sponsorship Value:</strong>{" "}
                  ${totalCompanyValue.toFixed(2)}
                </span>
                <span>
                  <strong># of Sponsorships:</strong>{" "}
                  {companySponsorships.length}
                </span>
              </div>

              {/* BOTTOM: LEFT details + RIGHT sponsorships */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "24px",
                  alignItems: "flex-start",
                }}
              >
                {/* LEFT: company details */}
                <div
                  className="company-details"
                  style={{ flex: "1 1 260px", marginBottom: 0 }}
                >
                  {/* STATUS DROPDOWN (editable) */}
                  <div className="detail-item flex items-center gap-2 mb-1">
                    <strong>Status:</strong>
                    <select
                      className="border rounded px-2 py-1 text-xs"
                      value={company.status || "Potential"}
                      onChange={(e) =>
                        updateCompany(company.id, {
                          ...company,
                          status: e.target.value,
                        })
                      }
                    >
                      <option value="Potential">Potential</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Declined">Declined</option>
                    </select>
                  </div>

                  <div className="detail-item mb-1">
                    <strong>Contact:</strong>{" "}
                    {company.contact && company.contact.trim()
                      ? company.contact
                      : "N/A"}
                  </div>

                  <div className="detail-item" style={{ minWidth: "260px" }}>
                    <strong>Notes:</strong>{" "}
                    {company.notes && company.notes.trim()
                      ? company.notes
                      : "—"}
                  </div>
                </div>

                {/* RIGHT: sponsorship table */}
                <div
                  style={{
                    flex: "1 1 320px",
                    minWidth: "280px",
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-sm">
                      Sponsorships for {company.name}
                    </h4>
                  </div>

                  {companySponsorships.length === 0 ? (
                    <p className="text-xs sm:text-sm text-slate-500">
                      No sponsorships recorded yet.
                    </p>
                  ) : (
                    <div style={{ overflowX: "auto" }}>
                      <table
                        style={{
                          width: "100%",
                          borderCollapse: "collapse",
                          fontSize: "0.85rem",
                        }}
                      >
                        <thead>
                          <tr>
                            <th
                              style={{
                                textAlign: "left",
                                paddingBottom: "4px",
                              }}
                            >
                              Type
                            </th>
                            <th
                              style={{
                                textAlign: "right",
                                paddingBottom: "4px",
                              }}
                            >
                              Value
                            </th>
                            <th
                              style={{
                                textAlign: "left",
                                paddingBottom: "4px",
                              }}
                            >
                              Notes
                            </th>
                            <th
                              style={{
                                textAlign: "right",
                                paddingBottom: "4px",
                              }}
                            >
                              {/* actions */}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {companySponsorships.map((s) => (
                            <tr key={s.id}>
                              <td
                                style={{
                                  paddingTop: "4px",
                                  paddingRight: "8px",
                                  verticalAlign: "top",
                                }}
                              >
                                <strong>{s.type || "Donation"}</strong>
                              </td>
                              <td
                                style={{
                                  paddingTop: "4px",
                                  paddingRight: "8px",
                                  textAlign: "right",
                                  verticalAlign: "top",
                                }}
                              >
                                ${Number(s.value || 0).toFixed(2)}
                              </td>
                              <td
                                style={{
                                  paddingTop: "4px",
                                  paddingRight: "8px",
                                  verticalAlign: "top",
                                }}
                              >
                                {s.notes && s.notes.trim() ? s.notes : "—"}
                              </td>
                              <td
                                style={{
                                  paddingTop: "4px",
                                  verticalAlign: "top",
                                  textAlign: "right",
                                }}
                              >
                                <button
                                  type="button"
                                  onClick={() => deleteSponsorship(s.id)}
                                  className="text-[0.7rem] px-2 py-1 rounded-full border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* END GRID WRAPPER */}
    </section>
  );
}
