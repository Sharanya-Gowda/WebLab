// server.js
const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');
const app = express();

const uri = 'mongodb://127.0.0.1:27017';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let collection;

// Connect ONCE at startup
(async () => {
  const client = await MongoClient.connect(uri);
  collection = client.db('mydb').collection('complaints');
  console.log('✅ Connected to MongoDB');
  app.listen(3000, () => console.log('🚀 Server running on http://localhost:3000'));
})();

// Serve HTML form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'complaint.html'));
});

// Insert complaint (status always pending)
app.post('/insert', async (req, res) => {
  const { user_name, issue } = req.body;
  const result = await collection.insertOne({ user_name, issue, status: 'pending' });
  res.json({ message: 'Inserted', id: result.insertedId });
});

// Update status of all complaints by user_name
app.post('/update', async (req, res) => {
  const { user_name, status } = req.body;
  const result = await collection.updateMany(
    { user_name },
    { $set: { status } }
  );

  if (result.modifiedCount === 0) {
    return res.json({ message: 'No matching records found' });
  }

  const updated = await collection.find({ user_name }).toArray();
  res.json(updated);
});

// Show all pending complaints
app.get('/pending', async (req, res) => {
  const pending = await collection.find({ status: 'pending' }).toArray();
  res.json(pending);
});
