import express from 'express';
import { createConnection } from 'mysql2';
import { json } from 'body-parser';

const app = express();
const port = 3000; // You can use any port you prefer

// MySQL connection configuration
const connection = createConnection({
  host: 'your-mysql-host',
  user: 'your-mysql-user',
  password: 'your-mysql-password',
  database: 'your-mysql-database',
});

// Middleware for parsing JSON data
app.use(json());

// API endpoint for validating username and password
app.post('/api/validate', (req, res) => {
  const { username, password } = req.body;
  
  // Query to fetch customer by name and password
  const query = 'SELECT * FROM consultantCustomers WHERE name = ? AND password = ?';
  
  // Execute the query
  connection.query(query, [username, password], (err, results) => {
    if (err) {
      console.error('Error executing query: ', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    
    if (results.length === 1) {
      // Username and password are valid
      return res.json({ isValid: true, customer: results[0] });
    } else {
      // Invalid username or password
      return res.json({ isValid: false });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
