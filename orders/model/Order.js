const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
   
    customerID: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true
    },
    bookID: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true
    },
    initialDate: {
      type: Date,
      required: true
    },
  
    deliveryDate: {
      type: Date,
      required: true
    },
    price: Number,
    status: {
      type: String,
      enum: ['open', 'completed', 'failed', 'cancelled', 'rejected'],
      default: 'open',
      required: true
  }, 
 
})


module.exports = mongoose.model("Order", orderSchema)