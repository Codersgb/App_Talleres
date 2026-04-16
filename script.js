const API_URL = "https://script.google.com/macros/s/AKfycbz9tpUb16tosD93jJzacR9MnkDsepoK2hE_gK1PCQ0LthMgBrtpcOjwun89wL0jeV4IxA/exec";
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

// 🚀 ENVIAR (GET - SIN CORS)
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  boton.disabled = true;
  boton.innerText = "Enviando...";

  try {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo.value)) {
      throw new Error("EMAIL_INVALIDO");
    }

    const url =
      API_URL +
      "?action=add" +
      "&nombres=" + encodeURIComponent(nombres.value) +
      "&apellidos=" + encodeURIComponent(apellidos.value) +
      "&cedula=" + encodeURIComponent(cedula.value) +
      "&telefono=" + encodeURIComponent(telefono.value) +
      "&correo=" + encodeURIComponent(correo.value) +
      "&fechaNacimiento=" + encodeURIComponent(fechaNacimiento.value);

    const res = await fetch(url);
    const r = await res.json();

    if (r.status === "ok") {
      Swal.fire("Éxito", "Inscripción realizada", "success");
      form.reset();
      actualizar();
    } 
    else if (r.status === "duplicate") {
      Swal.fire("Duplicado", "Cédula ya registrada", "warning");
    } 
    else if (r.status === "email_duplicate") {
      Swal.fire("Duplicado", "Correo ya registrado", "warning");
    } 
    else if (r.status === "full") {
      Swal.fire("Cupos llenos", "No hay disponibilidad", "error");
    } 
    else {
      throw new Error("ERROR_SERVER");
    }

  } catch (err) {
    Swal.fire("Error", err.message, "error");
  }

  boton.disabled = false;
  boton.innerText = "Inscribirse";
});

// 📊 CONTADOR
async function actualizar() {
  try {
    const res = await fetch(API_URL + "?action=get");
    const data = await res.json();

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