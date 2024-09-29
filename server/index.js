const express = require("express");
const session = require('express-session');
const cors = require("cors");
require('dotenv').config();
const rootRouter = require("./routes/index");
const cluster = require('cluster');
const os = require('os');
const CPU = os.cpus().length;
if(cluster.isPrimary){
    for(let i = 0;i< 1;i++){
        cluster.fork();
    }
}else{const app = express();
    app.use(express.json());
   app.use(cors());
    app.use(session({
       secret: process.env.secret, // Replace with a strong secret key
       resave: false,
       saveUninitialized: true,
       cookie: { maxAge: 1000 * 60 * 60 } // 1 hour session duration
   }));
   
    app.use("/api/v1",rootRouter);
   
   
    app.listen(process.env.PORT,()=> {
        console.log("server is running on port 3000")
    });
    setInterval(() => {
        const memoryUsage = process.memoryUsage();
        console.log(`Memory Usage: RSS: ${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB, Heap Total: ${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB, Heap Used: ${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`);
      }, 10000); // Logs memory usage every 10 seconds
      module.exports = app;
}
 // If you are exporting an Express app



 
 
