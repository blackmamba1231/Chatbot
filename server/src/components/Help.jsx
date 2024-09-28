import { MessageCircle, Search, Calendar, Clock, Globe, Smartphone } from 'lucide-react';
const Help = () => {
    return(
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">How It Works</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white mb-4">
                        <MessageCircle className="h-12 w-12" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Initiate Conversation</h3>
                    <p className="text-muted-foreground">Start a conversation with TicketBot by clicking on the chat icon. It’s available 24/7 to assist you.</p>
                </div>
                <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white mb-4">
                        <Search className="h-12 w-12" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Search for Tickets</h3>
                    <p className="text-muted-foreground">Tell TicketBot what type of tickets you’re looking for. You can specify the event, date, and number of tickets.</p>
                </div>
                <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white mb-4">
                        <Calendar className="h-12 w-12" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Select Your Tickets</h3>
                    <p className="text-muted-foreground">Review the available options and select the tickets that best fit your needs. TicketBot will provide you with details and availability.</p>
                </div>
                <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white mb-4">
                        <Clock className="h-12 w-12" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Book and Pay</h3>
                    <p className="text-muted-foreground">Confirm your choice and proceed to payment. TicketBot will guide you through the secure payment process.</p>
                </div>
                <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white mb-4">
                        <Globe className="h-12 w-12" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Receive Confirmation</h3>
                    <p className="text-muted-foreground">Once your payment is successful, TicketBot will send you a confirmation message with your ticket details.</p>
                </div>
            </div>
        </div>
    </section>
    )
}
export default Help;