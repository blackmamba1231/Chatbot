const express = require("express");
const session = require('express-session');
const cors = require("cors");
require('dotenv').config();
const rootRouter = require("./routes/index");
const cluster = require('cluster');
const os = require('os');
const CPU = os.cpus().length;

if (cluster.isPrimary) {
    // Fork workers
    for (let i = 0; i < CPU; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} exited. Forking a new one...`);
        cluster.fork();
    });
} else {
    // Worker processes
    const app = express();

    // Middleware setup
    app.use(express.json());
    app.use(cors({
        origin: ["https://chatbot-sigma-roan.vercel.app"], // Replace with your allowed origin
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
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
    const PORT = process.env.PORT || 3000 + cluster.worker.id; // Use different port for each worker
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT} (Worker ${cluster.worker.id})`);
    });

    // Memory usage logging
    setInterval(() => {
        const memoryUsage = process.memoryUsage();
        console.log(`Memory Usage (Worker ${cluster.worker.id}): RSS: ${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB, Heap Total: ${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB, Heap Used: ${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`);
    }, 10000); // Logs memory usage every 10 seconds

    module.exports = app; // Export only within the worker process
}
