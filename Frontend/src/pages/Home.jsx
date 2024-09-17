'use client'

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Dialog, DialogPanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { MessageCircle, Search, Calendar, Clock, Globe, Smartphone } from 'lucide-react';

const navigation = [
    { name: 'Sign Up', href: 'signup' },
    { name: 'Sign in', href: 'signin' },
    { name: 'Contact', href: 'contact' },
];

const Home = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="flex flex-col min-h-screen">
            <header className="px-4 lg:px-6 h-14 flex items-center border-b">
                <Link className="flex items-center justify-center" to="#">
                    <MessageCircle className="h-6 w-6 text-primary" />
                    <span className="ml-2 text-2xl font-bold">TicketBot</span>
                </Link>
                <nav className="ml-auto flex gap-4 sm:gap-6">
                    {navigation.map((item) => (
                        <Link key={item.name} className="text-sm font-medium hover:underline underline-offset-4" to={item.href}>
                            {item.name}
                        </Link>
                    ))}
                </nav>
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(true)}
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                    >
                        <span className="sr-only">Open main menu</span>
                        <Bars3Icon aria-hidden="true" className="h-6 w-6" />
                    </button>
                </div>
            </header>
            <Dialog open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} className="lg:hidden">
                <div className="fixed inset-0 z-50" />
                <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                    <div className="flex items-center justify-between">
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(false)}
                            className="-m-2.5 rounded-md p-2.5 text-gray-700"
                        >
                            <span className="sr-only">Close menu</span>
                            <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                        </button>
                    </div>
                    <div className="mt-6 flow-root">
                        <div className="-my-6 divide-y divide-gray-500/10">
                            <div className="space-y-2 py-6">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </DialogPanel>
            </Dialog>
            <main className="flex-1">
                <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-primary/20 via-primary/10 to-background">
                    <div className="container px-4 md:px-6">
                        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                            <div className="flex flex-col justify-center space-y-4">
                                <div className="space-y-2">
                                    <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                                        Book Your Tickets with AI-Powered Ease
                                    </h1>
                                    <p className="max-w-[600px] text-muted-foreground md:text-xl">
                                        Say goodbye to long queues and confusing booking systems. Our chatbot makes ticket booking a breeze, 24/7.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                                    <Link
                                        className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                                        to="/signup"
                                    >
                                        Start Booking
                                    </Link>
                                    <Link
                                        className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                                        to="/help"
                                    >
                                        See How It Works
                                    </Link>
                                </div>
                            </div>
                            <div className="flex items-center justify-center">
                                <div className="relative w-[300px] h-[500px] sm:w-[350px] sm:h-[600px] bg-gradient-to-b from-primary/20 to-background rounded-lg shadow-lg overflow-hidden">
                                    <div className="absolute inset-2 bg-white rounded-lg p-4">
                                        <div className="flex flex-col h-full">
                                            <div className="flex-1 overflow-y-auto space-y-4">
                                                <div className="flex justify-start">
                                                    <div className="bg-muted p-3 rounded-lg max-w-[80%]">
                                                        <p className="text-sm">Hello! I'm TicketBot. What kind of tickets are you looking for today?</p>
                                                    </div>
                                                </div>
                                                <div className="flex justify-end">
                                                    <div className="bg-primary text-primary-foreground p-3 rounded-lg max-w-[80%]">
                                                        <p className="text-sm">I need two concert tickets for next weekend.</p>
                                                    </div>
                                                </div>
                                                <div className="flex justify-start">
                                                    <div className="bg-muted p-3 rounded-lg max-w-[80%]">
                                                        <p className="text-sm">Great! I can help you with that. Do you have a specific artist or venue in mind?</p>
                                                    </div>
                                                </div>
                                                <div className="flex justify-end">
                                                    <div className="bg-primary text-primary-foreground p-3 rounded-lg max-w-[80%]">
                                                        <p className="text-sm">Yes, I'm looking for tickets to the Taylor Swift concert at Madison Square Garden.</p>
                                                    </div>
                                                </div>
                                                <div className="flex justify-start">
                                                    <div className="bg-muted p-3 rounded-lg max-w-[80%]">
                                                        <p className="text-sm">Excellent choice! I've found 2 tickets for Taylor Swift at Madison Square Garden next Saturday. The best available seats are in Section 103, Row 12. Would you like to proceed with booking?</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <input className="w-full p-2 border border-gray-300 rounded" placeholder="Type your message..." />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
                    <div className="container px-4 md:px-6">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Why Choose TicketBot?</h2>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            <div className="flex flex-col items-center text-center">
                                <Search className="h-12 w-12 text-primary mb-4" />
                                <h3 className="text-xl font-bold mb-2">Smart Search</h3>
                                <p className="text-muted-foreground">Find the perfect tickets with our AI-powered search capabilities.</p>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <Calendar className="h-12 w-12 text-primary mb-4" />
                                <h3 className="text-xl font-bold mb-2">Real-Time Availability</h3>
                                <p className="text-muted-foreground">Get up-to-date information on ticket availability and prices.</p>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <Clock className="h-12 w-12 text-primary mb-4" />
                                <h3 className="text-xl font-bold mb-2">24/7 Service</h3>
                                <p className="text-muted-foreground">Our chatbot is available around the clock to assist with your booking needs.</p>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <Globe className="h-12 w-12 text-primary mb-4" />
                                <h3 className="text-xl font-bold mb-2">Multilingual Support</h3>
                                <p className="text-muted-foreground">Communicate in your preferred language for a seamless experience.</p>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <Smartphone className="h-12 w-12 text-primary mb-4" />
                                <h3 className="text-xl font-bold mb-2">Mobile Friendly</h3>
                                <p className="text-muted-foreground">Book tickets easily from your mobile device with our responsive design.</p>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-background">
                    <div className="container px-4 md:px-6">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">How It Works</h2>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white mb-4">
                                    <span className="text-2xl font-bold">1</span>
                                </div>
                                <h3 className="text-xl font-bold mb-2">Initiate Conversation</h3>
                                <p className="text-muted-foreground">Start a chat with TicketBot to begin your booking journey.</p>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white mb-4">
                                    <span className="text-2xl font-bold">2</span>
                                </div>
                                <h3 className="text-xl font-bold mb-2">Search for Tickets</h3>
                                <p className="text-muted-foreground">Use our smart search to find available tickets for your desired event.</p>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white mb-4">
                                    <span className="text-2xl font-bold">3</span>
                                </div>
                                <h3 className="text-xl font-bold mb-2">Book and Pay</h3>
                                <p className="text-muted-foreground">Complete your booking and payment directly through the chat.</p>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="contact" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
                    <div className="container px-4 md:px-6">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Get in Touch</h2>
                        <div className="flex flex-col items-center text-center">
                            <p className="text-lg text-muted-foreground mb-4">Have questions or need assistance? Feel free to reach out to us.</p>
                            <a
                                href="mailto:devchatbot9@gmail.com"
                                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                            >
                                Contact Us
                            </a>
                        </div>
                    </div>
                </section>
            </main>
            <footer className="bg-primary text-white py-6 text-center">
                <p className="text-sm">&copy; {new Date().getFullYear()} TicketBot. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Home;
