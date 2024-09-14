const express = require('express');
const router = express.Router();
const zod = require("zod");
const { User, Account} = require('../db');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const jWT_Secret = require("../config");
const { authmiddleware }  = require('../middleware');
const signupSchema = zod.object({
    username: zod.string().email(),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string()
})
const signinSchema = zod.object({
    username: zod.string().email(),
    password: zod.string()
})
const updateSchema = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastname: zod.string().optional(),
    
})

router.post("/signup",async (req,res)=>{
    const{success}= signupSchema.safeParse(req.body);
    if(!success){
     return res.json({
         message: "Incorrect inputs"
     })
     } 
     const user = await User.findOne({
         username: req.body.username
     })
     if(user){
        return res.json({
         message: "Email already taken"
        }) 
     }
     const hashedPassword = await bcrypt.hash(req.body.password, 10);
    
     const dbuser = await User.create({
         username: req.body.username,
         password: hashedPassword,
         firstName: req.body.firstName,
         lastName: req.body.lastName,
        
     });
     await dbuser.save();
     const userId = dbuser._id;
     await Account.create({
         userId
     })
      const token = jwt.sign({
         userId: dbuser._id
       },jWT_Secret)
     
     res.json({
           success: true,
           token:  token,
           userId
     })
 
 })
 router.post("/signin",async(req,res)=>{
    
    const {success}= signinSchema.safeParse(req.body);

    if(!success){
        return res.status(403).json({
            message: "wrong inputs :("
        })

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

    const userid = user._id 
    res.json({ success: true, token ,userid});
  } catch (error) {
    console.error('Error during sign-in:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
return;
  
})
router.put("/",authmiddleware,async (req,res)=>{
    const body = req.body;
    const {success} = updateSchema.safeParse(body);
    if(!success){
        res.status(411).json({
            message: "Error while updating information"
        })
    }
     await User.updateOne({_id: req.userId},req.body)
     res.json({
        message:"updated successfully"
     })
})
router.get("/profile",authmiddleware,async (req,res)=>{
    const user = await User.findOne({_id: req.userId})
    res.json(user)
})
module.exports = router;
