const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const dataFile = path.join(__dirname, 'data', 'posts.json');

// Lue kaikki postaukset
app.get('/api/posts', (req, res) => {
  if (!fs.existsSync(dataFile)) {
    return res.json([]);
  }
  const posts = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  res.json(posts);
});

// Tallenna uusi postaus
app.post('/api/posts', (req, res) => {
  const { title, content } = req.body;
  const date = new Date().toLocaleString('fi-FI');

  let posts = [];
  if (fs.existsSync(dataFile)) {
    posts = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  }

  const newPost = { id: Date.now(), title, content, date };
  posts.unshift(newPost); // Lisää alkuun (uusin ensin)
  fs.writeFileSync(dataFile, JSON.stringify(posts, null, 2));

  res.json({ message: 'Postaus tallennettu onnistuneesti!' });
});

// Lue yksittäinen postaus id:n perusteella
app.get('/api/posts/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!fs.existsSync(dataFile)) {
    return res.status(404).json({ message: 'Ei postauksia' });
  }
  const posts = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  const post = posts.find(p => p.id === id);
  if (!post) return res.status(404).json({ message: 'Postausta ei löytynyt' });
  res.json(post);
});

app.listen(PORT, () => console.log(`Serveri käynnissä: http://localhost:${PORT}`));
