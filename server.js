import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

// Supabase-yhteys
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// 🔹 Hae kaikki postaukset
app.get('/api/posts', async (req, res) => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('id', { ascending: false });

  if (error) {
    console.error('Virhe hakiessa postauksia:', error);
    return res.status(500).json({ message: 'Virhe hakiessa postauksia.' });
  }

  res.json(data);
});

// 🔹 Lisää uusi postaus
app.post('/api/posts', async (req, res) => {
  const { title, content } = req.body;
  const date = new Date().toLocaleString('fi-FI');

  const { error } = await supabase
    .from('posts')
    .insert([{ title, content, date }]);

  if (error) {
    console.error('Virhe tallennuksessa:', error);
    return res.status(500).json({ message: 'Virhe tallennuksessa.' });
  }

  res.json({ message: 'Postaus tallennettu onnistuneesti!' });
});

// 🔹 Hae yksittäinen postaus id:n perusteella
app.get('/api/posts/:id', async (req, res) => {
  const id = req.params.id;

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return res.status(404).json({ message: 'Postausta ei löytynyt.' });
  }

  res.json(data);
});

// 🔹 Käynnistä serveri
app.listen(PORT, () => console.log(`Serveri käynnissä: http://localhost:${PORT}`));
