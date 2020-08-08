const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const chalk = require('chalk');
const moment = require('moment');
const moment_timezone = require('moment-timezone');

const con_mysql = mysql.createConnection({
	host:"localhost",
	user:"root",
	password:"",
	database:"db_project_js_3"
});

router.get('/time-converter/:action',function(req,res){

	if(req.params.action=='add'){
		// con_mysql.connect(function(err){
		// if(err)throw err;
			// console.log(chalk.yellow("Connected to Database "+moment().format("DD MM YYYY HH:mm:ss") ));
			let from_tz = moment_timezone.tz(req.query.time, req.query.from);
			let to_tz = from_tz.clone().tz(req.query.to).format();
			to_tz = to_tz.substring(0,10)+" "+to_tz.substring(11,16);
			// console.log(req.query.from+"   "+req.query.time+"   "+req.query.to+"   "+to_tz+"   "+moment().format("DD/MM/YYYY HH:mm:ss"));

			let sql = "INSERT INTO timezone (from_tz, from_datetime, to_tz, to_datetime, insert_timestamp) VALUE ? ";
			let value = [[req.query.from,req.query.time,req.query.to,to_tz,moment().format("DD/MM/YYYY HH:mm:ss")]]
			con_mysql.query(sql,[value],function(err,result){
				if(err) throw err;
				console.log("Insert Success");
			});
			
			res.redirect("http://localhost:8080/time-converter/history");

		// });
	}else if (req.params.action=='history') {
		con_mysql.query("SELECT * FROM timezone", function(err,result,fields){
  		if(err) throw err;
  		res.json(result)
  		});
	}else{
		res.end('<h1>Wrong Parameter</h1>')
	}
})
module.exports = router;