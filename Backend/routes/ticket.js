const express = require('express');
const router = express.Router();
const paypal = require('@paypal/checkout-server-sdk');
const { client } = require('../paypalClient');
const { Account, Ticket}= require('../db');
const { authmiddleware } = require('../middleware');
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

        const account = await Account.findOne({ userId: accountId });
        if (!account) {
            return res.status(404).json({ error: 'Account not found' });
        }

        const basePrice = 100; // Example base price
        const finalPrice = calculatePrice(basePrice, eventType, quantity, ticketType); // Apply event-based pricing

        const newTicket = new Ticket({
            visitorName,
            visitDate,
            ticketType,
            quantity,
            account: accountId,
            eventType,
            status: 'pending' // Add a status field to indicate pending
        });

        // Optionally, store or use the finalPrice
        // newTicket.price = finalPrice; // Uncomment if you want to store the price in your model

        await newTicket.save();
        res.status(201).json({ ticket: newTicket, price: finalPrice });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.post('/paypal/create-order', async (req, res) => {
    const { amount } = req.body;

    const request = new paypal.orders.OrdersCreateRequest();
    request.preferredPaymentMethod = 'PAYPAL';
    request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [{
            amount: {
                currency_code: 'USD',
                value: amount
            }
        }]
    });

    try {
        const order = await client().execute(request);
        res.json({ id: order.result.id });
    } catch (error) {
        console.error('Error creating PayPal order:', error);
        res.status(500).send('Error creating PayPal order');
    }
});

router.post('/paypal/capture-order', async (req, res) => {
    const { orderId } = req.body;

    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    try {
        const capture = await client().execute(request);
        res.json(capture.result);
    } catch (error) {
        console.error('Error capturing PayPal order:', error);
        res.status(500).send('Error capturing PayPal order');
    }
});
// Add a webhook route in your backend
router.post('/paypal/webhook', (req, res) => {
    const { event_type, resource } = req.body;

    if (event_type === 'PAYMENT.CAPTURE.COMPLETED') {
        // Handle successful payment
        const { id, amount } = resource;
        
        // Update ticket status in your database
        Ticket.findOneAndUpdate({ _id: id }, { status: 'confirmed' }, (err, ticket) => {
            if (err || !ticket) {
                return res.status(404).send('Ticket not found');
            }
            res.send('Payment processed successfully');
        });
    } else if (event_type === 'PAYMENT.CAPTURE.DENIED') {
        // Handle payment failure
        const { id } = resource;

        Ticket.findOneAndUpdate({ _id: id }, { status: 'failed' }, (err, ticket) => {
            if (err || !ticket) {
                return res.status(404).send('Ticket not found');
            }
            res.send('Payment failed');
        });
    }
});
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

router.post('/confirm',authmiddleware, async (req, res) => {
    const { ticketId } = req.body;

    if (!ticketId) {
        return res.status(400).json({ error: 'Ticket ID is required' });
    }

    try {
        // Find and update the ticket status to 'confirmed'
        const updatedTicket = await Ticket.findByIdAndUpdate(
            ticketId,
            { status: 'confirmed' },
            { new: true } // Return the updated document
        );

        if (!updatedTicket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }

        res.status(200).json({ message: 'Ticket confirmed successfully', ticket: updatedTicket });
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