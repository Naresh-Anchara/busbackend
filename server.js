const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const dbConfig = require('./config/dbConfig');
const usersRoute = require('./routes/usersRoute');
const busesRoute = require('./routes/busesRoute');
const bookingsRoute = require('./routes/bookingsRoute');
// Load environment variables
dotenv.config();

dbConfig();

const app = express();
const port =  5000;

// Middleware
//const cors = require('cors');
const allowedOrigins = ["http://localhost:3000"]; 

app.use(
  cors({
    origin: 'https://naresh-anchara.github.io',
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use('/api/users', usersRoute);
app.use('/api/buses', busesRoute);
app.use('/api/bookings', bookingsRoute);
// Server
app.listen(port, () => {
  console.log(`Node server listening on port ${port}!`);
});
