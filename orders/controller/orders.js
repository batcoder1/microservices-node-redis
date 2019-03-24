const Order = require('../model/Order');
const mongoose = require("mongoose");
const axios = require("axios");

/*
 * Create new order
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.create = async (req, res) => {
    try {
      if (!req.body.bookID ||
        !req.body.customerID  ) {  
        throw  'BRP'
      }
      // today date + 7 days
      let dateWeekmore = new Date();
      dateWeekmore.setDate(dateWeekmore.getDate() + 7);

      const newOrder ={
        bookID: mongoose.Types.ObjectId(req.body.bookID),
        customerID: mongoose.Types.ObjectId(req.body.customerID),
        initialDate: new Date(),
        deliveryDate: dateWeekmore
      }
      const order = new Order (newOrder)
  
      const orderSaved =await order.save();
    
      console.log('sending data..')
      global.io.emit('book_sold', orderSaved)
      
      return res.status(200).send()
    } catch (err) {
        return handler(err, req, res);
    }
  };
 
/**
 * FindAll
 * Retrieve and return all order (admin purpose)
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.findAll = async (req, res) => {
    try {

        const orders = await Order.find();
        res.send(orders);

    } catch (err) {
        console.log('findAll %s', err)
        return handler(err, req, res);
    }
};

/**
 * FindOne
 * Find a single order by id
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.findOne = async (req, res) => {
    try {
         
        let order = await Order.findById(req.params.id);
        
        if (!order) {
            throw "R001"
        }
        const customerResponse = await axios.get(`http://localhost:5555/customers/${order.customerID}` )
        const bookResponse = await axios.get(`http://localhost:4545/books/${order.bookID}` )
        const orderObject = {
            customerName: customerResponse.data.name,
            bookTitle: bookResponse.data.title
        }
        res.send(orderObject);

    } catch (err) {
        console.log('order findOne Error: %s', err)
        return handler(err, req, res)
    }
};


/**
 * Update
 * Update order data
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.update = async (req, res) => {
    try {
        
        if (!req.params.id) {
            throw 'BRP'
        }
        
        const orderId = req.params.id;
        let orderInfo = req.body;
 
 
        Order.findByIdAndUpdate(orderId, orderInfo)
        const order = await Order.findById(orderId)
        res.send(order);

    } catch (err) {
        console.log('update %s', err)
        return handler(err, req, res);
    }
};
 
/**
 * Delete
 * delete order
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.delete = async (req, res) => {
    try {

        if (!req.params.id) {
            throw 'BRP'
        }
      
        await Order.findByIdAndRemove(req.params.id)
 

        return res.status(200).send({
            message: "Order has been deleted"
        });
    } catch (err) {
        console.log('order delete error %s', err)
        return handler(err, req, res);
    }

};

async function closeOrder(order){
    try {
        const query = {
            '_id': order._id
        }
        const update = {
            status: 'completed'
        }
        await Order.updateOne(query, update);

    } catch (error) {
        console.log(error)
    }

}
exports.closeOrder = closeOrder;
/**
 * Handler
 * Error handler
 * @param {*} err
 * @param {*} res
 * @returns code: err
 */
function handler(err, req, res) {
    console.log("body");
    console.log (req.body);
    console.log (err);

    if (err) {
        if (err.message) {
            return res.status(500).send({
                code: err.message
            });
        } else {
            return res.status(500).send({
                code: err
            });
        }
    }

    return res.status(500).send({
        code: "500",
        message: "Internal Server error"
    });
}