$(document).ready(function(){

	var server = document.getElementById('ipserver').value;
	var usuario = document.getElementById('ipusuario').value;
	var socket = io.connect('http://' + server +':5000');

	function enviarMensaje(){
		var mensaje = document.getElementById('mensaje').value;
		socket.emit('mensaje',{mensaje:mensaje,usuario:usuario});
		document.getElementById('mensaje').value = '';
	}

	document.getElementById('enviar').addEventListener('click',enviarMensaje);
	function procesarEvento(evento){
		document.getElementById('mensaje').value
		if(evento.which == 13 && mensaje != ''){
			enviarMensaje();
		}
	}

	$(document).keydown(procesarEvento);


	socket.on('respuesta',function(data){
		var mensje;
		for(i in data.datos){
			if(mensje == undefined){
				mensje = '<br><br>' + data.datos[i].ip + ':<br>' + data.datos[i].mensaje + '<br><br>';
			}else{
				mensje = '<br>' + data.datos[i].ip + ':<br>' + data.datos[i].mensaje + '<br>' + mensje + '<br><br>';
			}
		}

		document.getElementById('respuesta').innerHTML = mensje;

	});
	$.get('/html',function(externo){
		$('#diapositivas').html(externo);
	});
	var contexto;
	var bool = true;
	if(localStorage['SS'] == 'benjamin'){
		var canvas = document.getElementById('miCanvas');
		var context = canvas.getContext('2d');
		var emiti;
		var videoStream = null;

		var video = document.getElementById('video');
		function activarCamara (e){

			navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia ||   navigator.mozGetUserMedia || navigator.msGetUserMedia);

			if(navigator.getUserMedia){
				navigator.getUserMedia ({video: bool},function(data){
					videoStream = data;
					var urs = window.URL.createObjectURL(data);
					video.src = urs;
					socket.emit('tiempo',urs);
			},function(err) {
	    			console.log("Ocurrió el siguiente error: " + err);
	   		  });
			}
		}
		var streamG = function(){		

			function videos(video,context){
				var ancho = document.body.clientWidth;
				var alto = document.body.clientHeight;
				alto = alto * 75 / 100;
				ancho = ancho * 75 / 100;
				alto = alto * 30/ 100;
				ancho = ancho * 30 / 100;
				context.drawImage(video,0,0,ancho,alto);
				socket.emit('stream',canvas.toDataURL('image/webp'));
			}

			var emitirStream = function(){
				$('#emitirS').addClass('emitiendo');
				$('#emitirS').removeClass('icon-iniciarStream');
				$('#emitirS').addClass('icon-pausa');
				$('#detenerS').removeClass('detenido');
				if(emiti == '' || emiti == undefined){
					emiti = setInterval(function(){
						videos(video,context);
					},70);				
				}
				var detener = function(){
					clearInterval(emiti);
					emiti = '';
					$('#emitirS').removeClass('emitiendo');
					$('#emitirS').removeClass('icon-pausa');
					$('#emitirS').addClass('icon-iniciarStream');
					$('#detenerS').addClass('detenido');
				}
				document.getElementById('detenerS').addEventListener('click',detener);
			}
			$('#miImg').removeClass('oculto');
			$('#miCanvas').addClass('oculto');
			$('#canvas').addClass('oculto');
			$('#emitirS').removeClass('col');
			$('#detenerS').removeClass('col');
			$('#acceder').removeClass('col');
			socket.emit('cambio',{dato:1});
			document.getElementById('emitirS').addEventListener('click',emitirStream);
			document.getElementById('acceder').addEventListener('click',activarCamara);
		}

		var pulsado;

		function pasarDiapo(evento){

			socket.emit('diapo',{dato:evento.which});
			console.log(evento.which);
		}

		$(document).keydown(pasarDiapo);

		document.getElementById('streaming').addEventListener('click',streamG);

		function pizarr(){
			clearInterval(emiti);
			emiti = '';
			videoStream.stop();
			$('#emitirS').addClass('col');
			$('#detenerS').addClass('col');
			$('#acceder').addClass('col');
			$('#emitirS').removeClass('emitiendo');
			$('#emitirS').removeClass('icon-pausa');
			$('#detenerS').removeClass('detenido');
			$('#emitirS').addClass('icon-iniciarStream');
			socket.emit('cambio',{dato:2});
		}
		document.getElementById('pizarra').addEventListener('click',pizarr);
	}
	socket.on('streamRes',function(data){
		var img = document.getElementById('miImg');
		img.src = data;
	})

	var crearLienzo = function(){
		var canvasD = document.getElementById('canvas');
		contexto = canvasD.getContext('2d');
		var ancho = document.body.clientWidth;
		var alto = document.body.clientHeight;
		alto = alto * 75 / 100;
		ancho = ancho * 75 / 100;
		canvasD.setAttribute('width',ancho);
		canvasD.setAttribute('height',alto);
		if(localStorage['SS'] == 'benjamin'){
			document.getElementById('canvas').addEventListener('mousedown',function(e){
					pulsado = true;
					socket.emit('draw',[e.pageX - this.offsetLeft, e.pageY - this.offsetTop,false]);
			});

			document.getElementById('canvas').addEventListener('mousemove',function(e){
					if(pulsado){
						socket.emit('draw',[e.pageX - this.offsetLeft, e.pageY - this.offsetTop,true]);
					}
			});

			document.getElementById('canvas').addEventListener('mouseup',function(e){
					pulsado = false;
			});

			document.getElementById('canvas').addEventListener('mouseleave',function(e){
					pulsado = false;
			});
		}
	};
	crearLienzo();
	socket.on('update',function(data){
		contexto.lineJoin = "round";
		contexto.lineWidth = 12;
		contexto.strokeStyle = "white";
		for(var i = 0;i < data.movi;i++ ){
			contexto.beginPath();
			if(data.arry[i][2] && i){
				contexto.moveTo(data.arry[i-1][0],data.arry[i-1][1]);
			}else{
				contexto.moveTo(data.arry[i][0],data.arry[i][1]);
			}
			contexto.lineTo(data.arry[i][0],data.arry[i][1]);
			contexto.closePath();
			contexto.stroke();
		}
	});

	socket.on('cambioC',function(data){
		if(data.data.dato == 1){
			$('#miImg').removeClass('oculto');
			$('#canvas').addClass('oculto');
		}
		if(data.data.dato == 2){
			$('#canvas').removeClass('oculto');
			$('#miImg').addClass('oculto');
		}
		if(data.data.dato == 3){

		}
	});

			var chmod = 0;

	socket.on('diapositiva',function(data){

			if(data.dato == 39){
				chmod++;
			}
			if(data.dato == 37){
				chmod--;
			}
			console.log(chmod);
			if(chmod == 0){
				$('#parrafo1').removeClass('oculto');
				$('#parrafo1').addClass('parrafosBien');
				$('#parrafo2').addClass('oculto');
				$('#parrafo3').addClass('oculto');
			}
			if (chmod == 1) {
				$('#parrafo1').addClass('oculto');
				$('#parrafo1').removeClass('parrafosBien');
				$('#parrafo2').removeClass('oculto');
				$('#parrafo2').addClass('parrafosBien');
				$('#parrafo3').addClass('oculto');
				$('#parrafo3').removeClass('parrafosBien');

			};
			if (chmod == 2) {
				$('#parrafo1').addClass('oculto');
				$('#parrafo1').removeClass('parrafosBien');
				$('#parrafo2').addClass('oculto');
				$('#parrafo2').removeClass('parrafosBien');
				$('#parrafo3').removeClass('oculto');
				$('#parrafo3').addClass('parrafosBien');

			};

	});

	socket.on('archivos',function(data){
		var arch;
		for(i in data.datos){
			if(arch == undefined){
				if(data.datos[i].type == 1){
					arch = '<a href="'+data.datos[i].url+'" class="link" target="_blank">'+data.datos[i].url+'</a>';
				}else{
					arch = '<img src="archivos/'+data.datos[i].nombre+'" class="imgArch">';
				}
			}else{
				if(data.datos[i].type == 1){
					arch = '<a href="'+data.datos[i].url+'" class="link" target="_blank">'+data.datos[i].url+'</a>'+arch;
				}else{
					arch = '<img src="archivos/'+data.datos[i].nombre+'" class="imgArch">' + arch;
				}
			}
		}
		document.getElementById('archivos').innerHTML = arch;
	});

	function urlArchivos(evento){
		var formData = new FormData($("#envioArchivos")[0]);
		$.ajax({
			url: '/archivos',
			type: 'POST',
			data: formData,
			cache: false,
			contentType: false,
			processData: false,
			success: function(data){
				document.getElementById('archivos').innerHTML = data;
				if(data.value == 'vamos'){
					socket.emit('archivosEnviado');
				}
			}
		});

		evento.preventDefault();
	}


	document.getElementById('envioArchivos').addEventListener('submit',urlArchivos);
});