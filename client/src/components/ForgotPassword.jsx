import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
 // Optional CSS for styling

const ForgotPassword = () => {
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUsername(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://chatbot-api-seven-murex.vercel.app/api/v1/user/forgot-password', { username });
            if (response.data.success) {
                setMessage('A password reset link has been sent to your email.');
                setTimeout(() => navigate('/signin'), 5000); // Navigate to sign-in page after 5 seconds
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            console.error('Error during password reset request:', error);
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div className="py-40 justify-center max-w-md mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
            <h2 className="text-center text-2xl font-bold mb-6 text-gray-800">Forgot Password</h2>
            {message && <p className="text-green-500 text-center text-sm mb-4">{message}</p>}
            {error && <p className="text-red-500 text-center text-sm mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="flex flex-col">
                <input
                    type="email"
                    value={username}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                    className="p-3 mb-4 border border-gray-300 rounded-lg text-lg"
                />
                <button
                    type="submit"
                    className="py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg"
                >
                    Send Reset Link
                </button>
            </form>
        </div>
    );
};

export default ForgotPassword;
