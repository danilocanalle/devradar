const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const http = require('http')

const routes = require('./routes')
const {setupWebSocket} = require('./websocket')

mongoose.connect('mongodb+srv://omnistack:omnistack@cluster0-7busk.mongodb.net/week10?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})

const app = express()
const server = http.Server(app)

setupWebSocket(server)

app.use(cors({origin: 'http://localhost:3000'}))
app.use(express.json())
app.use(routes)

server.listen(3333)