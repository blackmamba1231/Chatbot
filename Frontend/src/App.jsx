import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Home from './pages/Home';
import Profile from './pages/Profile';
import TicketForm from './components/TicketForm';
import TicketList from './components/TicketList';
import ChatBot from './components/ChatBot';
import TicketDetails from './components/TicketDetails';  // Ensure this is imported

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
            </Routes>
        </Router>
    );
}

export default App;
