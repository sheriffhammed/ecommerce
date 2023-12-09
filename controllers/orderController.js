const { where } = require('sequelize')
const moment = require('moment');
const { Op } = require("sequelize");
const { Sequelize } = require('sequelize')
const db = require('../models')
const Order = db.Order
const OrderItem = db.OrderItem
const Product = db.Product
const User = db.User
const Validator = require("fastest-validator")

//Retreive All Orders
const selectAllOrder = async(req, res) =>{
    let filter = {};
    if (req.query.id) {
        filter = { id: req.query.id.split(',') };
    }
    try {
        const orders = await Order.findAll(
            {
            where : filter,
            attributes: { exclude: ['id','orderItems','dateCreated','updatedAt','userId'] },
            include: [
                {
                    model: User,
                    attributes: ['firstName','lastName','email']
                },
                {
                model: OrderItem,
                attributes: ['quantity','productId'],
                include: [{
                    model: Product,
                    attributes: [
                        'name'
                        ,'price'
                        ,[Sequelize.literal('(`orderItems`.quantity * price)'), 'Amount']
                    ]                    
                }]
            }] }
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

//Retreive One Order
const selectOneOrder = async(req, res) => {
    const id = req.params.id
       
       try {
        const order = await Order.findByPk(id,
            {
            
                attributes: { exclude: ['id','orderItems','dateCreated','updatedAt','userId'] },
                include: [
                    {
                        model: User,
                        attributes: ['firstName','lastName','email']
                    },
                    {
                    model: OrderItem,
                    attributes: ['quantity','productId'],
                    include: [{
                        model: Product,
                        attributes: [
                            'name'
                            ,'price'
                            ,[Sequelize.literal('(`orderItems`.quantity * price)'), 'Amount']
                        ]                    
                    }]
                }] }
            )
        if(res.status(200) && order){
            res.status(200).json({data: order}, null, 2)
            console.log(JSON.stringify(order, null, 2));
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
//Delete Order
const deleteOrder = async(req, res) =>{
    const id = req.params.id
    try {
        const orderItems = await OrderItem.destroy({ where: { orderId: id } })
        if(res.status(200) && orderItems){
                const order = await Order.destroy({ where: { id: id } })
                if(res.status(200) && order)
                    res.status(200).json({message: `Order with ID ${id} deleted successfully`})
        }else{
                res.status(400).json({message: `No Order found with ID ${id}`})
        }
    } catch (error) {
        res.status(500).json({
            message: "Sorry something went wrong, Order couldnot be deleted",
            error: error.message
        })
    }
}

//Add Order
const addOrder = async(req, res) => {
   // console.log("Request params ", req.body)
    try {
        let {
            shippingAddress,
            shippingAddress2,
            city,
            zip, 
            country,
            phone, 
            status,
            userId, 
            productItems} = req.body;

        let totalPrice = 0;

        //Create New Order
        const newOrder = await Order.create({
            shippingAddress,
            shippingAddress2,
            city,
            zip, 
            country,
            phone, 
            status,
            userId, 
            productItems})

        //Get New Order Id
        const newOrderId = await Order.findOne({
            where : {userId : userId},
            order: [['updatedAt', 'DESC' ]],
            attributes: ['id']         
         })
         //console.log("New Order Id :" , newOrderId.id)
         if (newOrderId.id > 0) {
            productItems.forEach(async (p) => {
               //let data = await database.table('products').filter({id: p.id}).withFields(['quantity']).get();
               let numberInStock = await Product.findOne({
                where : {id : p.id},
                attributes: ['countInStock','price']
            })
               let inCart = parseInt(p.inCart);
               
              // Deduct the number of pieces ordered from the quantity in database
                // console.log(`Number in Stocks `, numberInStock.countInStock)
                // console.log(`Number in cart `, parseInt(p.inCart))
                // console.log(`Product Price `, numberInStock.price)
                if (numberInStock.countInStock > 0) {
                    numberInStock.countInStock = numberInStock.countInStock - inCart;
                    //console.log('Number In stock after deduction :', numberInStock.countInStock)
                    
                } else {
                    numberInStock.countInStock = 0;
                    inCart = 0;
                }
                let price = parseInt(p.inCart) * numberInStock.price
               // console.log(`Price for each product Ordered `, price)
                totalPrice += price
                // Insert order details w.r.t the newly created order Id
                const orderItems = await OrderItem.create({
                    orderId: newOrderId.id,
                    productId: p.id,
                    quantity: inCart
                })
                if(res.status(201) && orderItems){
                    //console.log(JSON.stringify(orderItems, null, 2));
                }
                else{
                    console.log('Order Items Could not be created')
                }
                //Update Quantity in Product table
                const product = await Product.update(
                    {countInStock: numberInStock.countInStock}, 
                    {where : {id : p.id}}
                    )
                if (res.status(200) && product[0] > 0) {
                     //console.log("Product Updated successfully")                        
                    }
                 else {
                    return res.status(400).json({message: `Error Occured!!! Product Could not be Updated because no record found with ID ${id}`})
                }
                //Insert the total price of products order
                const updateTotalPrice = await Order.update(
                    {totalPrice: parseInt(totalPrice)},
                    {where : {id : newOrderId.id}}          
                    
                )
                if (res.status(200) && updateTotalPrice[0] > 0) {
                    console.log("Total Price:", totalPrice)                        
                }
                           
            });
            
            
        } else {
            res.json({message: 'New order failed while adding order details', success: false});
        }
        
        if (res.status(201) && newOrder) {
            res.status(201).json({
                message: `Order successfully placed with order id ${newOrderId.id}`,
                success: true,
                order_id: newOrderId.id,
                products: productItems
            })
        } else {
            res.status(404).json({
                message: "Error Occured!!! Order Could not be Creted"
            })
        }
        
    } catch (error) {
        res.status(500).json({
            message: "Order Could not be created - Something went wrong",
            error: error.message
            })
    }
}

//Count Orders
const countUserOrders = async(req, res) => {
    let filter = {};
    if (req.query.userId) {
        filter = { userId: req.query.userId.split(',') };
    }
    const userOrder = await Order.findAll({
        where : filter,
        attributes: [
             
             [Sequelize.fn('count', Sequelize.col('userId')), 'count'],
             [Sequelize.fn('sum', Sequelize.col('totalPrice')), 'totalPrice']
        ]
        });
      res.send({
        userOrders : userOrder
      })
    
}

//Sales Orders
const sales = async(req, res) => {
    let filter = {};

    // if (req.query.salesDate) {
    //     filter = { updatedAt: req.query.salesDate.split(',') };
    // }
    const salesOrder = await Order.findAll({
        //where : filter,
        
        //where : {updatedAt : moment(updatedAt).format('DD-MM-YYYY')},
        attributes: [
             
             [Sequelize.fn('count', Sequelize.col('id')), 'count'],
             [Sequelize.fn('sum', Sequelize.col('totalPrice')), 'totalPrice']
        ]
        });
      res.send({
        salesOrder : salesOrder
      })
    
}


module.exports = {
    addOrder,
    selectAllOrder,
    selectOneOrder,
    deleteOrder,
    countUserOrders,
    sales
}