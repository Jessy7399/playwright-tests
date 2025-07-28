const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8080;

// CORS setup
app.use(cors({
  origin: 'http://localhost:3000', // React dev server origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
}));

// Parse JSON bodies
app.use(express.json());

// Logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// In-memory users list
const users = [
  { username: 'mary', password: 'ma@07031999', email: 'mary@example.com' },
  { username: 'testuser', password: 'password123', email: 'testuser@example.com' },
  { username: 'testuser1', password: 'password1234', email: 'testuser1@example.com' },
];

// In-memory items list for waste collection
let items = [
  { id: 1, location: 'Berlin', weight: 12, type: 'Plastic', collected: 'Yes' },
  { id: 2, location: 'Munich', weight: 25, type: 'Organic', collected: 'No' },
  { id: 3, location: 'Hamburg', weight: 18, type: 'Metal', collected: 'Yes' },
  { id: 4, location: 'Cologne', weight: 10, type: 'Paper', collected: 'No' },
  { id: 5, location: 'Frankfurt', weight: 20, type: 'Glass', collected: 'Yes' },
  { id: 6, location: 'Stuttgart', weight: 30, type: 'Plastic', collected: 'Yes' },
  { id: 7, location: 'Leipzig', weight: 8, type: 'Organic', collected: 'No' },
  { id: 8, location: 'Dresden', weight: 14, type: 'Metal', collected: 'Yes' },
  { id: 9, location: 'Bonn', weight: 16, type: 'Paper', collected: 'No' },
  { id: 10, location: 'Nuremberg', weight: 22, type: 'Glass', collected: 'Yes' },
];

// Helper function to find user by username or email
function findUser(username, email) {
  return users.find(
    (user) => user.username === username || user.email === email
  );
}

// Register endpoint
app.post('/register', (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ message: 'Missing username, password, or email' });
  }

  if (findUser(username, email)) {
    return res.status(409).json({ message: 'Username or email already exists' });
  }

  users.push({ username, password, email });
  res.status(201).json({ message: 'User registered successfully!' });
});

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Missing username or password' });
  }

  const user = users.find(u => u.username === username);

  if (!user) {
    return res.status(401).json({ message: 'User not found' });
  }

  if (user.password !== password) {
    return res.status(401).json({ message: 'Invalid password' });
  }

  res.json({ message: 'Login successful' });
});

// Logout endpoint
app.post('/logout', (req, res) => {
  // No session management here, so just send success message
  res.json({ message: 'Logout successful' });
});

// GET /items - list all items
app.get('/items', (req, res) => {
  res.json(items);
});

// POST /items - create new item
app.post('/items', (req, res) => {
  const newItem = req.body;

  if (
    !newItem.location ||
    !newItem.weight ||
    !newItem.type ||
    !newItem.collected
  ) {
    return res.status(400).json({ message: 'Missing fields in item data' });
  }

  newItem.id = items.length ? Math.max(...items.map(i => i.id)) + 1 : 1;
  items.push(newItem);
  res.status(201).json(newItem);
});

// PUT /items/:id - update an existing item
app.put('/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = items.findIndex(i => i.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Item not found' });
  }

  const updatedItem = { ...items[index], ...req.body, id };
  items[index] = updatedItem;
  res.json(updatedItem);
});

// DELETE /items/:id - delete an item
app.delete('/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = items.findIndex(i => i.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Item not found' });
  }

  items.splice(index, 1);
  res.status(204).send();
});

// Test GET endpoint
app.get('/test', (req, res) => {
  res.send('Backend is up and running!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
