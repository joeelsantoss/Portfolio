window.addEventListener('load', function() {
	// Numero de enlaces de la pagina
	const enlaces = document.getElementsByTagName('a');
	const numEnlaces = enlaces.length;
	
	// Direccion del penultimo enlace
	let penultimoHref = '';
	if (enlaces.length > 1) {
		penultimoHref = (enlaces[enlaces.length - 2] as HTMLAnchorElement).href;
	}
	
	// Numero de enlaces que apuntan a http://prueba
	let enlacesPrueba = 0;
	for (let i = 0; i < enlaces.length; i++) {
		if ((enlaces[i] as HTMLAnchorElement).href.indexOf('http://prueba') === 0) {
			enlacesPrueba++;
		}
	}
	
	// Numero de enlaces del tercer párrafo
	const parrafos = document.getElementsByTagName('p');
	let enlacesParrafo3 = 0;
	if (parrafos.length > 2) {
		const enlacesEnParrafo = parrafos[2].getElementsByTagName('a');
		enlacesParrafo3 = enlacesEnParrafo.length;
	}
	
	// Mostrar resultados
	const resultadosDiv = document.getElementById('resultados');
	if (resultadosDiv) {
		resultadosDiv.innerHTML = '<p><strong>Número d\'enllaços de la pàgina:</strong> ' + numEnlaces + '</p>' +
			'<p><strong>Direcció del penúltim enllaç:</strong> ' + penultimoHref + '</p>' +
			'<p><strong>Número d\'enllaços que apunten a http://prueba:</strong> ' + enlacesPrueba + '</p>' +
			'<p><strong>Número d\'enllaços del tercer pàrraf:</strong> ' + enlacesParrafo3 + '</p>';
	}
});
