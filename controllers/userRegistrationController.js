const db = require('../models')
const userModel = db.User
const bcrypt = require('bcrypt')
const Validator = require("fastest-validator")

const handleUserRegisteration = async (req, res) => {
    console.log("Request params ", req.body)
    const passwordHash = await bcrypt.hash(req.body.password, 10)
    try {
        const data = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: passwordHash,
            street: req.body.street,
            aprtment: req.body.aprtment,
            city: req.body.city,
            zip: req.body.zip,
            country: req.body.country,
            phone: req.body.phone,
            roleId : req.body.roleId
        }
        //User Validations
        const validatorData = new Validator();

        const schema = {
            firstName: { type: "string" },
            lastName: { type: "string" },
            email: { type: "email" },
            password: { type: "string" },
            street: { type: "string" },
            aprtment: { type: "string" },
            city: { type: "string" },
            zip: { type: "string" },
            country: { type: "string" },
            phone: { type: "string" },
            roleId: {type: "number", integer: true, positive: true},
        };

        const check = validatorData.compile(schema);
        if (check(data) !== true) {
            return res.status(400).json({ errors: check(data) })
        }
        //Check if User Exist before creating
        const checkUser = await userModel.findOne({where : { email : req.body.email}})
        if(checkUser) return res.status(409).json({message : `User with this Email ${req.body.email} already Exist!`})

        //Create New User
        const response = await userModel.create(data)
        if (res.status(201) && response) {
            res.status(201).json({
                message: "User Created successfully",
                post:data
            })
        } else {
            res.status(404).json({
                message: "Error Occured!!! User Could not be Created"
            })
        }
        
    } catch (error) {
        res.status(500).json({
            message: "User could not be Created - Something went wrong",
            error: error.message
            })
    }
}

module.exports = { handleUserRegisteration }