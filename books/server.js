// books server
const express = require("express");
const app = express();
const router = express.Router();
const mongoose = require("mongoose");
const bodyParser = require('body-parser'); 
const controller = require('./controller/books')


const nodeIP = process.env.NODE_IP || 'localhost'
const host = `http://${nodeIP}`
const port = process.env.SERVER_PORT || 5544
const hostName = `http://${nodeIP}:${port}`


const server = require('http').Server(app)
const io = require('socket.io')(server)
const ioClient = require('socket.io-client')
const redisAdapter = require('socket.io-redis')
const redisServer = process.env.REDIS_SERVER || '127.0.0.1'
io.adapter(redisAdapter({ host: redisServer, port: 6379 }))
global.io = io;
 
// client socket
const socket = ioClient(hostName, { 'forceNew': true })
 
 
// server socket
io.on('connection', function (socket) {
  console.log(`Redis server ${redisServer}:6379 `)
   
  
})
socket.on('connect', async () => {
  console.log(`Redis client: ${host} connected`)
  
  socket.on('book_sold', (order) => {
    console.log(new Date() + ': Receiving book_sold...')
    controller.updateStock(order)
  })

  socket.on('rollback_order', (order) => {
    console.log(new Date() + ': Receiving book_sold...')
    controller.updateStock(order)
  })

  socket.on('node', (host) => {
    console.log(new Date() + ': node: ' + host)
  })
 
})
  

mongoose.set('useCreateIndex', true)
mongoose.set('useNewUrlParser', true)
const mongoURL = 'mongodb://user:user5599@ds119606.mlab.com:19606/bookservice'
mongoose.connect(mongoURL, function (err) {
    if (err) throw err
})
// If the connection throws an error
mongoose.connection.on('error', function (err) {
  console.log('Mongoose default connection error: ' + err)

  // Exit without error in order to restart docker container
  process.exit(0)
})
// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection disconnected')

  // Exit without error in order to restart docker container
  process.exit(0)
})
// If the Node process ends, close the Mongoose connection

process.on('SIGINT', function () {
  mongoose.connection.close(function () {
    console.log('Mongoose default connection disconnected through app termination')

    // Exit without error in order to restart docker container
    process.exit(0)
  })
})

mongoose.connection.once('open', function () {
  console.log('Connected to Book service mongodb...')
})
// parse application/json
app.use(bodyParser.json())
app.set('redis', io)

require('./routes/index')(router);

router.route('/').get(function(req, res, next) {
    res.json({
        "message": "bookservice"
    });
});
app.use('/', router);

server.listen(port, "0.0.0.0", () => {
    console.log(new Date())
});
 
exports.server = server;
