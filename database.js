const mysql = require('mysql');
const chalk = require('chalk');
const moment = require('moment');

const con_mysql = mysql.createConnection({
	host:"localhost",
	user:"root",
	password:"",
	database:"db_project_js_3"
});

con_mysql.connect(function(err){
	if(err)throw err;
	console.log(chalk.yellow("Connected to Database "+moment().format("DD/MM/YYYY HH:mm:ss") ));
})

module.exports = con_mysql;
