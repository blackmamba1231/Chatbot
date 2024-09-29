import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';


const ResetPassword = () => {
    const location = useLocation();
    const queryParams = queryString.parse(location.search);
    const token = queryParams.token;

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'password') setPassword(value);
        if (name === 'confirmPassword') setConfirmPassword(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
           console.log(token)
        try {
            const response = await axios.post('https://chatbot-frontend-smoky.vercel.app/api/v1/user/reset-password', {
                token,
                newPassword: password,
            });

            if (response.data.success) {
                setSuccess('Password has been reset successfully. You can now log in.');
                setTimeout(() => navigate('/signin'), 3000); // Redirect to sign-in page after 3 seconds
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            console.error('Error resetting password:', error);
            setError('An error occurred or Session Expired. Please try again.');
        }
    };

    return (
        <div className="py-40 max-w-md mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
            <h2 className="text-center text-2xl font-bold mb-6 text-gray-800">Reset Password</h2>
            {error && <p className="text-red-500 text-center text-sm mb-4">{error}</p>}
            {success && <p className="text-green-500 text-center text-sm mb-4">{success}</p>}
            <form onSubmit={handleSubmit} className="flex flex-col">
                <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={handleChange}
                    placeholder="New Password"
                    required
                    className="p-3 mb-4 border border-gray-300 rounded-lg text-lg"
                />
                <input
                    type="password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm New Password"
                    required
                    className="p-3 mb-6 border border-gray-300 rounded-lg text-lg"
                />
                <button
                    type="submit"
                    className="py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg"
                >
                    Reset Password
                </button>
            </form>
        </div>
    );
};

export default ResetPassword;
