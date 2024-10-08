const express = require('express');
require('dotenv').config();
const router = express.Router();
const paypal = require('@paypal/checkout-server-sdk');
const { client } = require('../paypalClient');
const { Account, Ticket, User}= require('../db');
const { authmiddleware } = require('../middleware');
const session = require('express-session');
const Razorpay = require('razorpay');
const speakeasy = require('speakeasy');
const nodemailer = require('nodemailer');
const crypto = require('crypto');


// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL, // Your email here
        pass: process.env.EMAIL_PASSWORD // Your email password here
    }
});
require('dotenv').config();
const razorpayInstance = new Razorpay({
    key_id: process.env.key_id,
    key_secret: process.env.key_secret
});

function calculatePrice(basePrice, eventType,quantity) {
    const ticketpricing = {
        'Child': 0.8,
        'child': 0.8
    }
    const eventPricing = {
        'regular': 1,
        'special': 1.5, // 50% increase for special events
        'discounted': 0.8 // 20% discount for discounted events
    };
    
    return quantity * basePrice * (eventPricing[eventType] || 1) * (ticketpricing[eventType] || 1); // Default to regular pricing
}

router.post("/create-pending", authmiddleware, async (req, res) => {
    try {
        const { visitorName, visitDate, ticketType, quantity, eventType } = req.body;
        const accountId = req.userId;
    
        if (!visitorName || !visitDate || !ticketType || !quantity || !accountId || !eventType) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const account = await User.findById(accountId);
        if (!account) {
            return res.status(404).json({ error: 'Account not found' });
        }

        const basePrice = 100; // Example base price
        const finalPrice = calculatePrice(basePrice, eventType, quantity, ticketType); // Apply event-based pricing
        req.session.pendingTicket = {
            visitorName,
            visitDate,
            ticketType,
            quantity,
            eventType,
            finalPrice,
        };
        const newTicket = new Ticket({
            visitorName,
            visitDate,
            ticketType,
            quantity,
            account: accountId,
            eventType,
            status: 'pending' 
        });

        // Optionally, store or use the finalPrice
        // newTicket.price = finalPrice; // Uncomment if you want to store the price in your model

        await newTicket.save();
        res.status(201).json({ ticket: newTicket, price: finalPrice });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/razorpay/create-order', async (req, res) => {
    const { amount } = req.body;

    const options = {
        amount: amount * 100, // Amount in smallest currency unit (paise for INR)
        currency: 'INR', // Change currency if needed
        receipt: `receipt_${Date.now()}`,
        payment_capture: 1 // Auto-capture payment
    };

    try {
        const order = await razorpayInstance.orders.create(options);
        console.log("order created "+ order.id + " amount " + order.amount + " currency " + order.currency );
        res.json({ id: order.id, amount: order.amount, currency: order.currency });
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).send('Error creating Razorpay order');
    }
});



// Add a webhook route in your backend

router.get('/status/:orderId', async (req, res) => {
    const { orderId } = req.params;
    console.log("Fetching status for ticketid"+ orderId )
    try {
        const ticket = await Ticket.findById( orderId );

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        
        return res.status(200).json({
            status: ticket.status, 
            price: ticket.price
        });
    } catch (error) {
        console.error('Error fetching ticket status:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/confirm', authmiddleware, async (req, res) => {
    const { ticketId } = req.body;
    const username = req.body.username;
    console.log("ticket id " + ticketId);
    if (!ticketId) {
        return res.status(400).json({ error: 'Ticket ID is required' });
    }

    try {
        const ticketDetails = await Ticket.findById(ticketId);
        const startDate = new Date(ticketDetails.visitDate).toISOString().replace(/-|:|\.\d\d\d/g, "");
        const endDate = new Date(new Date(ticketDetails.visitDate).setHours(new Date(ticketDetails.visitDate).getHours() + 2)).toISOString().replace(/-|:|\.\d\d\d/g, "");
        const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=Visit%20to%20${encodeURIComponent(ticketDetails.eventType)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(`Visit Date: ${ticketDetails.visitDate}, Ticket Type: ${ticketDetails.ticketType}, Quantity: ${ticketDetails.quantity}`)}&location=Your%20Event%20Location`;

        
       
        const updatedTicket = await Ticket.updateOne(
            {_id: ticketId},
            { status: 'confirmed' }
        );
        const mailOptions = {
            from: process.env.EMAIL,
            to: username,
            subject: 'Your ticket has been Succesfully booked with Ticket id '+ ticketId,
            html: `
            <p>Ticket Details are:</p>
            <ul>
                <li>Visitor Name: ${ticketDetails.visitorName}</li>
                <li>Visit Date: ${ticketDetails.visitDate}</li>
                <li>Ticket Type: ${ticketDetails.ticketType}</li>
                <li>Quantity: ${ticketDetails.quantity}</li>
                <li>Event Type: ${ticketDetails.eventType}</li>
            </ul>
            <p>You can add this visit to your Google Calendar by clicking the button below:</p>
            <a href="${calendarUrl}" style="text-decoration: none;">
                <button style="padding: 10px 20px; background-color: #4285F4; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Add to Google Calendar
                </button>
            </a>
        `
        };
    
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending OTP:", error);
                return res.status(500).json({ message: "Error sending OTP" });
            } else {
                return res.json({
                    success: true,
                    message: "OTP sent to your email. Please verify to complete signup."
                });
            }
        });
        
        if (!updatedTicket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }

        res.status(200).json({ message: 'Ticket confirmed successfully', ticket: updatedTicket });
        req.session.pendingTicket = null;
    } catch (error) {
        console.error('Error confirming ticket:', error);
        res.status(500).json({ error: 'Error confirming ticket' });
    }
});

router.get('/my-tickets', authmiddleware, async (req, res) => {
    try {
        const accountId = req.userId; 

        const account = await Account.findOne({ userId: accountId });
        if (!account) {
            return res.status(404).json({ error: 'Account not found' });
        }

        const tickets = await Ticket.find({ account: accountId });
        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/my-tickets/:id',  async (req, res) => {
    try {
        const { id } = req.params;
        

        const ticket = await Ticket.findOne({ _id: id})
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }

        res.status(200).json(ticket);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/my-tickets/:id', authmiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const accountId = req.userId; // Use the userId from the middleware

        const account = await Account.findOne({ userId: accountId });
        if (!account) {
            return res.status(404).json({ error: 'Account not found' });
        }

        const deletedTicket = await Ticket.findOneAndDelete({ _id: id, account: account._id });
        if (!deletedTicket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }

        res.status(200).json({ message: 'Ticket deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;