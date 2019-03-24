 
const orders = require('./orders');
 

module.exports = function (router) {
     router.use('/orders', orders);
 
}


