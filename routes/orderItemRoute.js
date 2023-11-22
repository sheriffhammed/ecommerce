const express = require('express')
const router = express.Router()

//const {addCategory} = require('../controllers/categoriesController')
const orderItemController = require('../controllers/orderItemController')
router.route('/')
    .post(orderItemController.addOrderItem)
    .get(orderItemController.selectAllOrderItem)

// router.route('/:id')
//     .get(productsController.selectOneProduct)
//     .delete(productsController.deleteProduct)
//     .put(productsController.updateProduct)

// router.route('/count/product')
//     .get(productsController.countProducts)

// router.route('/featured/product')
//     .get(productsController.featuredProducts)

// router.route('/search/product')
//     .get(productsController.searchProducts)


module.exports = router