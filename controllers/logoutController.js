const db = require('../models')
const userModel = db.User
const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleLogout = async (req, res) => {
    // On client, also delete the accessToken
    const cookies = req.cookies;
    if (!cookies?.refreshToken) return res.sendStatus(204); //No content
    const refreshToken = cookies.refreshToken;

    //Retreive User with the credentials from Database
    const retreiveUser = await userModel.findOne({where : {refreshToken : refreshToken}})
    if (!retreiveUser) {
        res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(204);
    }

    // Delete refreshToken in db
    const deleteRefreshToken = await userModel.update({refreshToken : ''}, 
        {where :{refreshToken : refreshToken} }
    ) 

    res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'None', secure: true });
    res.sendStatus(204);
}

module.exports = { handleLogout }