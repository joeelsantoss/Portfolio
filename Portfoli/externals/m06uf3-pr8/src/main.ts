import './style.css'

// Elementos del formulario
const emailInput = document.getElementById('email') as HTMLInputElement;
const passwordInput = document.getElementById('password') as HTMLInputElement;
const submitBtn = document.getElementById('submitBtn') as HTMLButtonElement;

// Elementos de validación
const val1 = document.getElementById('val1') as HTMLElement;
const val2 = document.getElementById('val2') as HTMLElement;
const val3 = document.getElementById('val3') as HTMLElement;
const val4 = document.getElementById('val4') as HTMLElement;
const val5 = document.getElementById('val5') as HTMLElement;

// Función para validar la contraseña
function validarPassword(): void {
  const password = passwordInput.value;

  // Validar 8 caracteres
  if (password.length >= 8) {
    val1.classList.remove('invalid');
    val1.classList.add('valid');
    const icono = val1.querySelector('.icon') as HTMLElement;
    icono.textContent = '✓';
  } else {
    val1.classList.remove('valid');
    val1.classList.add('invalid');
    const icono = val1.querySelector('.icon') as HTMLElement;
    icono.textContent = '✗';
  }

  // Validar 1 número
  if (/\d/.test(password)) {
    val2.classList. remove('invalid');
    val2.classList.add('valid');
    const icono = val2.querySelector('.icon') as HTMLElement;
    icono.textContent = '✓';
  } else {
    val2.classList. remove('valid');
    val2.classList.add('invalid');
    const icono = val2.querySelector('.icon') as HTMLElement;
    icono.textContent = '✗';
  }

  // Validar 1 mayúscula
  if (/[A-Z]/.test(password)) {
    val3.classList.remove('invalid');
    val3.classList.add('valid');
    const icono = val3.querySelector('.icon') as HTMLElement;
    icono.textContent = '✓';
  } else {
    val3.classList.remove('valid');
    val3.classList.add('invalid');
    const icono = val3.querySelector('.icon') as HTMLElement;
    icono.textContent = '✗';
  }

  // Validar 1 minúscula
  if (/[a-z]/.test(password)) {
    val4.classList.remove('invalid');
    val4.classList. add('valid');
    const icono = val4.querySelector('.icon') as HTMLElement;
    icono.textContent = '✓';
  } else {
    val4.classList.remove('valid');
    val4.classList. add('invalid');
    const icono = val4.querySelector('.icon') as HTMLElement;
    icono.textContent = '✗';
  }

  // Validar 1 carácter especial
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    val5.classList.remove('invalid');
    val5.classList.add('valid');
    const icono = val5.querySelector('.icon') as HTMLElement;
    icono.textContent = '✓';
  } else {
    val5.classList.remove('valid');
    val5.classList.add('invalid');
    const icono = val5.querySelector('.icon') as HTMLElement;
    icono.textContent = '✗';
  }

  // Comprobar si se puede enviar el formulario
  comprobarFormulario();
}

// Función para comprobar si el formulario es válido
function comprobarFormulario(): void {
  const password = passwordInput.value;
  const email = emailInput.value;

  // Validar que la contraseña cumple todos los requisitos
  const passwordValida =
    password.length >= 8 &&
    /\d/.test(password) &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  // Validar que el email es de Gmail
  const emailValido = /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);

  // Si todo es válido, activar el botón
  if (passwordValida && emailValido) {
    submitBtn.disabled = false;
  } else {
    submitBtn. disabled = true;
  }
}

// Evento cuando el usuario escribe en la contraseña
passwordInput.addEventListener('input', validarPassword);

// Evento cuando el usuario escribe en el email
emailInput. addEventListener('input', comprobarFormulario);

// Evento cuando se envía el formulario
submitBtn. addEventListener('click', function(e) {
  e.preventDefault();
  alert('¡Formulario enviado correctamente!  ✅');
});