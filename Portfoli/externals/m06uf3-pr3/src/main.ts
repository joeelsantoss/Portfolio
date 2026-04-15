import './style.css'

/**
 * Función que añade un nuevo elemento a la lista
 */
function anade(): void {
    // Obtener la lista por su id
    const lista = document.getElementById('lista') as HTMLUListElement;
    
    if (lista) {
        // Crear un nuevo elemento <li>
        const nuevoElemento = document.createElement('li');
        
        // Asignar contenido al nuevo elemento
        nuevoElemento.textContent = `Elemento ${lista.children.length}`;
        
        // Añadir el nuevo elemento a la lista
        lista.appendChild(nuevoElemento);
    }
}

// Vincular la función al evento click del botón
document.addEventListener('DOMContentLoaded', (): void => {
    const boton = document.getElementById('btn-anade') as HTMLButtonElement;
    
    if (boton) {
        boton.addEventListener('click', anade);
    }
});
