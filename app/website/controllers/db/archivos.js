var mysq 		= require('mysql'),
	conexion 	= require('./conexion');

	var connect = new conexion();

var archivos = function(config){
	config = config || {};
	console.log(config.tipo);
	if(config.url){
		var insertar = connect.query('insert into archivos(url,type) values(?,?)',[config.url,1],function(err,respuesta){
			if(err){
				throw err;
			}
			config.res.send({value:'vamos'});
		});
	}else{
		var insertar = connect.query('insert into archivos(tipo,nombre,type) values(?,?,?)',[config.tipo,config.nombre,2],function(err,respuesta){
			if(err){
				throw err;
			}
			config.res.send({value:'vamos'});
		});

	}
}

module.exports = archivos;