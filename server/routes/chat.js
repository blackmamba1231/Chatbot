const express = require('express');
const { NlpManager } = require('node-nlp');
const axios = require('axios'); 

const router = express.Router();
const manager = new NlpManager({ languages: ['en', 'es', 'fr', 'zh', 'de'] });

// English Queries and Responses
manager.addDocument('en', 'I want to book a ticket', 'ticket.booking');
manager.addDocument('en', 'ticket booking', 'ticket.booking');
manager.addDocument('en', 'book', 'ticket.booking');
manager.addDocument('en', 'book ticket', 'ticket.booking');
manager.addDocument('en', 'book a ticket', 'ticket.booking');
manager.addDocument('en', 'ticket', 'ticket.booking');
manager.addDocument('en', 'I need help with booking', 'ticket.help');
manager.addAnswer('en', 'ticket.booking', 'Sure, I can help with booking your ticket. Please provide the visitor name');
manager.addAnswer('en', 'ticket.help', 'What kind of help do you need with booking?');

// Spanish Queries and Responses
manager.addDocument('es', 'Quiero reservar una entrada', 'ticket.booking');
manager.addDocument('es', 'reservar entrada', 'ticket.booking');
manager.addDocument('es', 'reserva', 'ticket.booking');
manager.addDocument('es', 'reservar boleto', 'ticket.booking');
manager.addDocument('es', 'boletos', 'ticket.booking');
manager.addDocument('es', 'necesito ayuda con la reserva', 'ticket.help');
manager.addAnswer('es', 'ticket.booking', 'Claro, puedo ayudarte a reservar tu entrada. Por favor, proporciona el nombre del visitante.');
manager.addAnswer('es', 'ticket.help', '¿Qué tipo de ayuda necesitas con la reserva?');

// French Queries and Responses
manager.addDocument('fr', 'Je veux réserver un billet', 'ticket.booking');
manager.addDocument('fr', 'réservation de billet', 'ticket.booking');
manager.addDocument('fr', 'réserver', 'ticket.booking');
manager.addDocument('fr', 'réserver un billet', 'ticket.booking');
manager.addDocument('fr', 'billet', 'ticket.booking');
manager.addDocument('fr', 'J\'ai besoin d\'aide pour la réservation', 'ticket.help');
manager.addAnswer('fr', 'ticket.booking', 'Bien sûr, je peux vous aider à réserver votre billet. Veuillez fournir le nom du visiteur.');
manager.addAnswer('fr', 'ticket.help', 'Quel type d\'aide avez-vous besoin pour la réservation?');

// Chinese (Simplified) Queries and Responses


// German (Deutsch) Queries and Responses
manager.addDocument('de', 'Ich möchte ein Ticket buchen', 'ticket.booking');
manager.addDocument('de', 'Ticket buchen', 'ticket.booking');
manager.addDocument('de', 'buchen', 'ticket.booking');
manager.addDocument('de', 'Ticket', 'ticket.booking');
manager.addDocument('de', 'Ich brauche Hilfe bei der Buchung', 'ticket.help');
manager.addAnswer('de', 'ticket.booking', 'Sicher, ich kann Ihnen beim Buchen des Tickets helfen. Bitte geben Sie den Namen des Besuchers an.');
manager.addAnswer('de', 'ticket.help', 'Welche Art von Hilfe benötigen Sie bei der Buchung?');


(async () => {
  await manager.train();
  manager.save();
})();

router.post('/chat', async (req, res) => {
  const { message } = req.body;
  const response = await manager.process('en', message);
  
  if (response.intent === 'ticket.booking') {
    
    try {
      res.json({
        intent: response.intent,
        answer: 'Sure, I can help with booking your ticket. Please provide the visitor name'
      });
    } catch (error) {
      res.json({
        intent: response.intent,
        answer: 'There was an error while booking your ticket. Please try again later.'
      });
    }
  } else {
    res.json({
      intent: response.intent,
      answer: response.answer || 'I am not sure how to help with that.'
    });
  }
});


module.exports = router;
