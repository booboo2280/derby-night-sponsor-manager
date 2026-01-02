const fs = require('fs');
const path = require('path');

const STORE_PATH = path.join(__dirname, 'canva_tokens.json');

function readStore() {
  try {
    if (!fs.existsSync(STORE_PATH)) return null;
    const raw = fs.readFileSync(STORE_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading canva store', err);
    return null;
  }
}

function writeStore(data) {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2));
    return true;
  } catch (err) {
    console.error('Error writing canva store', err);
    return false;
  }
}

module.exports = { readStore, writeStore };
