const { where } = require('sequelize')
const db = require('../models')
const Category = db.Category
const User = db.User

const Validator = require("fastest-validator")


//Retreive All Categories
const selectAllCategories = async(req, res) =>{
    try {
        const categories = await Category.findAll({ include : [User] })
        //const categories = await User.findAll()
        //const users = await User.findAll()
        //console.log(JSON.stringify(users, null, 2));
        if(res.status(200) && categories){
            res.status(200).json({data: categories}, null, 2)
            console.log(JSON.stringify(categories, null, 2));
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

//Retreive One Category
const selectOneCategory = async(req, res) => {
    const id = req.params.id
    try {
          
        const response = await category.findByPk(id)
        if(res.status(200) && response){
            res.status(200).json({data: response})
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
//Delete Category
const deleteCategory = async(req, res) =>{
    const id = req.params.id
    try {
        
        const response = await category.destroy({ where: { id: id } })
        if(res.status(200) && response){
            res.status(200).json({message: `Category with ID ${id} deleted successfully`})
        }else{
            res.status(400).json({message: `No Category found with ID ${id}`})
        }
    } catch (error) {
        res.status(500).json({
            message: "Sorry something went wrong, Category couldnot be deleted",
            error: error.message
        })
    }
}
//Update Record
const updateCategory = async(req, res) =>{
    const id = req.params.id
    try {
        const data = {
            name: req.body.name,
            color: req.body.color,
            icon: req.body.icon,
            image: req.body.image,
            userId: req.body.userId
        }
        const validatorData = new Validator();

        const schema = {
            name: { type: "string", min: 3, max: 255 },
            color: { type: "string" },
            icon: { type: "string", min: 3, max: 255 },
            image: { type: "string" },
            userId: {type: "number", integer: true, positive: true}
        };

        const check = validatorData.compile(schema);
        // if(!check(data))
        //     return res.status(400).json({ errors: check(data) })

        if (check(data) !== true) {
            return res.status(400).json({ errors: check(data) })
        }
        
        const response = await category.update(req.body, 
            {where :{id:id}
            
        })
        //if(!response) return res.status(400).json({message: `Error Occured!!! Category Could not be Updated because no record found with ID ${id}`})
        //console.log("Response Result ", response)
        if (res.status(200) && response[0] > 0) {
            res.status(200).json({
                message: "Category Updated successfully",
                post:data
            })
        } else {
            return res.status(400).json({message: `Error Occured!!! Category Could not be Updated because no record found with ID ${id}`})
        }
        
    } catch (error) {
        res.status(500).json({
            message: "Category could not be Updated - Something went wrong",
            error: error.message
            })
    }

}

//Add Category
const addCategory = async(req, res) => {
    console.log("Request params ", req.body)
    try {
        const data = {
            name: req.body.name,
            color: req.body.color,
            icon: req.body.icon,
            image: req.body.image,
            userId: req.body.userId,
            dateCreated: req.body.dateCreated
        }
        const validatorData = new Validator();

        const schema = {
            name: { type: "string", min: 3, max: 255 },
            color: { type: "string" },
            icon: { type: "string", min: 3, max: 255 },
            image: { type: "string" },
            userId: {type: "number", integer: true, positive: true},
            dateCreated: {
                type: "date",
                default: (schema, field, parent, context) => new Date()
            }
        };

        const check = validatorData.compile(schema);
        // if(!check(data))
        //     return res.status(400).json({ errors: check(data) })

        if (check(data) !== true) {
            return res.status(400).json({ errors: check(data) })
        }

        const response = await Category.create(data)
        if (res.status(201) && response) {
            res.status(201).json({
                message: "Category Created successfully",
                post:data
            })
        } else {
            res.status(404).json({
                message: "Error Occured!!! Category Could not be Created"
            })
        }
        
    } catch (error) {
        res.status(500).json({
            message: "Category could not be Created - Something went wrong",
            error: error.message
            })
    }
}


module.exports = {
    addCategory,
    selectAllCategories,
    selectOneCategory,
    deleteCategory,
    updateCategory
}