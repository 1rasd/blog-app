import fs from 'fs';
import path from 'path';

const dataFile = path.join(process.cwd(), 'data', 'posts.json');

export default function handler(req, res) {
  if (req.method === 'GET') {
    // Palauta kaikki postaukset
    if (!fs.existsSync(dataFile)) {
      return res.status(200).json([]);
    }
    const posts = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    return res.status(200).json(posts);
  }

  if (req.method === 'POST') {
    const { title, content } = req.body;
    const date = new Date().toLocaleString('fi-FI');

    let posts = [];
    if (fs.existsSync(dataFile)) {
      posts = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    }

    const newPost = { id: Date.now(), title, content, date };
    posts.unshift(newPost);
    fs.writeFileSync(dataFile, JSON.stringify(posts, null, 2));

    return res.status(200).json({ message: 'Postaus tallennettu onnistuneesti!' });
  }

  res.status(405).json({ message: 'Method not allowed' });
}
