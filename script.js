const API_URL = "https://script.google.com/macros/s/AKfycbxMb6EOyMrBmYP2sx0lgaIyrMPvMXUpg0aSkm8_9rn9BXG-HGEUTH7XIAg9zTQM28R94A/exec";
const MAX = 15;

const form = document.getElementById("formulario");
const contador = document.getElementById("contador");
const mensaje = document.getElementById("mensaje");

const nombres = document.getElementById("nombres");
const apellidos = document.getElementById("apellidos");
const cedula = document.getElementById("cedula");
const telefono = document.getElementById("telefono");
const correo = document.getElementById("correo");
const fechaNacimiento = document.getElementById("fechaNacimiento");

// 🔥 JSONP
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

// 📥 GET
function obtener() {
  return jsonp("get");
}

// 📊 CONTADOR
async function actualizar() {
  const data = await obtener();

  contador.innerText = `Inscritos: ${data.length} / ${MAX}`;

  if (data.length >= MAX) {
    form.style.display = "none";
    mensaje.innerText = "Cupos llenos";
  }
}

// 🚀 REGISTRO
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const r = await jsonp("add", {
    nombres: nombres.value,
    apellidos: apellidos.value,
    cedula: cedula.value,
    telefono: telefono.value,
    correo: correo.value,
    fechaNacimiento: fechaNacimiento.value
  });

  if (r.status === "ok") {
    Swal.fire("Éxito", "Inscripción realizada", "success");
    form.reset();
    actualizar();
  }

  if (r.status === "duplicate") {
    Swal.fire("Error", "Cédula duplicada", "error");
  }

  if (r.status === "email_duplicate") {
    Swal.fire("Error", "Correo duplicado", "error");
  }

  if (r.status === "full") {
    Swal.fire("Error", "Cupos llenos", "error");
  }
});

actualizar();
