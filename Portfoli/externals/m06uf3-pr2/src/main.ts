import './style.css'

function muestra(): void {
  // Mostrar el contenido oculto
  const elementoAdicional = document.getElementById('adicional');
  if (elementoAdicional) {
    elementoAdicional.classList.remove('oculto');
    elementoAdicional.classList.add('visible');
  }
  
  // Ocultar el enlace
  const enlace = document.getElementById('enlace');
  if (enlace) {
    enlace.classList.add('oculto');
  }
}

// Asignar la función al evento del enlace
document.addEventListener('DOMContentLoaded', () => {
  const enlace = document.getElementById('enlace');
  if (enlace) {
    enlace.addEventListener('click', (event: Event) => {
      event.preventDefault();
      muestra();
    });
  }
});
