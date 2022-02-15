const mongoose = require('mongoose');
const AddressSchema = new mongoose.Schema({
  name:{type:String , required:true , unique: true}
},{
    collection:'img'
})
const Address = mongoose.model('addressSchema', AddressSchema);
module.exports = Address ;