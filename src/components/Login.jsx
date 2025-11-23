// src/components/Login.jsx
import React, { useState } from "react";

export default function Login({ onSuccess }) {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");

  // Simple hard-coded passcode – change this to whatever you want
  const APP_PASSCODE = "derby2025";

  const handleSubmit = (e) => {
    e.preventDefault();

    if (passcode.trim() === APP_PASSCODE) {
      setError("");
      setPasscode("");
      // remember in localStorage
      localStorage.setItem("derby-authed", "true");
      onSuccess();
    } else {
      setError("Incorrect passcode. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-md rounded-xl p-6 sm:p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-slate-800 mb-4 text-center">
          Derby Night Admin
        </h1>
        <p className="text-sm text-slate-600 mb-4 text-center">
          Enter the passcode to manage sponsors.
        </p>

        {error && (
          <div className="mb-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Passcode
            </label>
            <input
              type="password"
              className="w-full border rounded px-3 py-2 text-sm"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              autoFocus
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-700 text-white py-2 px-4 rounded text-sm font-semibold hover:bg-emerald-800"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}
