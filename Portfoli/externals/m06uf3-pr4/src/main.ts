// Función para configurar el comportamiento de mostrar/ocultar contenidos
function configurarToggleContenidos() {
  // Array con los IDs de los enlaces
  const enlaces = ['enlace_1', 'enlace_2', 'enlace_3'];

  // Recorremos cada enlace
  enlaces.forEach((enlaceId) => {
    // Obtenemos el elemento del enlace
    const enlace = document.getElementById(enlaceId);
    
    if (enlace) {
      // Agregamos un evento click al enlace
      enlace.addEventListener('click', (evento) => {
        // Prevenimos que se ejecute el comportamiento por defecto del enlace
        evento.preventDefault();

        // Obtenemos el número de la sección (1, 2 o 3)
        const numero = enlaceId.split('_')[1];
        
        // Obtenemos el elemento de contenidos
        const contenidos = document.getElementById(`contenidos_${numero}`);

        if (contenidos) {
          // Comprobamos si el contenido está oculto o visible
          const estaOculto = contenidos.style.display === 'none';

          if (estaOculto) {
            // Si está oculto, lo mostramos
            contenidos.style.display = 'block';
            // Cambiamos el texto del enlace
            enlace.innerHTML = 'Ocultar contenidos';
          } else {
            // Si está visible, lo ocultamos
            contenidos.style.display = 'none';
            // Cambiamos el texto del enlace
            enlace.innerHTML = 'Mostrar contenidos';
          }
        }
      });
    }
  });
}

// Ejecutamos la función cuando el documento esté cargado
document.addEventListener('DOMContentLoaded', configurarToggleContenidos);
