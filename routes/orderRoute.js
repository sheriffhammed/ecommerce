const express = require('express')
const router = express.Router()
const checkRole = require('../middleware/checkRole')

const orderController = require('../controllers/orderController')

router.route('/')
    .post(checkRole(["Admin","User"]),orderController.addOrder)
    .get(checkRole(["Admin","User"]),orderController.selectAllOrder)

router.route('/:id')
    .get(checkRole(["Admin"]),orderController.selectOneOrder)
    .delete(checkRole(["Admin"]),orderController.deleteOrder)
    

router.route('/count/userorders')
    .get(checkRole(["Admin"]),orderController.countUserOrders)

router.get('/get/salesorder', checkRole(["Admin"]),orderController.sales)
    

module.exports = router