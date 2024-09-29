import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Home from './pages/Home';
import Profile from './pages/Profile';
import TicketForm from './components/TicketForm';
import TicketList from './components/TicketList';
import ChatBot from './components/Chatbot';
import TicketDetails from './components/TicketDetails';  // Ensure this is imported
import VerifyOTP from './components/VerifyOTP';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Help from './components/Help'
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/book" element={<TicketForm />} />
                <Route path="/my-tickets" element={<TicketList />} />
                <Route path="/tickets/:id" element={<TicketDetails />} /> {/* For ticket details */}
                <Route path="/chat" element={<ChatBot />} />
                <Route path="/verify-otp" element={<VerifyOTP />} /> {/* Add OTP verification route */}
                <Route path="/forgot" element={<ForgotPassword />} /> {/* Add OTP verification route */}
                <Route path="/reset" element={<ResetPassword/>} /> {/* Add OTP verification route */}
                <Route path="/help" element={<Help/>} /> {/* Add OTP verification route */}
            </Routes>
        </Router>
    );
}

export default App;
