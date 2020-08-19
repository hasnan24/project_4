const express = require('express');
const router = express.Router();
const chalk = require('chalk');
const moment = require('moment');
const moment_timezone = require('moment-timezone');
const database = require('./database.js');

//http://localhost:8080/time-converter/add?from=Australia/Sydney&to=Europe/Rome&time=2020-07-01%2012:00
router.get('/time-converter/add',function(req,res){
	// con_mysql.connect(function(err){
	// if(err)throw err;
	// console.log(chalk.yellow("Connected to Database "+moment().format("DD MM YYYY HH:mm:ss") ));
	let from_tz = moment_timezone.tz(req.query.time, req.query.from);
	let to_tz = from_tz.clone().tz(req.query.to).format();
	to_tz = to_tz.substring(0,10)+" "+to_tz.substring(11,16);
	let time_stamp = moment().format("DD/MM/YYYY HH:mm:ss");
	// console.log(req.query.from+"   "+req.query.time+"   "+req.query.to+"   "+to_tz+"   "+moment().format("DD/MM/YYYY HH:mm:ss"));

	let sql = "INSERT INTO timezone (from_tz, from_datetime, to_tz, to_datetime, insert_timestamp) VALUE ? ";
	let value = [[req.query.from,req.query.time,req.query.to,to_tz,time_stamp]]
	database.query(sql,[value],function(err,result){
		if(err) throw err;
		console.log(chalk.black.bgWhite("Insert Success"));
	});
	
	let insert_data = {
		from:req.query.from,
		from_tz:req.query.time,
		to:req.query.to,
		to_datetime:to_tz,
		insert_timestamp:time_stamp
	}

	res.json(insert_data)
	// res.redirect("http://localhost:8080/time-converter/history");

	// });
	
})

router.get('/time-converter/history',function(req,res){
	database.query("SELECT * FROM timezone", function(err,result,fields){
	if(err) throw err;
	res.json(result)
	});
})

router.get('/time-converter/history-pagination/:amount/:page',function(req,res){

	let amount = req.params.amount
	let page = req.params.page
	let offset = amount*page

	if (offset==amount) {
		database.query("SELECT * FROM timezone LIMIT "+amount, function(err,result,fields){
		if(err) throw err;
		res.json(result)
		});
	}else if (offset>amount) {
		offset = offset - amount
		database.query("SELECT * FROM timezone LIMIT "+amount+" OFFSET "+offset, function(err,result,fields){
		if(err) throw err;
		res.json(result)
		});
	}

	// database.query("SELECT * FROM timezone", function(err,result,fields){
	// if(err) throw err;
	// res.json(result)
	// });
})

router.post('/time-converter/add',function(req,res){
	let from_tz = moment_timezone.tz(req.body.time, req.body.from);
	let to_tz = from_tz.clone().tz(req.body.to).format();
	to_tz = to_tz.substring(0,10)+" "+to_tz.substring(11,16);
	let time_stamp = moment().format("DD/MM/YYYY HH:mm:ss");

	let sql = "INSERT INTO timezone (from_tz, from_datetime, to_tz, to_datetime, insert_timestamp) VALUE ? ";
	let value = [[req.body.from,req.body.time,req.body.to,to_tz,time_stamp]]
	database.query(sql,[value],function(err,result){
		if(err) throw err;
		console.log(chalk.black.bgWhite("Insert Success"));
	});
	
	let insert_data = {
		from:req.body.from,
		from_tz:req.body.time,
		to:req.body.to,
		to_datetime:to_tz,
		insert_timestamp:time_stamp
	}

	res.json(insert_data)
})

module.exports = router;