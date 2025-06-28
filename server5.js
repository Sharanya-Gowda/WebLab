// server.js
const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');
const app = express();
const uri = 'mongodb://127.0.0.1:27017';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let collection;

// Connect ONCE on startup
MongoClient.connect(uri)
  .then(client => {
    collection = client.db('mydb').collection('records');
    console.log('✅ Connected to MongoDB');
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'records.html'));
});

// Insert and return all records as JSON
app.get('/insert', async (req, res) => {
  const { name, usn, dept, grade } = req.query;
  await collection.insertOne({ name, usn, dept, grade });
  const allRecords = await collection.find().toArray();
  res.json(allRecords);
});

// Update and return all records as JSON
app.post('/update', async (req, res) => {
  const { name, grade } = req.body;
  await collection.updateOne({ name }, { $set: { grade } });
  const allRecords = await collection.find().toArray();
  res.json(allRecords);
});

// Show all records as JSON
app.get('/all', async (req, res) => {
  const allRecords = await collection.find().toArray();
  res.json(allRecords);
});

app.listen(3000, () => {
  console.log('🚀 Server running on http://localhost:3000');
});
