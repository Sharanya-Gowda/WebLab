const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');
const app = express();
const uri = 'mongodb://127.0.0.1:27017';

app.use(express.urlencoded({ extended: true }));

let collection;

// Connect once
(async () => {
  const client = await MongoClient.connect(uri);
  collection = client.db('mydb').collection('hospitals');
  console.log('✅ Connected to MongoDB');
  app.listen(3000, () => console.log('🚀 Server running on http://localhost:3000'));
})();

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'hospital.html'));
});

// Insert hospital
app.post('/add', async (req, res) => {
  const { Hospital_ID, Name, Location, Total_Beds, Occupied_Beds } = req.body;
  await collection.insertOne({
    Hospital_ID,
    Name,
    Location,
    Total_Beds: parseInt(Total_Beds),
    Occupied_Beds: parseInt(Occupied_Beds)
  });
  res.json({ message: 'Hospital added' });
});

// Admit patient (increment occupied beds)
app.post('/admit', async (req, res) => {
  const { Hospital_ID } = req.body;
  await collection.updateOne(
    { Hospital_ID },
    { $inc: { Occupied_Beds: 1 } }
  );
  res.json({ message: 'Patient admitted' });
});

// Show hospitals with available beds < 10
app.get('/critical', async (req, res) => {
  const critical = await collection.find({
    $expr: { $lt: [{ $subtract: ["$Total_Beds", "$Occupied_Beds"] }, 10] }
  }).toArray();
  res.json(critical);
});
