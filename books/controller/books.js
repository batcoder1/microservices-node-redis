const Book = require('../model/Book.js');

/*
 * Create new book
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.create = async (req, res) => {
    try {
        console.log (req)
      if (!req.body.title ||
        !req.body.author ||
        !req.body.numberPages ||
        !req.body.publisher) {  
        throw  'BRP'
      }
      const book = new Book ({
        title: req.body.title,
        author: req.body.author,
        numberPages: req.body.numberPages,
        publisher: req.body.publisher,
      })
  
      await book.save();

      return res.status(200).send()
    } catch (err) {
        return handler(err, req, res);
    }
  };
 
/**
 * FindAll
 * Retrieve and return all book (admin purpose)
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.findAll = async (req, res) => {
    try {

        const books = await Book.find();
        res.send(books);

    } catch (err) {
        console.log('findAll %s', err)
        return handler(err, req, res);
    }
};

/**
 * FindOne
 * Find a single book by id
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.findOne = async (req, res) => {
    try {
        console.log(req.params.id)
         
        let book = await Book.findById(req.params.id);
        if (!book) {
            throw "B001"
        }
        
        res.send(book);

    } catch (err) {
        console.log('book findOne Error: %s', err)
        console.log('req.params.id: %s', req.params.id)
        return handler(err, req, res)
    }
};


/**
 * Update
 * Update book data
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.update = async (req, res) => {
    try {
        
        if (!req.params.id) {
            throw 'BRP'
        }
        
        const bookId = req.params.id;
        let bookInfo = req.body;
 
 
        Book.findByIdAndUpdate(bookId, bookInfo)
        const book = await Book.findById(bookId)
        res.send(book);

    } catch (err) {
        console.log('update %s', err)
        return handler(err, req, res);
    }
};
 
/**
 * Delete
 * delete book
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.delete = async (req, res) => {
    try {

        if (!req.params.id) {
            throw 'BRP'
        }
      
        await Book.findByIdAndRemove(req.params.id)
 

        return res.status(200).send({
            message: "Book has been deleted"
        });
    } catch (err) {
        console.log('book delete error %s', err)
        return handler(err, req, res);
    }

};
async function updateStock(order){
    try{ 
        console.log('updateStock')
        const query = {
            '_id': order.bookID
        }
        const update = {
            $inc: {stock: -1 }
        }
        
        const book = await Book.findOneAndUpdate(query, update);

        let newOrder = JSON.parse(JSON.stringify(order));
        newOrder.price = book.price

        global.io.emit('updatingCustomerBalance', newOrder)

    }catch (err){
        throw err
    }

}
exports.updateStock = updateStock;

async function rollBackStock(order){
    try{ 
        const query = {
            '_id': order.bookID
        }
        const update = {
            $inc: {stock: 1 }
        }
        
        const book = await Book.findOneAndUpdate(query, update);

        let newOrder = JSON.parse(JSON.stringify(order));
        newOrder.price = book.price


    }catch (err){
        throw err
    }

}
exports.rollBackStock = rollBackStock;
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