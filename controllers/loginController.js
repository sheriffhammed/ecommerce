const db = require('../models')
const userModel = db.User
const Role = db.Role
const bcrypt = require('bcrypt')
require('dotenv').config()
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    const {email, password} = req.body
    if (!email || !password) return res.status(400).json({ 'message': 'Username and password are required.' });
    
    //Retreive User with the crrdentials from Database
    //const retreiveUser = await userModel.findOne({where : {email : email}})
    const retreiveUser = await userModel.findOne({where:{email: email},
        include: [
        {
          model: Role
        },
      ]})

    if(!retreiveUser) return res.status(401).json({message : "Unauthorised User"})
    const userAllPermissions = await retreiveUser.Role.getUserPermissions();
    const perms = userAllPermissions? userAllPermissions.map(permission => permission.perm_name) : "";
    
    const passwordMatch = await bcrypt.compare(password, retreiveUser.password)
    if(passwordMatch){
       // create JWTs
        const {id, firstName, lastName,email, Role}  = retreiveUser
        const jwtUserDetails = { id, firstName, lastName, email, Role, permissions : perms }
        console.log("jwtUserProfile created", jwtUserDetails)
        const accessToken = jwt.sign(
            { "userDetails": jwtUserDetails },
            process.env.ACCESS_TOKEN_KEY,
            { expiresIn: '60s' }
        );
        const refreshToken = jwt.sign(
            { "userDetails": jwtUserDetails },
            process.env.REFRESH_TOKEN_KEY,
            { expiresIn: '1d' }
        );
        //Save Refresh Token against User Login Details in database
        const addRefreshToken = await userModel.update({refreshToken}, 
            {where :{email : retreiveUser.email} }
        ) 
        //console.log("addRefreshToken Result ", addRefreshToken)
        if(addRefreshToken[0] === 0)            
            return res.status(400).json({message: `Refresh Token Could not be added to database`})
        
        res.cookie('refreshToken', refreshToken, { 
            httpOnly: true, 
            sameSite: 'None', 
            secure: true, 
            maxAge: 24 * 60 * 60 * 1000 });
        res.json({ accessToken });
    } else {
        res.status(401).json({message : "Invalid Password"});
    }
    
}

module.exports = { handleLogin }