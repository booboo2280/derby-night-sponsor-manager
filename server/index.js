
require(".env").config();

const express = require("express");
const cors = require("cors");

const pool = require("./db"); // <- uses db.js we just created

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ----------------------
// COMPANIES ENDPOINTS
// ----------------------

// GET all companies
app.get("/api/companies", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM companies ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching companies:", err);
    res.status(500).json({ error: "Failed to fetch companies" });
  }
});

// CREATE company
app.post("/api/companies", async (req, res) => {
  try {
    const { name, contact, status, notes } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Name is required" });
    }

    const result = await pool.query(
      `INSERT INTO companies (name, contact, status, notes)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name.trim(), contact || null, status || "Potential", notes || null]
    );

    const saved = result.rows[0];
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error creating company:", err);
    res.status(500).json({ error: "Failed to create company" });
  }
});

// UPDATE company
app.put("/api/companies/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, contact, status, notes } = req.body;

    const result = await pool.query(
      `UPDATE companies
       SET name = $1,
           contact = $2,
           status = $3,
           notes = $4
       WHERE id = $5
       RETURNING *`,
      [name, contact || null, status || "Potential", notes || null, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Company not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating company:", err);
    res.status(500).json({ error: "Failed to update company" });
  }
});

// DELETE company
// (sponsorships will auto-delete because of ON DELETE CASCADE)
app.delete("/api/companies/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const result = await pool.query(
      "DELETE FROM companies WHERE id = $1",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Company not found" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting company:", err);
    res.status(500).json({ error: "Failed to delete company" });
  }
});

// ----------------------
// SPONSORSHIPS ENDPOINTS
// ----------------------

// GET all sponsorships
app.get("/api/sponsorships", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM sponsorships ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching sponsorships:", err);
    res.status(500).json({ error: "Failed to fetch sponsorships" });
  }
});

// CREATE sponsorship
app.post("/api/sponsorships", async (req, res) => {
  try {
    const { companyId, value, type, item, notes } = req.body;

    if (!companyId) {
      return res
        .status(400)
        .json({ error: "companyId is required for sponsorship" });
    }

    const numericValue = value ? Number(value) : 0;

    const result = await pool.query(
      `INSERT INTO sponsorships (companyId, type, value, item, notes)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [companyId, type || null, numericValue, item || null, notes || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating sponsorship:", err);
    res.status(500).json({ error: "Failed to create sponsorship" });
  }
});

// DELETE sponsorship
app.delete("/api/sponsorships/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const result = await pool.query(
      "DELETE FROM sponsorships WHERE id = $1",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Sponsorship not found" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting sponsorship:", err);
    res.status(500).json({ error: "Failed to delete sponsorship" });
  }
});

// ----------------------
// START SERVER
// ----------------------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

