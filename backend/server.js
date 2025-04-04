require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.get('/api/uv-index', async (req, res) => {
  const cityName = req.query.city;

  if (!cityName) {
    return res.status(400).json({ error: 'City name is required' });
  }

  try {
    const query = 'SELECT latitude, longitude FROM vic_suburbs WHERE suburb ILIKE $1 LIMIT 1';
    const { rows } = await pool.query(query, [cityName]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'City not found in database' });
    }

    const { latitude, longitude } = rows[0];

    const uvResponse = await axios.get('https://api.openuv.io/api/v1/uv', {
      params: { lat: latitude, lng: longitude },
      headers: { 'x-access-token': process.env.OPENUV_API_KEY }
    });

    res.json({
      city: cityName,
      latitude,
      longitude,
      uv: uvResponse.data.result.uv
    });

  } catch (error) {
    console.error('Error fetching UV index:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT,"0.0.0.0", () => console.log(`🚀 Server running on port ${PORT}`));
