// Simpler, more 'junior' style implementation while keeping functionality

const STORAGE_KEY = 'kanban-data';

const defaultData = {
  columns: [
    { name: 'Per fer', items: ['Aprobar', 'Viajar', 'Salir de fiesta'] },
    { name: 'En procés', items: ['Casarme'] },
    { name: 'Finalitzat', items: ['Entrar por el garaje', 'Trabajar'] }
  ]
};

export function initKanban(selector: string) {
  const container = document.querySelector(selector) as HTMLElement;
  if (!container) throw new Error('Container not found');

  let data = load();
  // simple variables for dragging state
  let draggingCol = -1;
  let draggingIndex = -1;

  render();

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : defaultData;
    } catch (err) {
      return defaultData;
    }
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function render() {
    container.innerHTML = '';
    const board = document.createElement('div');
    board.className = 'kanban';

    for (let colIndex = 0; colIndex < data.columns.length; colIndex++) {
      const col = data.columns[colIndex];
      const column = document.createElement('div');
      column.className = 'column';
      column.dataset.index = String(colIndex);

      const title = document.createElement('h2');
      title.className = 'column-title';
      title.textContent = col.name;
      column.appendChild(title);

      const list = document.createElement('div');
      list.className = 'list';

      // counter to avoid flicker on children
      let enterCounter = 0;

      column.addEventListener('dragenter', (e) => {
        e.preventDefault();
        enterCounter++;
        column.classList.add('over');
      });

      column.addEventListener('dragleave', () => {
        enterCounter--;
        if (enterCounter <= 0) {
          column.classList.remove('over');
          enterCounter = 0;
        }
      });

      column.addEventListener('dragover', (e) => {
        e.preventDefault();
        const y = (e as DragEvent).clientY;
        // show a placeholder where the dragged item would go
        showPlaceholder(list, y);
      });

      column.addEventListener('drop', (e) => {
        e.preventDefault();
        column.classList.remove('over');
        handleDrop(list, Number(column.dataset.index));
      });

      for (let itemIndex = 0; itemIndex < col.items.length; itemIndex++) {
        const text = col.items[itemIndex];
        const item = document.createElement('div');
        item.className = 'item';
        item.draggable = true;
        item.textContent = text;

        item.addEventListener('dragstart', (ev) => {
          draggingCol = colIndex;
          draggingIndex = itemIndex;
          item.classList.add('dragging');
          // needed for Firefox
          (ev as DragEvent).dataTransfer?.setData('text/plain', '');
        });

        item.addEventListener('dragend', () => {
          draggingCol = -1;
          draggingIndex = -1;
          item.classList.remove('dragging');
          removePlaceholders();
          removeOverHighlights();
        });

        list.appendChild(item);
      }

      column.appendChild(list);

      // Simplified add-card: button shows an input; pressing Enter adds the card
      if (colIndex === 0) {
        const addWrap = document.createElement('div');
        addWrap.className = 'add-card';

        const addBtn = document.createElement('button');
        addBtn.className = 'add-card-btn';
        addBtn.textContent = '+ Afegeix una targeta';

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'add-card-input';
        input.placeholder = 'Afegeix una targeta';
        (input as HTMLElement).style.display = 'none';

        addBtn.addEventListener('click', () => {
          (addBtn as HTMLElement).style.display = 'none';
          (input as HTMLElement).style.display = 'block';
          input.focus();
        });

        input.addEventListener('keydown', (ev) => {
          const k = (ev as KeyboardEvent).key;
          if (k === 'Enter') {
            const v = (input as HTMLInputElement).value.trim();
            if (v) {
              data.columns[colIndex].items.push(v);
              save();
              render();
            }
          } else if (k === 'Escape') {
            (input as HTMLInputElement).value = '';
            (input as HTMLElement).style.display = 'none';
            (addBtn as HTMLElement).style.display = 'inline-block';
          }
        });

        addWrap.appendChild(addBtn);
        addWrap.appendChild(input);
        column.appendChild(addWrap);
      }

      board.appendChild(column);
    }

    container.appendChild(board);
  }

  // Helper: create a placeholder element
  function createPlaceholder() {
    const p = document.createElement('div');
    p.className = 'item placeholder';
    p.textContent = '';
    return p;
  }

  function removePlaceholders() {
    document.querySelectorAll('.placeholder').forEach((n) => n.remove());
  }

  function removeOverHighlights() {
    document.querySelectorAll('.column.over').forEach((c) => c.classList.remove('over'));
  }

  // Show a placeholder in the list based on mouse Y position (simple linear scan)
  function showPlaceholder(listEl: HTMLElement, y: number) {
    removePlaceholders();
    const placeholder = createPlaceholder();
    const children = Array.from(listEl.children) as HTMLElement[];

    let inserted = false;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      // ignore placeholders if any
      if (child.classList.contains('placeholder')) continue;
      const rect = child.getBoundingClientRect();
      const middle = rect.top + rect.height / 2;
      if (y < middle) {
        listEl.insertBefore(placeholder, child);
        inserted = true;
        break;
      }
    }

    if (!inserted) listEl.appendChild(placeholder);
  }

  // Handle drop: move item from draggingCol/draggingIndex to target column at placeholder spot
  function handleDrop(listEl: HTMLElement, targetCol: number) {
    const kids = Array.from(listEl.children);
    const phIndex = kids.findIndex((n) => n.classList.contains('placeholder'));

    if (draggingCol < 0 || draggingIndex < 0) return;

    const itemText = data.columns[draggingCol].items[draggingIndex];
    // remove original
    data.columns[draggingCol].items.splice(draggingIndex, 1);

    let insertAt = phIndex;
    if (insertAt < 0) insertAt = data.columns[targetCol].items.length;

    // if same column and original before insertion point, adjust
    if (draggingCol === targetCol && draggingIndex < insertAt) insertAt -= 1;

    if (insertAt < 0) insertAt = 0;

    data.columns[targetCol].items.splice(insertAt, 0, itemText);

    save();
    // re-render to update indexes and events
    render();
  }
}

