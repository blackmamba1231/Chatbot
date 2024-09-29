import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const VerifyOTP = () => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const username = localStorage.getItem('username');
            const response = await axios.post('https://chatbot-api-seven-murex.vercel.app/api/v1/user/verify-otp', { username, otp });
            if (response.data.success) {
                localStorage.setItem('token', response.data.token); // Save the JWT token
                navigate('/chat'); // Redirect to the profile page
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            console.error('Error during OTP verification:', error);
            setError('Invalid OTP. Please try again.');
        }
    };

    return (
        <div className="py-40 justify-center max-w-md mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
            <h2 className="justify-center text-center text-2xl font-bold mb-6 text-gray-800">Verify OTP</h2>
            {error && <p className="text-red-500 text-center text-sm mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="flex flex-col">
                <input
                    type="text"
                    name="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    required
                    className="p-3 mb-6 border border-gray-300 rounded-lg text-lg"
                />
                <button
                    type="submit"
                    className="py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg"
                >
                    Verify OTP
                </button>
            </form>
        </div>
    );
};

export default VerifyOTP;
