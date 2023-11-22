const { where } = require('sequelize')
const { Op } = require("sequelize");
const { Sequelize } = require('sequelize')
const db = require('../models')
const Order = db.Order
const OrderItem = db.OrderItem
const Product = db.Product
const User = db.User
const Validator = require("fastest-validator")

//Retreive All Products
const selectAllOrder = async(req, res) =>{
    let filter = {};
    if (req.query.orderId) {
        filter = { cateorderIdgoryid: req.query.orderId.split(',') };
    }
    try {
        const orders = await OrderItem.findAll(
            {
                attributes: ['quantity','productId'],
                include: [{
                    model: Product,
                    attributes: [
                        'name'
                        ,'price'
                        ,[Sequelize.literal('(quantity * price)'), 'Amount']
                    ]                    
                },
                {
                    model: Order,
                    where : filter,
                    attributes: { exclude: ['id','orderItems','dateCreated','updatedAt','totalPrice','userId'] },
                    // attributes: [
                    //     'shippingAddress'
                    //     ,'shippingAddress2'
                    //     ,[Sequelize.fn('SUM', [Sequelize.literal('(`orderItems`.quantity * `products`.price)')]), 'Total Amount']
                    // ],                    
                    include: [
                        {
                            model: User,
                            attributes: ['firstName','lastName','email']
                        } 
                    ]
                }
            ]
            }
            )
        if(res.status(200) && orders){
            res.status(200).json({data: orders}, null, 2)
            console.log(JSON.stringify(orders, null, 2));
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
const addOrder = async(req, res) => {
    console.log("Request params ", req.body)
    try {
        const data = {
            shippingAddress: req.body.shippingAddress,
            shippingAddress2: req.body.shippingAddress2,
            city: req.body.city,
            zip: req.body.zip,
            country: req.body.country,
            phone: req.body.phone,
            status: req.body.status,
            totalPrice: req.body.totalPrice,
            userId: req.body.userId
                                    
        }
        const validatorData = new Validator();

        const schema = {
            shippingAddress: { type: "string" },
            shippingAddress2: { type: "string"},
            city: { type: "string" },
            zip: { type: "string" },
            country: { type: "string" },
            phone: { type: "string" },
            status: { type: "string" },
            totalPrice: {type: "number", integer: true, positive: true},
            userId: {type: "number", integer: true, positive: true},
            
        };

        const check = validatorData.compile(schema);
        // if(!check(data))
        //     return res.status(400).json({ errors: check(data) })

        if (check(data) !== true) {
            return res.status(400).json({ errors: check(data) })
        }

        const order = await Order.create(data)
        if (res.status(201) && order) {
            res.status(201).json({
                message: "Order Created",
                post:data
            })
        } else {
            res.status(404).json({
                message: "Error Occured!!! Order Could not be Creted"
            })
        }
        
    } catch (error) {
        res.status(500).json({
            message: "Order Could not be creates - Something went wrong",
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
    addOrder,
    selectAllOrder
}