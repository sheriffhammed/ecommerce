const morgan = require('morgan')
const cookieParser = require('cookie-parser');
const express = require('express')
const verifyJWT = require('./middleware/verifyJWT');
const app = express()
const productRouteJson = require('./routes/productRouteJson')
const productRoute = require('./routes/productsRoute')
const categoryROute = require('./routes/categoryRoute')
const orderItemRoute = require('./routes/orderItemRoute')
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
//OrderItem routes
app.use('/orderitem', orderItemRoute)

//Order routes
app.use('/order', orderRoute)

//Category routes
app.use('/category', categoryROute)
app.use('/category/:id', productRoute)

//Product routes
app.use('/product', productRoute)
app.use('/product/:id', productRoute)

//Product routes with Json file
app.use('/productjson', productRouteJson)
app.use('/productjson/:id', productRouteJson)

module.exports = app