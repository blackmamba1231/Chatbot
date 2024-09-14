import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SignIn.css'; // Optional CSS for styling
import { BottomWarning } from '../components/BottomWarning';
const SignIn = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/v1/user/signin', formData);
            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                navigate('/profile');
            } else {
                setError('Invalid username or password');
            }
        } catch (error) {
            console.error('Error during sign-in:', error);
        }
    };

    return (
        <div className="justify-center py-40 max-w-md mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
            <h2 className="text-center text-2xl font-bold mb-6 text-gray-800">Sign In</h2>
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
                    className="p-3 mb-6 border border-gray-300 rounded-lg text-lg"
                />
                <button
                    type="submit"
                    className="py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg"
                >
                    Sign In
                </button>
                <BottomWarning label={"Don't have an account?"} buttonText={"Sign up"} to={"/signup"} />
            </form>
            
        </div>
    );
};

export default SignIn;
