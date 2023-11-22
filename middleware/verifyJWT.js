const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({message : "Unauthorised Access"});
    console.log(authHeader); // Bearer token
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_KEY,
        (err, decoded) => {
            if (err) return res.status(403).json({message : "Invalid Token"}); //invalid token
            req.user = decoded.userDetails;
            //decoded.userDetails
            next();
        }
    );
}

module.exports = verifyJWT