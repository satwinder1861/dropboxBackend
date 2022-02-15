const passport = require('passport');
const LocalStrategy =require('passport-loacal').Strategy;
const User = require('./user');
passport.use(new LocalStrategy({usernameField:'email'},async (username,password,done)=>{
 try{
    const user = await User.findOne({username}).lean();
    if(!user){
        return res.json({status:'error',error:'Invalid username/password'})
    }
     if(await bcrypt.compare(password,user.password)){
 
         const token = jwt.sign({id:user._id,username:user.username},JWT_SECRET);
 
         return res.json({status:'ok',data:token})
     }
 }   catch(err){
     return done(err);
 }
}));
module.exports={
    intialize:passport.initialize(),
    session:passport.session(),
    setUser:(req,res,next)=>{
    res.locals.user = req.user;
    return next();
},
};
