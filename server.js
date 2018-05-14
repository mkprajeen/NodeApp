var express = require('express')
var bodyParser = require('body-parser')

var app = express()

var http = require('http').Server(app)
var io = require('socket.io')(http)

var mongoose = require('mongoose')

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

var dbUrl = 'mongodb://user:user@ds119800.mlab.com:19800/nodetestdb'

var Message = mongoose.model('Message',{
    name:String,
    message:String
})



app.get('/message', (req, res) => {
    Message.find({},(err,message)=>{
        res.send(message)
    })
   
})

app.get('/message/:user', (req, res) => {
    var user= req.params.user
    Message.find({name: user},(err,message)=>{
        res.send(message)
    })
   
})


app.post('/message', (req, res) => {
    var message = new Message(req.body)
    message.save((err)=>{
        if(err)
            sendStatus(500)
           
            io.emit('message', req.body)
            res.sendStatus(200)
    })

   
})

io.on('connection', (socket) => {
    console.log('a user connected')
})

mongoose.connect(dbUrl)
// mongoose.connect(dbUrl,(err) => {
//     console.log('mong db connection error', err)
// })

var server = http.listen(3000, () => {
    console.log('server is listening on port', server.address().port)
})