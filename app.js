const morgan = require('morgan')
const cookieParser = require('cookie-parser');
const express = require('express')
const verifyJWT = require('./middleware/verifyJWT');
const app = express()
const productRoute = require('./routes/productsRoute')
const categoryROute = require('./routes/categoryRoute')
const orderRoute = require('./routes/orderRoute')
const userRegistrationRoute = require('./routes/userRegistrationRoute')
const loginRoute = require('./routes/loginRoute')
const refreshTokenRoute = require('./routes/refreshTokenRoute')
const logoutRoute = require('./routes/logoutRoute')

//Middlewares
app.use(express.json())
app.use(morgan('tiny'))
app.use(cookieParser());

//Users routes
app.use('/registration', userRegistrationRoute)
app.use('/login', loginRoute)
app.use('/logout', logoutRoute)
app.use('/refresh', refreshTokenRoute)

app.use(verifyJWT);

//Order routes
app.use('/order', orderRoute)
app.use('/order/:id', orderRoute)

//Category routes
app.use('/category', categoryROute)
app.use('/category/:id', productRoute)

//Product routes
app.use('/product', productRoute)
app.use('/product/:id', productRoute)

module.exports = app