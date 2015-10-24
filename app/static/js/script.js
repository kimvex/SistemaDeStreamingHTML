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
	if(localStorage['SS'] == 'benjamin'){
		navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia ||   navigator.mozGetUserMedia || navigator.msGetUserMedia);

		if(navigator.getUserMedia){
			navigator.getUserMedia ({video: true},function(data){
				video.src = window.URL.createObjectURL(data);
		},function(err) {
    			console.log("Ocurrió el siguiente error: " + err);
   		  });
		}

		var canvas = document.getElementById('miCanvas');
		var context = canvas.getContext('2d');

		var video = document.getElementById('video');

		function videos(video,context){
			var ancho = document.body.clientWidth;
			var alto = document.body.clientHeight;
			alto = alto * 75 / 100;
			ancho = ancho * 75 / 100;
			alto = alto * 30/ 100;
			ancho = ancho * 30 / 100;
			console.log(ancho);
			//console.log(alto);
			context.drawImage(video,0,0,ancho,alto);
			socket.emit('stream',canvas.toDataURL('image/webp'));
		}

		setInterval(function(){
			videos(video,context);
		},70);

		function pasarDiapo(evento){

			socket.emit('diapo',{dato:evento.which});
			console.log(evento.which);
		}

		$(document).keydown(pasarDiapo);
	}
	socket.on('streamRes',function(data){
		var img = document.getElementById('miImg');
		img.src = data;
	})

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