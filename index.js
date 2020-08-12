var express = require('express')
var app = express()

var time = require('./time.js')
var time_conv = require('./time-converter.js')

app.use(time)
app.use(time_conv)

app.get('/',function(req,res){
	res.send('hello world')
})

app.listen(8080);
