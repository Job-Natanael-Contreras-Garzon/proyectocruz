const express = require('express');
const app = express();
const { Client } = require('pg');

// Database connection configuration (replace with your actual details)
const db_config = {
  host: "localhost",
  database: "REPUESTOSCRUZ",
  user: "postgres",
  password: "contreras123",
  port:5432,
};

// Connect to the database
const client = new Client(db_config);

client.connect(err => {
  if (err) {
    console.error("Error connecting to PostgreSQL:", err.stack);
  } else {
    console.log("Connected to PostgreSQL database successfully!");
  }
});

// Define API Routes using Express
app.get('/api/products', async function (_req, res) {
  try {
    const query = 'SELECT * FROM PRODUCTOS';
    const result = await client.query(query);

    const products = result.rows;
    res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err.stack);
    res.status(500).send({ error: err.message });
  }
});

// Start the server
app.listen(3000, () => {
  console.log("Server listening on port 3000!");
});