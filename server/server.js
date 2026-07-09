const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDB } = require('./config/db');

// Initialize Express App
const app = express();

// Initialize Mongoose models first so they are registered in MongoDB
require('./models/User');
require('./models/Complaint');

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ extended: false }));

// Basic landing endpoint
app.get('/', (req, res) => {
  res.send('Online Complaint Registration (OCR) API Running...');
});

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/complaints', require('./routes/complaints'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
