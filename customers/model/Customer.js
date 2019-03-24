const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
   
    name: {
      type: String,
      required: true
    },
    birthdate: {
      type: Date,
      required: true
    },
    address: {
      type: String,
      required: false
    },
    balance: {
      amount: {
        type: Number,
        default: 0
      },
      currency: {
        type: String,
        default: '€'
      },
    },
    createdAt: Date,
    updatedAt: Date 
 
})


module.exports = mongoose.model("Customer", customerSchema)