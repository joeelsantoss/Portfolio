import './style.css'
import { initKanban } from './kanban'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Tauler Kanban</h1>
    <div id="kanban-container"></div>
  </div>
`;

initKanban('#kanban-container');
