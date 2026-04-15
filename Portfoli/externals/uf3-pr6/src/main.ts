import './style.css'

// Obtener el tamaño de la ventana del navegador
function getWindowSize(): { width: number; height: number } {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
}

// Función para determinar la zona del clic
function getClickZone(x: number, y: number): string {
  const { width, height } = getWindowSize();
  const midX = width / 2;
  const midY = height / 2;

  if (x < midX && y < midY) {
    return 'Esquerra Superior';
  } else if (x < midX && y >= midY) {
    return 'Esquerra Inferior';
  } else if (x >= midX && y < midY) {
    return 'Dreta Superior';
  } else {
    return 'Dreta Inferior';
  }
}

// Configurar la interfaz HTML
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div style="text-align: center; padding: 20px;">
    <h1>Detector de Zona de Clic</h1>
    <p style="font-size: 18px;">Fes clic en qualsevol lloc de la pantalla i veuràs en quina zona vas fer clic</p>
    <div id="resultArea" style="
      margin-top: 30px; 
      padding: 20px; 
      background-color: #f0f0f0; 
      border-radius: 8px;
      font-size: 20px;
      font-weight: bold;
      color: #333;
      min-height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      Esperant clic...
    </div>
    <p style="margin-top: 20px; color: #666;">Coordenades: <span id="coordinates">--</span></p>
  </div>
`;

// Agregar listener para detectar clics en toda la ventana
document.addEventListener('click', (event: MouseEvent) => {
  const x = event.clientX;
  const y = event.clientY;
  const zone = getClickZone(x, y);
  const { width, height } = getWindowSize();

  // Actualizar el área de resultado
  const resultArea = document.querySelector<HTMLDivElement>('#resultArea');
  const coordinatesSpan = document.querySelector<HTMLSpanElement>('#coordinates');

  if (resultArea) {
    resultArea.textContent = `Zona: ${zone}`;
    resultArea.style.backgroundColor = getZoneColor(zone);
  }

  if (coordinatesSpan) {
    coordinatesSpan.textContent = `X: ${x}, Y: ${y} (Finestra: ${width}x${height})`;
  }

  console.log(`Clic detectat en zona: ${zone} | Coordenades: (${x}, ${y})`);
});

// Función auxiliar para asignar colores según la zona
function getZoneColor(zone: string): string {
  switch (zone) {
    case 'Esquerra Superior':
      return '#e8f5e9'; // Verde claro
    case 'Esquerra Inferior':
      return '#fff3e0'; // Naranja claro
    case 'Dreta Superior':
      return '#e3f2fd'; // Azul claro
    case 'Dreta Inferior':
      return '#fce4ec'; // Rosa claro
    default:
      return '#f0f0f0';
  }
}
