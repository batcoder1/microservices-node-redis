 
const customers = require('./customers');
 

module.exports = function (router) {
     router.use('/customers', customers);
 
}


