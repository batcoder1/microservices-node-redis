  
const express = require('express');
const router = express.Router();
const orders = require('../controller/orders')
 

router.route('/').get(orders.findAll)
router.route('/:id').get(orders.findOne)
router.route('/create').post(orders.create)
router.route('/update/:id').post(orders.update)
router.route('/:id').delete(orders.delete)

module.exports = router;