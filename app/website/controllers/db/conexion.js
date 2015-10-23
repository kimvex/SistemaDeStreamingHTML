var mysql = require('mysql'),
	conf  = require('../../../../conf');

var Mysql = function(config){
	config = config || {};

	var connection = mysql.createConnection({
		host: conf.mysql.host,
		user: conf.mysql.user,
		password: conf.mysql.password,
		database: conf.mysql.database,
		port: conf.mysql.port
	});

	connection.connect(function(err){
		if(err){
			throw err;
		}
	});

	return connection;
}

module.exports = Mysql;