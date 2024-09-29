import React, { useState, useEffect } from 'react';
import axios from 'axios';


const TicketForm = () => {
    const [formData, setFormData] = useState({
        visitorName: '',
        visitDate: '',
        ticketType: '',
        quantity: '',
        eventType: ''
    });
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [price, setPrice] = useState(null);
    const [payPalOrderId, setPayPalOrderId] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // 1. Create a pending ticket entry
            const ticketResponse = await axios.post('https://chatbot-api-seven-murex.vercel.app/api/v1/ticket/create-pending', formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            setPrice(ticketResponse.data.price);
            setPayPalOrderId(ticketResponse.data._id); // Store the ticket ID for later use

            
            const payPalResponse = await axios.post('https://chatbot-api-seven-murex.vercel.app/api/v1/ticket/paypal/create-order', {
                amount: ticketResponse.data.price
            });

            window.location.href = `https://www.paypal.com/checkoutnow?token=${payPalResponse.data.id}`;

        } catch (error) {
            console.error('Error creating pending ticket or PayPal order:', error);
        }
    };

    const handlePayPalCapture = async (orderId) => {
        try {
          
            const captureResponse = await axios.post('https://chatbot-api-seven-murex.vercel.app/api/v1/ticket/paypal/capture-order', {
                orderId
            });

            
            await axios.post('https://chatbot-api-seven-murex.vercel.app/api/v1/ticket/confirm', {
                ticketId: payPalOrderId
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

           
            setBookingSuccess(true);
            setPayPalOrderId(null); 

        } catch (error) {
            console.error('Error capturing PayPal payment or confirming ticket:', error);
            setBookingSuccess(false);
        }
    };

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const token = queryParams.get('token');
        if (token) {
            handlePayPalCapture(token);
        }
    }, []);

    return (
        <div className="max-w-md mx-auto mt-12 p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-center text-2xl mb-6 font-semibold">Book Your Ticket</h2>
            {bookingSuccess ? (
                <div className="text-center text-green-500 font-bold">
                    <p>Ticket booked successfully! Total Price: ${price}</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="visitorName"
                        value={formData.visitorName}
                        onChange={handleChange}
                        placeholder="Visitor Name"
                        required
                        className="w-full p-2 mb-4 border rounded-md border-gray-300"
                    />
                    <input
                        type="date"
                        name="visitDate"
                        value={formData.visitDate}
                        onChange={handleChange}
                        required
                        className="w-full p-2 mb-4 border rounded-md border-gray-300"
                    />
                    <select
                        name="ticketType"
                        value={formData.ticketType}
                        onChange={handleChange}
                        required
                        className="w-full p-2 mb-4 border rounded-md border-gray-300"
                    >
                        <option value="">Select Ticket Type</option>
                        <option value="regular">Adult</option>
                        <option value="child">Child</option>
                        <option value="senior">Senior Citizen</option>
                    </select>
                    <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        placeholder="Quantity"
                        required
                        className="w-full p-2 mb-4 border rounded-md border-gray-300"
                    />
                    <select
                        name="eventType"
                        value={formData.eventType}
                        onChange={handleChange}
                        required
                        className="w-full p-2 mb-4 border rounded-md border-gray-300"
                    >
                        <option value="">Select Event Type</option>
                        <option value="regular">Regular</option>
                        <option value="special">Special</option>
                        <option value="discounted">Discounted</option>
                    </select>
                    <button
                        type="submit"
                        className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        Book Ticket
                    </button>
                </form>
            )}
        </div>
    );
};

export default TicketForm;
