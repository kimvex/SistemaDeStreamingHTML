document.addEventListener('DOMContentLoaded',function(){

	function iniciarSession(e){
		console.log('hola');
		e.preventDefault();
	}

	document.getElementById('loginCorreo').addEventListener('submit',iniciarSession);
});