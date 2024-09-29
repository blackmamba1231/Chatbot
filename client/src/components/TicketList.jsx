import React, { useState, useEffect } from 'react';
import axios from 'axios';


const TicketList = () => {
    const [tickets, setTickets] = useState([]); // Change to array to handle multiple tickets
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await axios.get('https://chatbot-api-seven-murex.vercel.app/api/v1/ticket/my-tickets', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                console.log('Fetched data:', response.data); // Debugging line
                setTickets(response.data);
            } catch (err) {
                console.error('Error fetching tickets:', err); // More detailed error logging
                setError('Error loading tickets');
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, []);

    if (loading) {
        return <div>Loading tickets...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (tickets.length === 0) {
        return <div>No tickets available.</div>;
    }

    return (
        <div className="max-w-2xl mx-auto mt-12 p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-center text-2xl mb-6 font-semibold">My Tickets</h2>
        <div className="flex flex-col">
            {tickets.map(ticket => (
                <div key={ticket._id} className="p-4 mb-4 bg-gray-100 border border-gray-300 rounded-lg">
                    <h3 className="text-lg font-bold">{ticket.eventType} Ticket</h3>
                    <p className="text-gray-700">Visitor: {ticket.visitorName}</p>
                    <p className="text-gray-700">Date: {new Date(ticket.visitDate).toLocaleDateString()}</p>
                    <p className="text-gray-700">Quantity: {ticket.quantity}</p>
                    <p className="text-gray-700">Ticket Id: {ticket._id}</p>
                    <p className="text-gray-700">Ticket status: {ticket.status}</p>
                </div>
            ))}
        </div>
    </div>
    );
};

export default TicketList;
