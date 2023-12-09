const { where } = require('sequelize')
const { Op } = require("sequelize");
const db = require('../models')
const Product = db.Product
const Category = db.Category

const Validator = require("fastest-validator")
const category = require('../models/category')


//Retreive All Products
const selectAllProducts = async(req, res) =>{
    let filter = {};
    if (req.query.categoryId) {
        filter = { categoryid: req.query.categoryId.split(',') };
    }
    try {
        const products = await Product.findAll({
            where : filter,
            include: [{
                model: Category,
                attributes: ['name','color']
            }] })
        if(res.status(200) && products){
            res.status(200).json({data: products}, null, 2)
           // console.log(JSON.stringify(products, null, 2));
        }else{
            res.status(400).json({message: "No Record Found, Please try again"})
        }
       
    } catch (error) {
        res.status(500).json({
            message: "No record Found, Something went wrong please try again",
            error: error.message
        })
    }
}

//Retreive One Product
const selectOneProduct = async(req, res) => {
    const id = req.params.id
    try {
        const product = await Product.findByPk(id, 
            {
                include: [{
                    model: Category,
                    attributes: ['name','color']
                }]
            })
        if(res.status(200) && product){
            res.status(200).json({data: product})
        }else{
            res.status(400).json({message: "No Record with that ID found, please check the Id and try again"})
        }
    } catch (error) {
        res.status(500).json({
            message: "No Record found, something went wrong",
            error: error.message
        })
    }
}
//Delete Product
const deleteProduct = async(req, res) =>{
    const id = req.params.id
    try {
        
        const product = await Product.destroy({ where: { id: id } })
        if(res.status(200) && product){
            res.status(200).json({message: `Product with ID ${id} deleted successfully`})
        }else{
            res.status(400).json({message: `No Product found with ID ${id}`})
        }
    } catch (error) {
        res.status(500).json({
            message: "Sorry something went wrong, Product couldnot be deleted",
            error: error.message
        })
    }
}
//Update Record
const updateProduct = async(req, res) =>{
    const id = req.params.id
    try {
        const data = {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: req.body.image,
            images: req.body.images,
            brand: req.body.brand,
            price: req.body.price,
            categoryId: req.body.categoryId,
            countInStock: req.body.countInStock,
            rating: req.body.description,
            isFeatured: req.body.isFeatured
        }
        const validatorData = new Validator();

        const schema = {
            name: { type: "string", min: 3, max: 255 },
            description: { type: "string" },
            richDescription: { type: "string"},
            image: { type: "string" },
            images: { type: "string" },
            brand: { type: "string" },
            price: {type: "number", integer: true, positive: true},
            categoryId: {type: "number", integer: true, positive: true},
            countInStock: {type: "number", integer: true, positive: true},
            rating: { type: "string" },
            isFeatured: { type: "boolean" }
        };

        const check = validatorData.compile(schema);
        // if(!check(data))
        //     return res.status(400).json({ errors: check(data) })

        if (check(data) !== true) {
            return res.status(400).json({ errors: check(data) })
        }
        
        const product = await Product.update(req.body, 
            {where :{id:id}
            
        })
        //if(!response) return res.status(400).json({message: `Error Occured!!! Category Could not be Updated because no record found with ID ${id}`})
        //console.log("Response Result ", response)
        if (res.status(200) && product[0] > 0) {
            res.status(200).json({
                message: "Product Updated successfully",
                post:data
            })
        } else {
            return res.status(400).json({message: `Error Occured!!! Product Could not be Updated because no record found with ID ${id}`})
        }
        
    } catch (error) {
        res.status(500).json({
            message: "Product could not be Updated - Something went wrong",
            error: error.message
            })
    }

}

//Add Product
const addProduct = async(req, res) => {
    //console.log("Request params ", req.body)
    try {
        const data = {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: req.body.image,
            images: req.body.images,
            brand: req.body.brand,
            price: req.body.price,
            categoryId: req.body.categoryId,
            countInStock: req.body.countInStock,
            rating: req.body.description,
            isFeatured: req.body.isFeatured
            
        }
        const validatorData = new Validator();

        const schema = {
            name: { type: "string", min: 3, max: 255 },
            description: { type: "string" },
            richDescription: { type: "string"},
            image: { type: "string" },
            images: { type: "string" },
            brand: { type: "string" },
            price: {type: "number", integer: true, positive: true},
            categoryId: {type: "number", integer: true, positive: true},
            countInStock: {type: "number", integer: true, positive: true},
            rating: { type: "string" },
            isFeatured: { type: "boolean" }
        };

        const check = validatorData.compile(schema);
        // if(!check(data))
        //     return res.status(400).json({ errors: check(data) })

        if (check(data) !== true) {
            return res.status(400).json({ errors: check(data) })
        }

        const product = await Product.create(data)
        if (res.status(201) && product) {
            res.status(201).json({
                message: "Product Created successfully",
                post:data
            })
        } else {
            res.status(404).json({
                message: "Error Occured!!! Product Could not be Created"
            })
        }
        
    } catch (error) {
        res.status(500).json({
            message: "Product could not be Created - Something went wrong",
            error: error.message
            })
    }
}

//Count Products
const countProducts = async(req, res) => {
    let filter = {};
    if (req.query.categoryId) {
        filter = { categoryid: req.query.categoryId.split(',') };
    }
    const { count, rows } = await Product.findAndCountAll({
        //where: {categoryId: 1}
        where : filter
    });
    res.send({
        productcount : count
    })
    //   console.log("Count All Products :", count);
    //   console.log("Count Row of All Products :", rows);
}

//Retreive Products with Featured
const featuredProducts = async(req, res) => {
    try {
        const products = await Product.findAll({
            where : {isFeatured : true},
            include: [{
                model: Category,
                attributes: ['name','color']
        }] })
        if(res.status(200) && products){
            res.status(200).json({data: products}, null, 2)
            console.log(JSON.stringify(products, null, 2));
        }else{
            res.status(400).json({message: "No Record Found, Please try again"})
        }
       
    } catch (error) {
        res.status(500).json({
            message: "No record Found, Something went wrong please try again",
            error: error.message
        })
    }   
}

//Search Products
const searchProducts = async(req, res) => {
    const productname = req.query.productname
    try {
        const products = await Product.findAll({
            where: {
                name: 
                    { [Op.like]: `%${productname}%` }
                },
            include: [{
                    model: Category,
                    attributes: ['name','color']
            }]
        })
        if(res.status(200) && products){
            res.status(200).json({data: products}, null, 2)
            console.log(JSON.stringify(products, null, 2));
        }else{
            res.status(400).json({message: "No Record Found, Please try again"})
        }
       
    } catch (error) {
        res.status(500).json({
            message: "No record Found, Something went wrong please try again",
            error: error.message
        })
    }   
}

module.exports = {
    addProduct,
    selectAllProducts,
    selectOneProduct,
    deleteProduct,
    updateProduct,
    countProducts,
    featuredProducts,
    searchProducts
}