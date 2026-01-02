require("dotenv").config();

const express = require("express");
const cors = require("cors");

const pool = require("./db");

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
      `SELECT
         id,
         companyid AS "companyId",
         type,
         value,
         item,
         notes,
         createdat AS "createdAt"
       FROM sponsorships
       ORDER BY id DESC`
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
// CANVA OAUTH + ASSETS (simple import flow)
// ----------------------
const { readStore, writeStore } = require('./canvaStore');

// Redirects user to Canva OAuth authorization URL
app.get('/auth/canva', (req, res) => {
  const clientId = process.env.CANVA_CLIENT_ID;
  const redirectUri = process.env.CANVA_REDIRECT_URI || `${process.env.SERVER_ROOT || `http://localhost:${PORT}`}/auth/canva/callback`;
  const scope = process.env.CANVA_SCOPES || 'assets:read';

  if (!clientId) {
    return res.status(500).send('CANVA_CLIENT_ID not configured on server. Set CANVA_CLIENT_ID in your environment.');
  }

  const authUrl = `${process.env.CANVA_AUTH_URL || 'https://www.canva.com/oauth2/authorize'}?response_type=code&client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;

  res.redirect(authUrl);
});

// Callback: exchange code for tokens and save them
app.get('/auth/canva/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send('Missing code in callback');

  const clientId = process.env.CANVA_CLIENT_ID;
  const clientSecret = process.env.CANVA_CLIENT_SECRET;
  const tokenUrl = process.env.CANVA_TOKEN_URL || 'https://api.canva.com/v1/oauth/token';
  const redirectUri = process.env.CANVA_REDIRECT_URI || `${process.env.SERVER_ROOT || `http://localhost:${PORT}`}/auth/canva/callback`;

  if (!clientId || !clientSecret) {
    return res.status(500).send('CANVA_CLIENT_ID or CANVA_CLIENT_SECRET not configured on server.');
  }

  try {
    // Exchange code for tokens (standard OAuth2)
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', redirectUri);
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);

    const tokenRes = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    if (!tokenRes.ok) {
      const text = await tokenRes.text();
      console.error('Token exchange failed', tokenRes.status, text);
      return res.status(500).send('Token exchange failed. Check server logs.');
    }

    const tokenData = await tokenRes.json();

    // Save tokens to simple file store (for prototype). In production, store in DB and secure it.
    writeStore({ tokenData, savedAt: new Date().toISOString() });

    // Redirect back to the front-end Decorations page
    const frontRedirect = process.env.FRONTEND_ROOT || 'http://localhost:5173';
    res.redirect(`${frontRedirect}/decorations?canva=connected`);
  } catch (err) {
    console.error('Error exchanging code for token', err);
    res.status(500).send('OAuth callback error');
  }
});

// Proxy to fetch assets from Canva using stored token
app.get('/api/canva/assets', async (req, res) => {
  const store = readStore();
  if (!store || !store.tokenData || !store.tokenData.access_token) {
    return res.status(401).json({ error: 'Canva not connected. Visit /auth/canva to connect.' });
  }

  const assetsUrl = process.env.CANVA_ASSETS_URL || 'https://api.canva.com/v1/assets';

  try {
    const assetsRes = await fetch(assetsUrl, {
      headers: { Authorization: `Bearer ${store.tokenData.access_token}` },
    });

    if (!assetsRes.ok) {
      // If API fails (e.g., wrong URL), return helpful error
      const text = await assetsRes.text();
      console.error('Canva assets fetch failed', assetsRes.status, text);
      return res.status(502).json({ error: 'Failed to fetch Canva assets. Check CANVA_ASSETS_URL and tokens on server.' });
    }

    const assets = await assetsRes.json();
    res.json(assets);
  } catch (err) {
    console.error('Error fetching assets', err);
    res.status(500).json({ error: 'Error fetching assets from Canva' });
  }
});

// ----------------------
// START SERVER
// ----------------------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

