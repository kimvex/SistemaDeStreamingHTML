var socketIO = require('socket.io'),
	connect = require('./website/controllers/db/conexion');

	var conexion = new connect();

var SocketIO = function(config){
	config = config || {};

	var io = socketIO.listen(config.server);
	io.sockets.on('connection',function(socket){
		socket.on('mensaje',function(data){
			var insetado = conexion.query('insert into chat(ip,mensaje,nombre) values(?,?,?)',[data.usuario,data.mensaje,data.usuario],function(err,respuesta){
				if(err){
					throw err;
				}
			});

			var pregunta = conexion.query('select * from chat order by id ASC',function(err,respuesta){
				if(err){
					throw err;
				}
				var datos = [];
				for(i  in respuesta){
					datos.push(respuesta[i]);
				}
				io.emit('respuesta',{datos});
			});
		});
		var pregunta = conexion.query('select * from chat order by id ASC',function(err,respuesta){
			if(err){
				throw err;
			}
			var datos = [];
			for(i  in respuesta){
				datos.push(respuesta[i]);
			}
			io.emit('respuesta',{datos});
		});

		socket.on('archivosEnviado',function(data){
			var buscar = conexion.query('select * from archivos',function(err,respuesta){
				if(err){
					throw err;
				}
				var datos = [];
				for(i in respuesta){
					datos.push(respuesta[i]);
				}
				io.emit('archivos',{datos});
			});
		});
		var buscar = conexion.query('select * from archivos',function(err,respuesta){
			if(err){
				throw err;
			}
			var datos = [];
			for(i in respuesta){
				datos.push(respuesta[i]);
			}
			io.emit('archivos',{datos});
		});

		socket.on('diapo',function(data){
			io.emit('diapositiva',{dato:data.dato})
		});

		socket.on('stream',function(data){
			io.emit('streamRes',data);
		});

		var array = [];
		socket.on('draw',function(_movimientos){
			array.push(_movimientos);
			io.emit('update',{movi:array.length,arry:array});
		});

	});
}

module.exports = SocketIO;