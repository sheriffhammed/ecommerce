const express = require('express')
const router = express.Router()

//const {addCategory} = require('../controllers/categoriesController')
const categoryController = require('../controllers/categoriesController')
router.route('/')
    .post(categoryController.addCategory)
    .get(categoryController.selectAllCategories)

router.route('/:id')
    .get(categoryController.selectOneCategory)
    .delete(categoryController.deleteCategory)
    .put(categoryController.updateCategory)


module.exports = router