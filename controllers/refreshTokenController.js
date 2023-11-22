const db = require('../models')
const userModel = db.User
const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.refreshToken) return res.status(401).json({message : "Unauthorised User"})
    const refreshToken = cookies.refreshToken;

    //Retreive User with the credentials from Database
    const retreiveUser = await userModel.findOne({where : {refreshToken : refreshToken}})
    if(!retreiveUser) return res.status(401).json({message : "Unauthorised User"})
    // evaluate jwt 
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_KEY,
        (err, decoded) => {
            // console.log('Refresh Token from Database:', retreiveUser.refreshToken)
            // console.log('Refresh Token from Cookies:', decoded.userDetails.refreshToken)
            // console.log('Error Message:', err)
            //if (err || (retreiveUser.refreshToken !== decoded.userDetails.refreshToken)) return res.status(403).json({message : "Invalid Refresh Token"});
            if (err) return res.status(403).json({message : "Invalid Refresh Token"});
            const accessToken = jwt.sign(
                { "userDetails": decoded.userDetails },
                process.env.ACCESS_TOKEN_KEY,
                { expiresIn: '60s' }
            );
            res.json({ accessToken })
        }
    );
}

module.exports = { handleRefreshToken }