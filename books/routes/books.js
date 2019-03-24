  
const express = require('express');
const router = express.Router();
const books = require('../controller/books')
 

router.route('/').get(books.findAll)
router.route('/:id').get(books.findOne)
router.route('/create').post(books.create)
router.route('/update/:id').post(books.update)
router.route('/:id').delete(books.delete)

module.exports = router;