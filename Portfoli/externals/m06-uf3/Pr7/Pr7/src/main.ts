import './style.css'

// ===== EJERCICIO 17: Limitador de Caracteres =====

function limita(maximoCaracteres: number): boolean {
  const elemento = document.getElementById("texto") as HTMLTextAreaElement;
  const contador = document.getElementById("contador") as HTMLSpanElement;
  
  if (!elemento || !contador) return true;
  
  const caracteresRestantes = maximoCaracteres - elemento.value.length;
  contador.textContent = caracteresRestantes.toString();
  
  if (elemento.value.length >= maximoCaracteres) {
    return false;
  }
  
  return true;
}

function permiteTeclasEspeciales(event: KeyboardEvent): boolean {
  const teclasPermitidas = [
    'Backspace',
    'Delete',
    'ArrowLeft',
    'ArrowRight'
  ];
  
  return teclasPermitidas.includes(event.key);
}

function manejarTecla(event: KeyboardEvent, maximoCaracteres: number): boolean {
  const elemento = event.target as HTMLTextAreaElement;
  
  if (elemento.selectionStart !== elemento.selectionEnd) {
    return true;
  }
  
  if (elemento.value.length >= maximoCaracteres) {
    return permiteTeclasEspeciales(event);
  }
  
  return true;
}

function actualizarContador(maximoCaracteres: number): void {
  const elemento = document.getElementById("texto") as HTMLTextAreaElement;
  const contador = document. getElementById("contador") as HTMLSpanElement;
  
  if (! elemento || !contador) return;
  
  const caracteresRestantes = maximoCaracteres - elemento.value.length;
  contador.textContent = caracteresRestantes.toString();
}

// Inicializar
const maximoCaracteres = 100;

window.addEventListener('DOMContentLoaded', () => {
  const elemento = document.getElementById("texto") as HTMLTextAreaElement;
  
  if (elemento) {
    elemento.addEventListener('keyup', () => actualizarContador(maximoCaracteres));
    elemento.addEventListener('keydown', (event) => {
      if (! manejarTecla(event, maximoCaracteres)) {
        event.preventDefault();
      }
    });
    
    actualizarContador(maximoCaracteres);
  }
});