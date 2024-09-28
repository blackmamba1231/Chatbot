require('dotenv').config();
const express = require('express');
const router = express.Router();
const zod = require("zod");
const { User, Account } = require('../db');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const jWT_Secret = require("../config");
const { authmiddleware } = require('../middleware');
const speakeasy = require('speakeasy');
const nodemailer = require('nodemailer');
const crypto = require('crypto');


// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL, // Your email here
        pass: process.env.EMAIL_PASSWORD // Your email password here
    }
});

// Validation schemas
const otpSchema = zod.object({
    username: zod.string().email(),
    otp: zod.string().length(6),
});

const signupSchema = zod.object({
    username: zod.string().email(),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string()
});

const signinSchema = zod.object({
    username: zod.string().email(),
    password: zod.string()
});

const updateSchema = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
});

// Signup route (Generate OTP and send via email)
router.post("/signup", async (req, res) => {
    const { success } = signupSchema.safeParse(req.body);
    if (!success) {
        return res.json({ message: "Incorrect inputs" });
    }

    const user = await User.findOne({ username: req.body.username });
    if (user) {
        return res.json({ message: "Email already taken" });
    }
    console.log(process.env.EMAIL);
    
    // Generate OTP
    const otp = speakeasy.totp({
        secret: process.env.OTP_SECRET,
        encoding: 'base32',
        step: 300 // OTP valid for 5 minutes
    });

    const hashedOTP = await bcrypt.hash(otp, 10);
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Save user info temporarily in Account collection with OTP
    const account = await Account.create({
        
        username: req.body.username,
        password: hashedPassword,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        otp: hashedOTP,
        otpExpiresAt: Date.now() + 5 * 60 * 1000 // OTP expires in 5 minutes
    });
    await account.save();
    // Send OTP to user's email
    const mailOptions = {
        from: process.env.EMAIL,
        to: req.body.username,
        subject: 'Your OTP for Signup',
        text: `Your OTP is ${otp}. It will expire in 5 minutes.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending OTP:", error);
            return res.status(500).json({ message: "Error sending OTP" });
        } else {
            return res.json({
                success: true,
                message: "OTP sent to your email. Please verify to complete signup."
            });
        }
    });
});

// Verify OTP route
router.post("/verify-otp", async (req, res) => {
  const { success } = otpSchema.safeParse(req.body);
  if (!success) {
      return res.json({ message: "Incorrect OTP inputs" });
  }

  const { username, otp } = req.body;
  const account = await Account.findOne({ username });

  if (!account || !account.otp) {
      return res.json({ message: "Invalid username or OTP" });
  }

  // Check if OTP has expired
  console.log(Date.now(), account.otpExpiresAt);
  if (Date.now() > account.otpExpiresAt) {
      return res.json({ message: "OTP has expired" });
  }

  // Verify OTP
  const isOTPValid = await bcrypt.compare(otp, account.otp);
  if (!isOTPValid) {
      return res.json({ message: "Invalid OTP" });
  }

  // Create the actual user
  const hashedPassword = await bcrypt.hash(account.password, 10);
  const user = await User.create({
      username: account.username,
      password: hashedPassword,
      firstName: account.firstName,
      lastName: account.lastName,
  });

  await user.save();
  const userId = user._id;
  await Account.updateOne( { userId: userId })

 

  // Generate JWT token
  const token = jwt.sign({ userId }, jWT_Secret);

  res.json({ success: true, token, userId });
});
// Signin route
router.post("/signin", async (req, res) => {
    const { success } = signinSchema.safeParse(req.body);
    if (!success) {
        return res.status(403).json({ message: "Wrong inputs :(" });
    }

    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.json({ success: false, message: 'Invalid username or password (user not found)' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.json({ success: false, message: 'Invalid username or password (incorrect password)' });
        }

        const token = jwt.sign({ userId: user._id }, jWT_Secret);
        const userId = user._id;

        res.json({ success: true, token, userId });
    } catch (error) {
        console.error('Error during sign-in:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Update user info
router.put("/", authmiddleware, async (req, res) => {
    const body = req.body;
    const { success } = updateSchema.safeParse(body);
    if (!success) {
        return res.status(411).json({ message: "Error while updating information" });
    }

    await User.updateOne({ _id: req.userId }, req.body);
    res.json({ message: "Updated successfully" });
});

// Get user profile
router.get("/profile", authmiddleware, async (req, res) => {
    const user = await User.findOne({ _id: req.userId });
    res.json(user);
});
router.post('/forgot-password', async (req, res) => {
  const { username } = req.body;
  console.log(username);
  try {
    
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    
    const resetToken = crypto.randomBytes(20).toString('hex');

    
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send password reset email
    const resetUrl = `http://localhost:5173/reset/?token=${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL,
      to: username,
      subject: 'Password Reset Request',
      text: `You requested a password reset. Please click the following link to reset your password: ${resetUrl}`
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: 'Password reset link sent to your email' });

  } catch (error) {
    console.error('Error during password reset request:', error);
    res.status(500).json({ success: false, message: 'An error occurred. Please try again.' });
  }
});
router.post('/reset-password', async(req,res)=>{
  const { token, newPassword} = req.body;
  try {
    const user = await User.findOne({ resetToken: token });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }
    if (Date.now() > user.resetTokenExpiry) {
      return res.status(400).json({ success: false, message: 'Token has expired' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    user.password = hashedPassword;
    user.resetToken = undefined; 
    user.resetTokenExpiry = undefined; 
    await user.save();

    res.status(200).json({ success: true, message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Error during password reset:', error);
    res.status(500).json({ success: false, message: 'An error occurred. Please try again.' });
  }
})

module.exports = router;
