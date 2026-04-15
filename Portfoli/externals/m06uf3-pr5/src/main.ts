import './style.css'

// Obtenim l'element h1 on mostrarem els missatges
const messageBox = document.getElementById('messageBox') as HTMLElement;

// Funció per actualitzar el missatge i el color de fons
function updateMessage(text: string, bgColor: string): void {
  messageBox.textContent = text;
  messageBox.style.backgroundColor = bgColor;
}

// Event del moviment del ratolí
document.addEventListener('mousemove', (event: MouseEvent) => {
  const clientX = event.clientX;
  const clientY = event.clientY;
  const pageX = event.pageX;
  const pageY = event.pageY;

  const message = `Ratoli - Client: (${clientX}, ${clientY}) | Página: (${pageX}, ${pageY})`;
  updateMessage(message, 'white');
});

// Event del clic del ratolí
document.addEventListener('mousedown', (event: MouseEvent) => {
  const button = event.button;
  let buttonName = '';
  
  switch (button) {
    case 0:
      buttonName = 'esquerra';
      break;
    case 1:
      buttonName = 'central';
      break;
    case 2:
      buttonName = 'dreta';
      break;
  }

  const message = `Botó del ratolí premut: ${buttonName}`;
  updateMessage(message, '#FFFFCC');
});

// Event de la pulsació de tecles
document.addEventListener('keydown', (event: KeyboardEvent) => {
  const key = event.key;
  const code = event.code;

  const message = `Tecla premuda: ${key} (Codi: ${code})`;
  updateMessage(message, '#CCE6FF');
});
