 
const books = require('./books');
 

module.exports = function (router) {
     router.use('/books', books);
 
}


