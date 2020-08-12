const express = require('express');
const router = express.Router();
const chalk = require('chalk');
const moment = require('moment');
const moment_timezone = require('moment-timezone');
const database = require('./database.js');

//http://localhost:8080/time-converter/add?from=Asutralia/Sydney&to=Europe/Rome&time=2020-07-01%2012:00
router.get('/time-converter/:action',function(req,res){
	if(req.params.action=='add'){
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
	}else if (req.params.action=='history') {
		database.query("SELECT * FROM timezone", function(err,result,fields){
  		if(err) throw err;
  		res.json(result)
  		});
	}else{
		res.end('<h1>Wrong Parameter</h1>')
	}
})
module.exports = router;