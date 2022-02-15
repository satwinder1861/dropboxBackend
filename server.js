const express = require('express');
const mongoose = require('mongoose');
const app = express();
mongoose.connect('mongodb://localhost:27017/users'
,{
    useNewUrlParser:true,
    useUnifiedTopology:true,

})
.then((result) => app.listen(3000))
.catch((err) =>console.log(err));
app.post('/login', async(req,res) =>{
console.log("ok");
});