  
const express = require('express');
const router = express.Router();
const customers = require('../controller/customers')
 

router.route('/').get(customers.findAll)
router.route('/:id').get(customers.findOne)
router.route('/create').post(customers.create)
router.route('/update/:id').post(customers.update)
router.route('/:id').delete(customers.delete)

module.exports = router;