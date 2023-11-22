const http = require('http')
const app = require('./app')
require('dotenv/config')
const port = process.env.PORT
const server = http.createServer(app)
const db = process.env.dbConnectionString

server.listen(port, ()=>{
    //console.log(db)
    console.log(`Server runiing on port : ${port}`)
})


