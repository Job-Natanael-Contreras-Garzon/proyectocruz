const express = require('express');
const app = express();
const { Client } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 

// Database connection configuration
const db_config = {
  host: "localhost",
  database: "AUTOREPUESTOSCRUZ",
  user: "postgres",
  password: "071104",
  port: 5432,
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

app.use(express.json());

// Route for handling login requests
app.post('/api/login', async function (req, res) {
  const { username, password } = req.body;

  const query = 'SELECT * FROM usuario WHERE username = $1';
  try {
    const result = await client.query(query, [username]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado.' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Contraseña incorrecta.' });
    }

    const token = generateAuthToken(user.username);
    res.json({ token });
  } catch (err) {
    console.error("Error during login:", err.stack);
    res.status(500).send({ error: err.message });
  }
});

// Function to generate an authentication token
function generateAuthToken(username) {
  return jwt.sign({ username }, process.env.JWT_SECRET);
}

// Start the server
app.listen(3000, () => {
  console.log("Server listening on port 3000!");
});
