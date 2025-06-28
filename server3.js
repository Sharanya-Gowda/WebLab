const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');
const app = express();

const uri = 'mongodb://127.0.0.1:27017';
let employees;

(async () => {
  const client = await MongoClient.connect(uri);
  employees = client.db('HR').collection('employees');
  console.log('✅ Connected to MongoDB');
})();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'employee.html'));
});

// Insert a new employee
app.get('/add-employee', async (req, res) => {
  const { emp_name, email, phone, hire_date, job_title, salary } = req.query;
  await employees.insertOne({
    emp_name,
    email,
    phone,
    hire_date,
    job_title,
    salary: parseFloat(salary)
  });
  res.json({ message: 'Employee added successfully' });
});

// Return employees with salary > 50000
app.get('/high-earners', async (req, res) => {
  const highEarners = await employees.find({ salary: { $gt: 50000 } }).toArray();
  res.json(highEarners);
});

app.listen(3000, () => console.log('🚀 Server running on port 3000'));
