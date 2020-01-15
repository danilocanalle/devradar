const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const routes = require('./routes')

mongoose.connect('mongodb+srv://omnistack:omnistack@cluster0-7busk.mongodb.net/week10?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})

const app = express();

app.use(cors({origin: 'http://localhost:3000'}))
app.use(express.json())
app.use(routes)

app.listen(3333);