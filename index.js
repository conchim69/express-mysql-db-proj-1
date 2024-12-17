const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;
// Middleware
app.use(bodyParser.json());
// MySQL Connection
const db = mysql.createConnection({
  host: 'mydb.czskwgewcnib.us-east-1.rds.amazonaws.com',
  user: 'dbuser',
  password: 'dbpassword',
  database: 'devprojdb'
});
// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as ID ' + db.threadId);
});
// Routes
app.get('/api/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error('Error executing query: ' + err.stack);
      res.status(500).send('Error fetching users');
      return;
    }
    res.json(results);
  });
});
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Create a new user
app.post('/api/users', (req, res) => {
  const { username, email } = req.body;
  db.query('INSERT INTO users (username, email) VALUES (?, ?)', [username, email], (err, result) => {
    if (err) {
      console.error('Error executing query: ' + err.stack);
      res.status(400).send('Error creating user');
      return;
    }
    res.status(201).send('User created successfully');
  });
});

// Update an existing user
app.put('/api/users/:id', (req, res) => {
  const { username, email } = req.body;
  const userId = req.params.id;
  db.query('UPDATE users SET username = ?, email = ? WHERE id = ?', [username, email, userId], (err, result) => {
    if (err) {
      console.error('Error executing query: ' + err.stack);
      res.status(400).send('Error updating user');
      return;
    }
    res.send('User updated successfully');
  });
});

// Delete a user
app.delete('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  db.query('DELETE FROM users WHERE id = ?', [userId], (err, result) => {
    if (err) {
      console.error('Error executing query: ' + err.stack);
      res.status(400).send('Error deleting user');
      return;
    }
    res.send('User deleted successfully');
  });
});
