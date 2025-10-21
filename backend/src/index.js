const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/database');

// Import models
require('./models/user.model');
require('./models/field.model');
require('./models/booking.model');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Soccer Field Management API' });
});

// Database sync and server start
const startServer = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database synced successfully');
    
    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer();