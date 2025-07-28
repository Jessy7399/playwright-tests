const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8080;

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
}));

app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

const users = [
  { username: 'mary', password: 'ma@07031999', email: 'mary@example.com' },
  { username: 'testuser', password: 'password123', email: 'testuser@example.com' },
  { username: 'testuser1', password: 'password1234', email: 'testuser1@example.com' },
];

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

function findUser(username, email) {
  return users.find(
    (user) => user.username === username || user.email === email
  );
}

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


app.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

app.get('/items', (req, res) => {
  res.json(items);
});

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

app.delete('/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = items.findIndex(i => i.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Item not found' });
  }

  items.splice(index, 1);
  res.status(204).send();
});

app.get('/test', (req, res) => {
  res.send('Backend is up and running!');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
