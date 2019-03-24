const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
   
    title: {
      type: String,
      required: true
    },
    author: {
      type: String,
      required: true
    },
    numberPages: {
      type: String,
      required: false
    },
  
    publisher: {
      type: String,
      require: false 
    },
    stock: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: true
    },
    createdAt: Date,
    updatedAt: Date
 
})


module.exports = mongoose.model("Book", bookSchema)