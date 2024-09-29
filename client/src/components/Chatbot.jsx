import React, { useState, useEffect } from 'react';
import axios from 'axios';



const translations = {
  en: {
    hello: "Hello! What is your name?",
    niceToMeet: "Nice to meet you",
    visitorName: "What is the visitor's name?",
    visitDate: "When would you like to visit? (Please provide the date in YYYY-MM-DD format)",
    ticketType: "What type of ticket would you like? (e.g., Adult, Child, Senior)",
    quantity: "How many tickets would you like to book?",
    eventType: "What is the event type? (e.g., regular, special, discounted)",
    confirm: "Please review your details and confirm. Type 'confirm' to proceed.",
    success: "Your booking was successful!",
    paymentSuccess: "Payment was successful! Your tickets have been booked.",
    paymentFailed: "Payment failed. Please try again.",
    error: "Error: Could not process your booking.",
    retryConfirm: "I didn't understand that. Please type 'confirm' to proceed with booking.",
    help: "How can I help you?"
  },
  es: {
    hello: "¡Hola! ¿Cómo te llamas?",
    niceToMeet: "Mucho gusto",
    visitorName: "¿Cuál es el nombre del visitante?",
    visitDate: "¿Cuándo te gustaría visitar? (Por favor proporciona la fecha en formato AAAA-MM-DD)",
    ticketType: "¿Qué tipo de boleto te gustaría? (e.g., Adulto, Niño, Senior)",
    quantity: "¿Cuántos boletos te gustaría reservar?",
    eventType: "¿Cuál es el tipo de evento? (e.g., regular, especial, con descuento)",
    confirm: "Revisa tus detalles y confirma. Escribe 'confirmar' para continuar.",
    success: "¡Tu reserva fue exitosa!",
    paymentSuccess: "¡Pago exitoso! Tus boletos han sido reservados.",
    paymentFailed: "El pago falló. Por favor intenta de nuevo.",
    error: "Error: No se pudo procesar tu reserva.",
    retryConfirm: "No entendí eso. Por favor escribe 'confirmar' para continuar con la reserva.",
    help: "¿Cómo te puedo ayudar?"
  },
  fr: {
    hello: "Bonjour ! Quel est votre nom ?",
    niceToMeet: "Enchanté",
    visitorName: "Quel est le nom du visiteur ?",
    visitDate: "Quand souhaitez-vous visiter ? (Veuillez fournir la date au format AAAA-MM-JJ)",
    ticketType: "Quel type de billet souhaitez-vous ? (e.g., Adulte, Enfant, Senior)",
    quantity: "Combien de billets souhaitez-vous réserver ?",
    eventType: "Quel est le type d'événement ? (e.g., régulier, spécial, réduit)",
    confirm: "Veuillez vérifier vos détails et confirmer. Tapez 'confirmer' pour continuer.",
    success: "Votre réservation a été réussie !",
    paymentSuccess: "Paiement réussi ! Vos billets ont été réservés.",
    paymentFailed: "Le paiement a échoué. Veuillez réessayer.",
    error: "Erreur : Impossible de traiter votre réservation.",
    retryConfirm: "Je n'ai pas compris. Tapez 'confirmer' pour continuer la réservation.",
    help: "Comment puis-je vous aider?"
  },
  de: {
    hello: "Hallo! Wie ist Ihr Name?",
    niceToMeet: "Schön, dich kennenzulernen",
    visitorName: "Wie heißt der Besucher?",
    visitDate: "Wann möchten Sie besuchen? (Bitte geben Sie das Datum im Format JJJJ-MM-TT an)",
    ticketType: "Welche Art von Ticket möchten Sie? (z.B., Erwachsener, Kind, Senior)",
    quantity: "Wie viele Tickets möchten Sie buchen?",
    eventType: "Welche Art von Veranstaltung? (z.B., regulär, speziell, ermäßigt)",
    confirm: "Bitte überprüfen Sie Ihre Daten und bestätigen Sie. Geben Sie 'bestätigen' ein, um fortzufahren.",
    success: "Ihre Buchung war erfolgreich!",
    paymentSuccess: "Zahlung erfolgreich! Ihre Tickets wurden gebucht.",
    paymentFailed: "Die Zahlung ist fehlgeschlagen. Bitte versuchen Sie es erneut.",
    error: "Fehler: Ihre Buchung konnte nicht verarbeitet werden.",
    retryConfirm: "Ich habe das nicht verstanden. Geben Sie 'bestätigen' ein, um mit der Buchung fortzufahren.",
    help: "Wie kann ich Ihnen helfen?"
  },
  zh: {
    hello: "你好！你叫什么名字？",
    niceToMeet: "很高兴见到你",
    visitorName: "访问者的名字是什么？",
    visitDate: "您想什么时候参观？（请提供 YYYY-MM-DD 格式的日期）",
    ticketType: "您想要哪种票？（例如，成人票，儿童票，老年票）",
    quantity: "您想预订多少张票？",
    eventType: "这是什么类型的活动？（例如，普通的，特别的，打折的）",
    confirm: "请查看您的详细信息并确认。输入“确认”以继续。",
    success: "您的预订成功了！",
    paymentSuccess: "付款成功！您的票已被预订。",
    paymentFailed: "付款失败。请再试一次。",
    error: "错误：无法处理您的预订。",
    retryConfirm: "我不明白。请输入“确认”继续预订。",
    help: "我能帮你什么吗？"
  }
};


const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState('en'); 
  const [formData, setFormData] = useState({
    visitorName: '',
    visitDate: '',
    ticketType: '',
    quantity: '',
    eventType: ''
  });
  const [step, setStep] = useState(0);
  const [price, setPrice] = useState(null);
  const [razorpayOrderId, setRazorpayOrderId] = useState(null);
  
  useEffect(() => {
    if (step === 0) {
      setMessages([{ text: translations[language].hello, type: 'bot' }]);
      setStep(1);
    }
  }, [step, language]);

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang); 
    setMessages([{ text: translations[lang].hello, type: 'bot' }]); 
    setStep(1);
  };
  
  const fetchNLPResponse = async (message) => {
    console.log( {
      "message": message
    } );
    try {
      const response = await axios.post('http://localhost:3000/api/v1/bot/chat', {"message": message});
      return response.data;
    } catch (error) {
      console.error("Error fetching NLP response:", error);
      return null;
    }
  };
  const checkPaymentStatus = async (razorpayOrderId) => {
    try {
        // Update the endpoint to use the Razorpay orderId instead of PayPal orderId
        const response = await axios.get(`http://localhost:3000/api/v1/ticket/status/?orderId=${razorpayOrderId}`);
        const status = response.data.status;
        console.log('Payment status: ' + status);

        if (status === 'captured') {
            setMessages((prevMessages) => [
                ...prevMessages,
                { text: 'Payment was successful! Your tickets have been booked.', type: 'bot' },
            ]);
        } else if (status === 'failed') {
            setMessages((prevMessages) => [
                ...prevMessages,
                { text: 'Payment failed. Please try again.', type: 'bot' },
            ]);
        }
    } catch (error) {
        console.error('Error checking payment status:', error);
    }
};

useEffect(() => {
  // Dynamically load the Razorpay script when the component mounts
  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  script.async = true;
  document.body.appendChild(script);

  return () => {
      // Clean up the script when the component unmounts
      document.body.removeChild(script);
  };
}, []);


const handleSubmit = async (e) => {
  e.preventDefault();
  if (!input.trim()) return;

  const userMessage = { text: input, type: 'user' };
  setMessages((prevMessages) => [...prevMessages, userMessage]);
  setInput('');
  setIsLoading(true);
  
  if (step === 1) {
      setMessages((prevMessages) => [
          ...prevMessages,
          { text: `${translations[language].niceToMeet} ${input}! ${translations[language].help} `, type: 'bot'}
      ]);
      setStep(2);
  }

  if (step === 2) {
      const response = await fetchNLPResponse(input);
      console.log(response);
      if (response.intent === 'ticket.booking') {
          setMessages((prevMessages) => [
              ...prevMessages,
              { text: response.answer, type: 'bot'}
          ]);
          setStep(3);
      } else {
          if (response.intent === 'None') {
              setMessages((prevMessages) => [
                  ...prevMessages,
                  { text: response.answer, type: 'bot'}
              ]);
          }
          setStep(2);
      }
  }
 
  if (step === 3) {
      setFormData((prevFormData) => ({ ...prevFormData, visitorName: input }));
      setMessages((prevMessages) => [
          ...prevMessages,
          { text: translations[language].visitDate, type: 'bot' }
      ]);
      setStep(4);
  } else if (step === 4) {
      setFormData((prevFormData) => ({ ...prevFormData, visitDate: input }));
      setMessages((prevMessages) => [
          ...prevMessages,
          { text: translations[language].ticketType, type: 'bot' }
      ]);
      setStep(5);
  } else if (step === 5) {
      setFormData((prevFormData) => ({ ...prevFormData, ticketType: input }));
      setMessages((prevMessages) => [
          ...prevMessages,
          { text: translations[language].quantity, type: 'bot' }
      ]);
      setStep(6);
  } else if (step === 6) {
      setFormData((prevFormData) => ({ ...prevFormData, quantity: input }));
      setMessages((prevMessages) => [
          ...prevMessages,
          { text: translations[language].eventType, type: 'bot' }
      ]);
      setStep(7);
  } else if (step === 7) {
      setFormData((prevFormData) => ({ ...prevFormData, eventType: input }));
      setMessages((prevMessages) => [
          ...prevMessages,
          { text: translations[language].confirm, type: 'bot' }
      ]);
      setStep(8);
  } else if (step === 8 && input.toLowerCase() === 'confirm') {
      try {
          console.log(formData);
          console.log(localStorage.getItem('token'));
          const ticketResponse = await axios.post('http://localhost:3000/api/v1/ticket/create-pending', formData, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          setPrice(ticketResponse.data.price);
          setRazorpayOrderId(ticketResponse.data.ticket._id);
          console.log(ticketResponse.data.price);
          // Initiate Razorpay order creation
          const orderResponse = await axios.post('http://localhost:3000/api/v1/ticket/razorpay/create-order', {
              amount: ticketResponse.data.price
          });

          const options = {
            key: 'rzp_test_VfxTNOWFmIqHO7', 
            amount: orderResponse.data.amount,
            currency: orderResponse.data.currency,
            order_id: orderResponse.data.id,
            name: 'Ticket bot',
            description: 'Test Payment',
            handler: async function (response) {
                const ticket_id = ticketResponse.data.ticket._id;
                const result = await axios.get('http://localhost:3000/api/v1/user/profile',{
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}
                })
                console.log(result);
                const username = result.data.username;
                console.log(username);
                console.log("ticket id " + ticket_id);
                try{
                     const result = await axios.post('http://localhost:3000/api/v1/ticket/confirm', {
                         ticketId: ticket_id,
                         username: username
                     },
                    {
                     headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}
                    })
                  console.log("Ticket created successfully");
                  
                }catch{
                    console.log("Ticket creation failed");
                }
            },
            theme: {
                color: "#F37254" // Razorpay's theme color for the checkout window
            }
        };
        

          const rzp1 = new window.Razorpay(options);
          rzp1.open();

          

          setFormData({
              visitorName: '',
              visitDate: '',
              ticketType: '',
              quantity: '',
              eventType: ''
          });
          
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: `Your ticket was successfully created. Please check you mail for ticket details`, type: 'bot' }
        ]);
      } catch (error) {
          console.log(formData);
          setMessages((prevMessages) => [
              ...prevMessages,
              { text: translations[language].error, type: 'bot' }
          ]);
      }
  }

  setIsLoading(false);
};

useEffect(() => {
  if (razorpayOrderId) {
      const interval = setInterval(checkPaymentStatus(razorpayOrderId), 5000);
      return () => clearInterval(interval); 
  }
}, [razorpayOrderId]);


  return (
    <div className="flex flex-col h-[80vh] max-w-lg mx-auto border border-gray-300 rounded-lg overflow-hidden bg-gray-100">
      {/* Language Selector */}
      <div className="flex justify-center space-x-2 p-2 bg-gray-200">
        <button onClick={() => handleLanguageChange('en')} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">English</button>
        <button onClick={() => handleLanguageChange('es')} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Español</button>
        <button onClick={() => handleLanguageChange('fr')} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Français</button>
        <button onClick={() => handleLanguageChange('de')} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Deutsch</button>
        <button onClick={() => handleLanguageChange('zh')} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">中文</button>
      </div>

      <div className="flex flex-col flex-1 p-4 overflow-y-auto">
        <div className="flex flex-col space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`max-w-[80%] p-3 rounded-lg ${msg.type === 'user' ? 'self-end bg-green-200' : 'self-start bg-gray-300'}`}>
              {msg.text}
            </div>
          ))}
          {isLoading && <div className="text-center text-gray-500">Bot is typing...</div>}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex items-center p-4 border-t border-gray-300 bg-white">
        <input
          type="text"
          value={input}
          onChange={handleChange}
          placeholder="Type your message here..."
          className="flex-grow p-3 border border-gray-300 rounded-full focus:outline-none focus:ring focus:ring-blue-200"
        />
        <button type="submit" className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatBot;