const mongoose = require("mongoose");
const Razorpay = require("razorpay");
mongoose.connect("mongodb+srv://Sudhanshu:KiTMF6SBvlMk5Tjn@cluster0.p6pm8.mongodb.net/");
const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false, // For temporarily storing pre-verified user data
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50,
    },
    otp: {
        type: String, // Hashed OTP
        required: true,
    },
    otpExpiresAt: {
        type: Date, // OTP expiry time
        required: true,
    },
})
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    password: {
        type: String,
        required: true,
        minLength: 1 
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    avatar: { type: String, default: 'https://via.placeholder.com/150' } ,
    resetToken: {
        type: String,
        default: null
      },
      resetTokenExpiry: {
        type: Date,
        default: null
      }
    
});
const User = mongoose.model('User', userSchema);
const Account = mongoose.model('Account', accountSchema);
const TicketSchema = new mongoose.Schema({
    visitorName: { type: String, required: true },
    visitDate: { type: Date, required: true },
    ticketType: { type: String, required: true },
    quantity: { type: Number, required: true },
    account: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Account', 
        required: true 
    },
    eventType: { type: String, required: true },
    status: { type: String, default: 'pending' },
    
})

const Ticket = mongoose.model('Ticket', TicketSchema);

module.exports = {
    Account,
    User,
    Ticket
}