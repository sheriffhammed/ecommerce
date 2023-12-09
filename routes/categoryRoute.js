const express = require('express')
const router = express.Router()
const checkRole = require('../middleware/checkRole')

//const {addCategory} = require('../controllers/categoriesController')
const categoryController = require('../controllers/categoriesController')
router.route('/')
    .post(checkRole(["Admin"]),categoryController.addCategory)
    .get(checkRole(["Admin"]),categoryController.selectAllCategories)

router.route('/:id')
    .get(checkRole(["Admin"]),categoryController.selectOneCategory)
    .delete(checkRole(["Admin"]),categoryController.deleteCategory)
    .put(checkRole(["Admin"]),categoryController.updateCategory)


module.exports = router