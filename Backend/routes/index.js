const express = require('express');
const userRouter = require("./user");
const ticketRouter = require("./ticket.js");
const chatRouter = require("./chat.js");
require('dotenv').config();


const router = express.Router();

router.use("/user", userRouter);
router.use("/ticket", ticketRouter);
router.use("/bot", chatRouter);

module.exports = router;
