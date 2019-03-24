const Customer = require('../model/Customer');
/*
 * Create new customer
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.create = async (req, res) => {
    try {
        
      if (!req.body.name ||
        !req.body.birthdate ||
        !req.body.address) {  
        throw  'BRP'
      }
      const customer = new Customer ({
        name: req.body.name,
        birthdate:  new Date(req.body.birthdate),
        address: req.body.address,
      })
  
      await customer.save();

      return res.status(200).send()
    } catch (err) {
        return handler(err, req, res);
    }
  };
 
/**
 * FindAll
 * Retrieve and return all customer (admin purpose)
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.findAll = async (req, res) => {
    try {

        const customers = await Customer.find();
        res.send(customers);

    } catch (err) {
        console.log('findAll %s', err)
        return handler(err, req, res);
    }
};

/**
 * FindOne
 * Find a single customer by id
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.findOne = async (req, res) => {
    try {
        console.log(req.params.id)
         
        let customer = await Customer.findById(req.params.id);
        if (!customer) {
            throw "B001"
        }
        
        res.send(customer);

    } catch (err) {
        console.log('customer findOne Error: %s', err)
        console.log('req.params.id: %s', req.params.id)
        return handler(err, req, res)
    }
};


/**
 * Update
 * Update customer data
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.update = async (req, res) => {
    try {
        
        if (!req.params.id) {
            throw 'BRP'
        }
        
        const customerId = req.params.id;
        let customerInfo = req.body;
 
 
        Customer.findByIdAndUpdate(customerId, customerInfo)
        const customer = await Customer.findById(customerId)
        res.send(customer);

    } catch (err) {
        console.log('update %s', err)
        return handler(err, req, res);
    }
};
 
/**
 * Delete
 * delete customer
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.delete = async (req, res) => {
    try {

        if (!req.params.id) {
            throw 'BRP'
        }
      
        await Customer.findOneAndDelete(req.params.id)
 

        return res.status(200).send({
            message: "Customer has been deleted"
        });
    } catch (err) {
        console.log('customer delete error %s', err)
        return handler(err, req, res);
    }

};

async function updateBalance(order,redis){
    try{
        console.log('updateBalance.....', order)
        const customer = await Customer.findById(order.customerID);

        if (order.price > customer.balance.amount){
            const error = {
                code: 'C002', 
                message: 'Do not have enough funds',
                order
            }
            throw error
        }

        const query  = {
            '_id': order.customerID
        }
        const update = {
            $inc: {'balance.amount': - order.price }
        }       
        await Customer.updateOne(query, update);
        console.log('balance updated')
        redis.emit('closingOrder', order)
    
    }catch (err){
        redis.emit('rollback_order', err)

    }

}
exports.updateBalance = updateBalance;
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