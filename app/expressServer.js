var express	= require('express'),
	swig	= require('swig'),
	parser	= require('body-parser'),
	ip		= require('ip'),
	multer  = require('multer'),
	subir	= multer({dest:'./app/static/archivos'}),
	datosArchivos = require('./website/controllers/db/archivos');

var expressServer = function(config){
	config = config || {};
	this.app = express();
	this.app.use(parser.json());
	this.app.use(parser.urlencoded({extended:true}));
	this.app.engine('html', swig.renderFile);
	this.app.set('view engine', 'html');
	this.app.set('views', __dirname + '/website/views/templetes');
	this.app.use(express.static(__dirname + '/static'));
	swig.setDefaults({varControls:['<<','>>']});

	this.app.get('/',function(sol,res,next){
		res.render('index',{ipserver:ip.address(),ipusuario:sol.connection.remoteAddress});
	});

	this.app.get('/sistema',function(sol,res,next){
		res.render('sistema',{ipserver:ip.address(),ipusuario:sol.connection.remoteAddress});
	});

	this.app.post('/archivos',subir.single('img'),function(sol,res,next){
		console.log(sol.file)
		if(sol.file == undefined){
			var datos = {
				url: sol.body.nombre,
				sol: sol,
				res: res
			}
			var archivos = new datosArchivos(datos);
		}else{
			var datos = {
				nombre: sol.file.filename,
				tipo: sol.file.mimetype,
				sol: sol,
				res: res
			}			
			var archivos = new datosArchivos(datos);
		}
	});

	this.app.get('/html',function(sol,res,next){
		res.render('html');
	});

	/*********Correo********/

	this.app.get('/correo',function(sol,res,next){
		res.render('correo/index');
	});

}

module.exports = expressServer;