var http 	= require('http'),
	express = require('./app/expressServer'),
	socket	= require('./app/socket');

	var expressServer = new express();

	var server = http.createServer(expressServer.app);

	var socketIO = new socket({server:server});

	server.listen(5000,function(){
		console.log('El servidor se esta ejecutando!');
	});
