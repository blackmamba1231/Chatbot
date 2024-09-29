import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ChatBot from '../components/Chatbot'; // Import ChatBot component
import { Dialog, DialogPanel, DialogTitle, TransitionChild } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

import './Profile.css'; // CSS for styling the profile

const Profile = () => {
    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        avatar: ''
    });
    const [editMode, setEditMode] = useState(false);
    const [message, setMessage] = useState('');
    const [isChatBotOpen, setIsChatBotOpen] = useState(false); // State to control ChatBot visibility
    const navigate = useNavigate(); // useNavigate hook for navigation

    const fetchProfile = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/v1/user/profile', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setProfileData(response.data); // Update profile data with the fetched values
        } catch (error) {
            console.error('Error fetching profile data:', error);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData({ ...profileData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Profile Data being sent:", profileData);
        try {
            await axios.put('http://localhost:3000/api/v1/user/', profileData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setMessage('Profile updated successfully');
            setEditMode(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage('Error updating profile.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove token from local storage
        navigate('/'); // Redirect to login page
    };

    return (
        <div>
            <Dialog open={true} onClose={() => {}} className="relative z-10">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <DialogPanel className="relative w-full max-w-lg bg-white rounded-lg shadow-xl">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h2 className="text-xl font-bold">User Profile</h2>
                            <button
                                type="button"
                                onClick={() => {}}
                                className="absolute top-4 right-4 p-1.5 rounded-md text-gray-300 hover:text-gray-900"
                            >
                                <XMarkIcon className="h-6 w-6" />
                                <span className="sr-only">Close panel</span>
                            </button>
                        </div>
                        {message && <p className="text-green-500 mt-2 px-4">{message}</p>}
                        <div className="p-4">
                            <div className="mb-4">
                                <img
                                    src={profileData.avatar || 'https://via.placeholder.com/150'}
                                    alt="User Avatar"
                                    className="w-36 h-36 rounded-full mx-auto"
                                />
                            </div>
                            <div className="mt-5">
                                {!editMode ? (
                                    <div>
                                        <p><strong>First Name:</strong> {profileData.firstName}</p>
                                        <p><strong>Last Name:</strong> {profileData.lastName}</p>
                                        <p><strong>Email:</strong> {profileData.username}</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={profileData.firstName}
                                            onChange={handleChange}
                                            placeholder="First Name"
                                            className="w-full p-2 border rounded-md"
                                        />
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={profileData.lastName}
                                            onChange={handleChange}
                                            placeholder="Last Name"
                                            className="w-full p-2 border rounded-md"
                                        />
                                        <input
                                            type="email"
                                            name="username"
                                            value={profileData.username}
                                            onChange={handleChange}
                                            placeholder="Email"
                                            className="w-full p-2 border rounded-md"
                                        />
                                        <input
                                            type="text"
                                            name="avatar"
                                            value={profileData.avatar}
                                            onChange={handleChange}
                                            placeholder="Avatar URL (optional)"
                                            className="w-full p-2 border rounded-md"
                                        />
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700"
                                        >
                                            Save Changes
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                        
                        <div className="flex flex-col space-y-4 p-4 border-t">
                            <button
                                onClick={() => setEditMode(!editMode)}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
                            >
                                {editMode ? 'Cancel' : 'Edit Profile'}
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700"
                            >
                                Log Out
                            </button>
                            <div className="flex justify-around">
                                <button
                                    onClick={() => {
                                        navigate('/book')
                                    }}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Book Ticket
                                </button>
                                <button
                                    onClick={() => {
                                        navigate('/my-tickets');
                                    }}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
                                >
                                    View Tickets
                                </button>
                                <button
                                    onClick={() => setIsChatBotOpen(true)} // Open ChatBot modal
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
                                >
                                    ChatBot
                                </button>
                            </div>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>

            {/* ChatBot Modal */}
            {isChatBotOpen && (
                <Dialog open={isChatBotOpen} onClose={() => setIsChatBotOpen(false)} className="relative z-10">
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" />
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <DialogPanel className="relative w-full max-w-lg bg-white rounded-lg shadow-xl">
                            <div className="flex justify-between items-center p-4 border-b">
                                <h2 className="text-xl font-bold">ChatBot</h2>
                                <button
                                    type="button"
                                    onClick={() => setIsChatBotOpen(false)}
                                    className="absolute top-4 right-4 p-1.5 rounded-md text-gray-300 hover:text-gray-900"
                                >
                                    <XMarkIcon className="h-6 w-6" />
                                    <span className="sr-only">Close panel</span>
                                </button>
                            </div>
                            <div className="p-4">
                                <ChatBot /> {/* Embed ChatBot component */}
                            </div>
                        </DialogPanel>
                    </div>
                </Dialog>
            )}
        </div>
    );
};

export default Profile;
