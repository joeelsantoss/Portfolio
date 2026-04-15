import { min, max, decompose } from "./mathematics";
import { ToggleTheme } from "./darker";

// -------- Pruebas Mathematics.ts --------
const data = [5, 2, 9, 1, 8];

document.getElementById("Numbers")!.textContent =
"Numeros: " + (data)

document.getElementById("resultMin")!.textContent =
  "Mínimo: " + min(data);

document.getElementById("resultMax")!.textContent =
  "Máximo: " + max(data);

document.getElementById("resultDecompose")!.textContent =
  "Descomposición de 120: " + decompose(120);


// -------- Prueba del cambio de tema --------
const button = document.getElementById("themeBtn")!;
button.addEventListener("click", () => {
  ToggleTheme(document.body);
});
