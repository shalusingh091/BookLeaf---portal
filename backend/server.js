const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors())
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth')); // Tera login wala
app.use('/api/ai', require('./routes/ai'));
app.use('/api/portal', require('./routes/portal'));

// MongoDB Connect
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));