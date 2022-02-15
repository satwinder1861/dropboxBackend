const express = require('express')
const fs = require('fs')
const multer = require('multer')
// const fileUpload =require('express-fileupload');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require ('bcryptjs')
const cookieParser = require('cookie-parser');

const app = express()
const port = 8080;
const jwt = require('jsonwebtoken')
const JWT_SECRET ='hshfdkasdhkfhaskhkdsafsadfsdahhlsfdshfahfdl';
app.use(bodyParser.json());
// app.use(fileUpload());
app.use(cookieParser());
app.use('/uploads',express.static('./uploads'))
const fileStorageEngine = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./uploads')
    },
    filename:(req,file,cb) => {
        // cb(null,Date.now()+'--'+file.originalname)
        cb(null,file.originalname)
    }
});
const upload = multer({storage:fileStorageEngine})
const{requireAuth,checkUser}= require('./model/authMiddleware');
const User = require('./model/user');
const Address = require('./model/address');
mongoose.connect('mongodb://localhost:27017/users'
,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    // useCreateIndex:true

}

)
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) =>{
    return jwt.sign({id},JWT_SECRET, {
        expiresIn: maxAge
    });
}
 app.get('/checkuser',checkUser);
app.post('/login', async(req,res) =>{
    console.log(req.body);
const{email,password}= req.body.signinValues;
    const user = await User.findOne({email}).lean();
   if(!user){
       return res.json({status:'error',error:'Invalid email/password'})
   }
    if(await bcrypt.compare(password,user.password)){
//  added lines
// const token = createToken(user._id);
// res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000});
        const token = jwt.sign({id:user._id,username:user.username},JWT_SECRET);

        return res.json({status:'ok',token:token})
    }
    return res.json({status:'error',error:'Invalid username/password'});
})

app.post('/register', async(req, res) => {
    const{username,email,password:plainTextPassword} = req.body.signupValues;

  const password =await bcrypt.hash(plainTextPassword,10);
  try{
const response = await User.create({
     username,
     email,
     password
 })
//  added lines
 const token = createToken(response._id);
 res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000});


 console.log("user created succcessfully",response._id);
  }catch(error){
      if (error.code === 11000){
      return res.json({status:'error',error:'Username already exists'});
  }
  throw error;
}
 res.json({status:'ok'});
})

app.post('/changepassword',async(req,res)=>{
    const{token , newpassword} = req.body;
    try{
   const user =  jwt.verify(token,JWT_SECRET);
   const hashedPassword = await bcrypt.hash(newpassword,10);
   const _id =user.id ;  
   await User.updateOne({_id},{
       $set:{password:hashedPassword}
   }) 
} catch(error){
        res.json({status:'error', error:'too many attempts'})
    }
    res.json({status:'ok'})
})

app.get('/content', async (req,res) =>{
    let image = await Address.find();
    res.json({imageUrl:image});
});
app.post('/profile', (req,res) =>{
  if (req.files === null){
return res.status(400).json({msg:'No file uploaded'});
  }
  const file =req.files.images;
  file.mv(`${__dirname}/uploads/${file.name}`,err =>{
      if(err){
          console.error(err);
          return res.status(500).send(err);
      }
      res.json({fileName:file.name,filePath:`uploads/${file.name}`});
  })
});
app.post('/single',upload.single('images'),async(req,res) =>{
    console.log(req.file.originalname);
    const name = req.file.originalname;
    const response = await Address.create({
        name
    })
res.send ("single file upload successfull");
  });


  app.post('/multiple',upload.array('images',5),(req,res) =>{
    
res.send ("multiple file upload successfull");
  });

app.get('/logout',requireAuth, (req,res) =>{
    res.cookie('jwt','',{maxAge:1});
})
app.get('/from', (req, res) => {
    res.redirect('www.google.com');
  });
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

