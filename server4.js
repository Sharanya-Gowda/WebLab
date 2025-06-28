// server.js
const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const uri = 'mongodb://127.0.0.1:27017';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let interns;

// Connect once
MongoClient.connect(uri).then(client => {
  interns = client.db('mydb').collection('intern');
  console.log('✅ MongoDB connected');
}).catch(err => {
  console.error('❌ Connection failed:', err);
  process.exit(1);
});

// Serve HTML form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'intern.html'));
});

// Insert or reset status to pending
app.get('/insert', async (req, res) => {
  const { Sid, name, company, duration } = req.query;
  await interns.updateOne(
    { Sid },
    { $set: { name, company, duration, status: 'pending' } },
    { upsert: true }
  );
  res.json({ message: 'Intern inserted or updated.' });
});

// Update status
app.post('/update', async (req, res) => {
  const { Sid, status } = req.body;
  await interns.updateOne({ Sid }, { $set: { status } });
  res.json({ Sid, status, message: 'Status updated.' });
});

// List Infosys interns
app.get('/infosys', async (req, res) => {
  const list = await interns.find({ company: 'infosys' }).toArray();
  res.json(list);
});

app.listen(3000, () => console.log('🚀 Server running on http://localhost:3000'));
