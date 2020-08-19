const express = require('express')
const app = express()
const bodyParser = require('body-parser')


const time = require('./time.js')
const time_conv = require('./time-converter.js')

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use(time)
app.use(time_conv)

app.get('/',function(req,res){
	res.send('hello world')
})

app.listen(8080);
