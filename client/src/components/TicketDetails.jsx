import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';


const TicketDetails = () => {
    const { id } = useParams(); 
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                const response = await axios.get(`https://chatbot-frontend-smoky.vercel.app/api/v1/ticket/${id}`);
                setTicket(response.data);
            } catch (err) {
                setError('Error loading ticket details');
            } finally {
                setLoading(false);
            }
        };

        fetchTicket();
    }, [id]);

    if (loading) {
        return <div>Loading ticket details...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="ticket-details-container">
            {ticket ? (
                <>
                    <h2>Ticket Details</h2>
                    <p><strong>Visitor Name:</strong> {ticket.visitorName}</p>
                    <p><strong>Event Type:</strong> {ticket.eventType}</p>
                    <p><strong>Date of Visit:</strong> {new Date(ticket.visitDate).toLocaleDateString()}</p>
                    <p><strong>Ticket Type:</strong> {ticket.ticketType}</p>
                    <p><strong>Quantity:</strong> {ticket.quantity}</p>
                    <p><strong>Total Price:</strong> ${ticket.price}</p>
                </>
            ) : (
                <div>No details available</div>
            )}
        </div>
    );
};

export default TicketDetails;
