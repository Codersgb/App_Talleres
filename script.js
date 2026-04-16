const API_URL = "https://script.google.com/macros/s/AKfycbyNsJhTaYrOlsjuVFVKMDtRKNWPEpbr2GAArEwerV-cLDJAmtbdeSMWCJbImJNMmKglXQ/exec";
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

// 🚀 FETCH SEGURO (SIN CORS PRE-FLIGHT)
async function fetchSeguro(body) {
  const res = await fetch(API_URL, {
    method: "POST",
    body: body,
    redirect: "follow"
  });

  return await res.json();
}

// 🚀 REGISTRO
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  boton.disabled = true;
  boton.innerText = "Procesando...";

  try {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo.value)) {
      throw new Error("EMAIL_INVALIDO");
    }

    const formData = new URLSearchParams();

    formData.append("action", "add");
    formData.append("nombres", nombres.value);
    formData.append("apellidos", apellidos.value);
    formData.append("cedula", cedula.value);
    formData.append("telefono", telefono.value);
    formData.append("correo", correo.value);
    formData.append("fechaNacimiento", fechaNacimiento.value);

    const r = await fetchSeguro(formData);

    switch (r.status) {
      case "ok":
        Swal.fire("Éxito", "Inscripción realizada", "success");
        form.reset();
        actualizar();
        break;

      case "duplicate":
        Swal.fire("Duplicado", "Cédula ya registrada", "warning");
        break;

      case "email_duplicate":
        Swal.fire("Duplicado", "Correo ya registrado", "warning");
        break;

      case "full":
        Swal.fire("Cupos llenos", "No hay disponibilidad", "error");
        break;

      default:
        throw new Error("ERROR_SERVIDOR");
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