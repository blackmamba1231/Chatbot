const express = require("express");
const session = require('express-session');
const cors = require("cors");
require('dotenv').config();
const rootRouter = require("./routes/index");

const app = express();

// Middleware setup
app.use(express.json());
app.use(cors({
    origin: ["https://chatbot-sigma-roan.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"], // Include all HTTP methods you'll use
    credentials: true, // If you need to send cookies or authorization headers
}));

app.use(session({
    secret: process.env.SECRET, // Replace with a strong secret key from .env
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 } // 1 hour session duration
}));

// Routes
app.use("/api/v1", rootRouter);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Memory usage logging
setInterval(() => {
    const memoryUsage = process.memoryUsage();
    console.log(`Memory Usage: RSS: ${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB, Heap Total: ${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB, Heap Used: ${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`);
}, 10000); // Logs memory usage every 10 seconds

module.exports = app;
