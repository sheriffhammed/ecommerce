const express = require('express')
const router = express.Router()

const {selectAllProducts,
    selectOneProduct,
    addProdcut,
    deleteProduct,
    updateProduct} = require('../controllers/productControllerJson')


router.route('/')
    .get(selectAllProducts)
    .post(addProdcut)

router.route('/:id')
    .get(selectOneProduct)
    .delete(deleteProduct)
    .put(updateProduct)


module.exports = router