const API_URL = "https://script.google.com/macros/s/AKfycby_2REwuKiCR0YJZ_RjF8eU1h76JriUNYrrasfEixK0DUZkwF2nkIkZ0xDG0UcCObh8/exec";
const MAX_CUPOS = 15;

const form = document.getElementById("formulario");
const boton = document.getElementById("inscribirse");

const contador = document.getElementById("contador");
const mensaje = document.getElementById("mensaje");

const nombres = document.getElementById("nombres");
const apellidos = document.getElementById("apellidos");
const cedula = document.getElementById("cedula");
const telefono = document.getElementById("telefono");
const correo = document.getElementById("correo");
const fechaNacimiento = document.getElementById("fechaNacimiento");

// 🚀 JSONP REQUEST
function jsonp(action, params = {}) {
  return new Promise((resolve) => {
    const script = document.createElement("script");

    const query = new URLSearchParams({
      action,
      callback: "handleResponse",
      ...params
    });

    script.src = API_URL + "?" + query.toString();

    document.body.appendChild(script);

    window.handleResponse = (data) => {
      resolve(data);
      script.remove();
    };
  });
}

// 📥 OBTENER
async function obtener() {
  return await jsonp("get");
}

// ➕ ENVIAR
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  boton.disabled = true;
  boton.innerText = "Enviando...";

  const data = await jsonp("add", {
    nombres: nombres.value,
    apellidos: apellidos.value,
    cedula: cedula.value,
    telefono: telefono.value,
    correo: correo.value,
    fechaNacimiento: fechaNacimiento.value
  });

  if (data.status === "ok") {
    Swal.fire("Éxito", "Inscripción realizada", "success");
    form.reset();
    actualizar();
  }

  if (data.status === "duplicate") {
    Swal.fire("Error", "Cédula ya registrada", "warning");
  }

  if (data.status === "email_duplicate") {
    Swal.fire("Error", "Correo ya registrado", "warning");
  }

  if (data.status === "full") {
    Swal.fire("Cupos llenos", "No disponible", "error");
  }

  boton.disabled = false;
  boton.innerText = "Inscribirse";
});

// 📊 CONTADOR
async function actualizar() {
  try {
    const data = await obtener();

    contador.innerText = `Inscritos: ${data.length} / ${MAX_CUPOS}`;

    if (data.length >= MAX_CUPOS) {
      form.style.display = "none";
      mensaje.innerText = "Cupos llenos";
    }
  } catch (e) {
    console.log("Error contador", e);
  }
}

actualizar();