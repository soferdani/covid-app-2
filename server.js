const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const api = require('./server/Routes/api')
const moment = require('moment')


const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/User', { useNewUrlParser: true, useUnifiedTopology: true })


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'dist')))
app.use(express.static(path.join(__dirname, 'node_modules')))
app.use('/', api)


const port = process.env.PORT || 3000 

app.listen(port, function (err, res) {
    console.log('server running on port ' + port);
})


