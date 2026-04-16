const API_URL = "https://script.google.com/macros/s/AKfycbwg47pE-eyOGU5PQIO6adfunrKTqg8K6lGcfTC6KL_dAMNMzrUbVGYfBgqDSYHekEd1ng/exec";
const MAX_CUPOS = 15;

const form = document.getElementById("formulario");
const boton = document.getElementById("inscribirse");
const contador = document.getElementById("contador");
const mensaje = document.getElementById("mensaje");

function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// 🔁 FETCH SIN CORS (NO JSON)
async function fetchSeguro(url, body, reintentos = 2) {
  try {
    const res = await fetch(url, {
      method: "POST",
      body: body
    });

    if (!res.ok) throw new Error("HTTP_" + res.status);

    return await res.json();

  } catch (err) {
    console.error("FETCH ERROR:", err);

    if (reintentos > 0) {
      await delay(1000);
      return fetchSeguro(url, body, reintentos - 1);
    }

    throw err;
  }
}

// 🚀 ENVÍO FORMULARIO
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  boton.disabled = true;
  boton.innerText = "Procesando...";

  const data = {
    nombres: nombres.value.trim(),
    apellidos: apellidos.value.trim(),
    cedula: cedula.value.trim(),
    telefono: telefono.value.trim(),
    correo: correo.value.trim(),
    fechaNacimiento: fechaNacimiento.value
  };

  try {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(data.correo)) {
      throw new Error("EMAIL_INVALIDO");
    }

    // 🔥 FORMATO COMPATIBLE CON APPS SCRIPT
    const formData = new URLSearchParams();

    formData.append("action", "add");
    formData.append("nombres", data.nombres);
    formData.append("apellidos", data.apellidos);
    formData.append("cedula", data.cedula);
    formData.append("telefono", data.telefono);
    formData.append("correo", data.correo);
    formData.append("fechaNacimiento", data.fechaNacimiento);

    const r = await fetchSeguro(API_URL, formData);

    if (!r || !r.status) throw new Error("RESPUESTA_INVALIDA");

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
        throw new Error("STATUS_DESCONOCIDO");
    }

  } catch (err) {
    console.error(err);

    let msg = "Error desconocido";

    if (err.message === "EMAIL_INVALIDO") msg = "Correo inválido";
    if (err.message === "HTTP_404") msg = "URL incorrecta del servidor";
    if (err.message === "RESPUESTA_INVALIDA") msg = "Servidor no responde correctamente";

    Swal.fire("Error", msg, "error");

  } finally {
    boton.disabled = false;
    boton.innerText = "Inscribirse";
  }
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

  } catch (err) {
    console.error("Error contador:", err);
  }
}

actualizar();