import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SignUp.css'; // Optional CSS for styling
import { BottomWarning } from '../components/BottomWarning';

const SignUp = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        firstName: '',
        lastName: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://chatbot-api-seven-murex.vercel.app/api/v1/user/signup', formData);
            if (response.data.success) {
                // Store the username in localStorage for OTP verification later
                localStorage.setItem('username', formData.username);
                navigate('/verify-otp'); // Navigate to OTP verification page
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            console.error('Error during sign-up:', error);
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div className="py-40 justify-center max-w-md mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
            <h2 className="justify-center text-center text-2xl font-bold mb-6 text-gray-800">Sign Up</h2>
            {error && <p className="text-red-500 text-center text-sm mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="flex flex-col">
                <input
                    type="email"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                    className="p-3 mb-4 border border-gray-300 rounded-lg text-lg"
                />
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                    className="p-3 mb-4 border border-gray-300 rounded-lg text-lg"
                />
                <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                    required
                    className="p-3 mb-4 border border-gray-300 rounded-lg text-lg"
                />
                <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                    required
                    className="p-3 mb-6 border border-gray-300 rounded-lg text-lg"
                />
                <button
                    type="submit"
                    className="py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg"
                >
                    Sign Up
                </button>
                <BottomWarning label={"Already have an account?"} buttonText={"Sign in"} to={"/signin"} />
            </form>
        </div>
    );
};

export default SignUp;
