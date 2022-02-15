const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  email:{type:String , required:true , unique: true},
  username:{type:String , required:true , unique: true},
  password:{type:String, required:true}
},{
    collection:'register'
})
const model = mongoose.model('userSchema', UserSchema);
module.exports = model ;