export const backgroundDark = "#222";
export const textDark = "#fff";

export const backgroundLight = "#fff";
export const textLight = "#000";

export function ToggleTheme(element: HTMLElement): void {
  const isDark = element.dataset.theme === "dark";

  if (isDark) {
    // Canviar a light
    element.style.backgroundColor = backgroundLight;
    element.style.color = textLight;
    element.dataset.theme = "light";
  } else {
    // Canviar a dark
    element.style.backgroundColor = backgroundDark;
    element.style.color = textDark;
    element.dataset.theme = "dark";
  }
}
