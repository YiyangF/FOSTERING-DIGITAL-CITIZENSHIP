// Load environment variables
require('dotenv').config();

const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

// Create express app
const app = express();
app.use(cors());

// Connect to your PostgreSQL database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // uses .env file
  ssl: {
    rejectUnauthorized: false // required for Neon DB
  }
});

// Cyberbullying data endpoint
app.get('/api/cyberbullying', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM vic_cyberbullying_percent ORDER BY year');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching cyberbullying data:', err);
    res.status(500).send('Error fetching cyberbullying data');
  }
});

// Mental health data endpoint
app.get('/api/mental-health', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM vic_mental_health ORDER BY year');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching mental health data:', err);
    res.status(500).send('Error fetching mental health data');
  }
});

<<<<<<< HEAD
=======
// Emoji meanings endpoint
app.get('/api/emoji-meanings', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM emoji_meanings ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching emoji meanings:', err);
    res.status(500).send('Error fetching emoji meanings');
  }
});

>>>>>>> origin/main
// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
