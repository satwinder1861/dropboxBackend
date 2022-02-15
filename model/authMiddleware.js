const jwt = require('jsonwebtoken');
const User = require('./user');
const JWT_SECRET ='hshfdkasdhkfhaskhkdsafsadfsdahhlsfdshfahfdl';
const requireAuth =(req,res,next)=>{
    console.log(req.headers);
    const token = req.headers["x-access-token"];
    console.log(token);
    if (token){
 jwt.verify(token,JWT_SECRET,(err , decodedToken)=>{
    if (err){
        console.log(err.message);
        res.json('No token');
    } else{
        console.log(decodedToken);
        next();
    }
 })
    }
    else{
        res.json('No token');
    }
}


// check current user

const checkUser=(req,res,next)=>{
    const token = req.headers["x-access-token"];
    if (!token){
     return res.json({userlogin:"false",message:"Currently no user is logged in"});
    }
    else{
        jwt.verify(token,JWT_SECRET,async (err , decodedToken)=>{
            if (err){
                return res.send(err.message);
                next();
            } else{
                console.log(decodedToken);
                let user = await User.findById(decodedToken.id);
                res.json({userlogin:true,message:"user already have logged in",user:user.username});
                next();
           }
        })

    }
}
module.exports = {requireAuth,checkUser};