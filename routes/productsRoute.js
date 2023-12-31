const express = require('express')
const router = express.Router()
const checkRole = require('../middleware/checkRole')
const productsController = require('../controllers/productsController')

router.route('/')
    .post(checkRole(["Admin"]),productsController.addProduct)
    .get(checkRole(["Admin","User"]),productsController.selectAllProducts)

router.route('/:id')
    .get(checkRole(["Admin","User"]),productsController.selectOneProduct)
    .delete(checkRole(["Admin"]),productsController.deleteProduct)
    .put(checkRole(["Admin"]),productsController.updateProduct)

router.route('/count/productbycategory')
    .get(checkRole(["Admin"]),productsController.countProducts)

router.route('/get/featured')
    .get(checkRole(["Admin","User"]),productsController.featuredProducts)

router.route('/search/name')
    .get(checkRole(["Admin","User"]),productsController.searchProducts)
    

module.exports = router