const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const uri = 'mongodb://127.0.0.1:27017';

let collection;

(async () => {
  const client = await MongoClient.connect(uri);
  collection = client.db('mydb').collection('exam_fee');
  console.log('✅ Connected to MongoDB');
})();

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'examfee.html'));
});

app.get('/submit', async (req, res) => {
  const { student_name, usn, semester, exam_fee } = req.query;
  const fee = parseInt(exam_fee);
  if (fee <= 0) {
    const del = await collection.deleteMany({ usn });
    res.json({ message: `Deleted ${del.deletedCount} record(s)` });
  } else {
    await collection.updateOne(
      { usn },
      { $set: { student_name, semester, exam_fee: fee } },
      { upsert: true }
    );
    res.json({ message: 'Inserted/Updated' });
  }
});

app.get('/all', async (req, res) => {
  const records = await collection.find().toArray();
  res.json(records);
});

app.listen(3000, () => console.log('🚀 Server running on http://localhost:3000'));
