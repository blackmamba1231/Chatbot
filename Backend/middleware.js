const jWT_Secret = require("./config");
const jwt = require("jsonwebtoken");

const authmiddleware = (req,res,next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(403).json({
        });
    }
    const token = authHeader.split(' ')[1];

    try{
        const decoded = jwt.verify(token, jWT_Secret);
        req.userId = decoded.userId;
        next();
    }catch(err){
        return res.status(403).json({});
    }
    };
    module.exports = {
        authmiddleware
    }