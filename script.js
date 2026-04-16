const API_URL = "https://script.google.com/macros/s/AKfycbyNsJhTaYrOlsjuVFVKMDtRKNWPEpbr2GAArEwerV-cLDJAmtbdeSMWCJbImJNMmKglXQ/exec";
const MAX_CUPOS = 15;

const form = document.getElementById("formulario");
const boton = document.getElementById("inscribirse");

function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function fetchSeguro(url, options, reintentos = 2) {
  try {
    const res = await fetch(url, options);

    if (!res.ok) throw new Error("HTTP_" + res.status);

    return await res.json();

  } catch (err) {
    console.error("FETCH ERROR:", err);

    if (reintentos > 0) {
      await delay(1000);
      return fetchSeguro(url, options, reintentos - 1);
    }

    throw err;
  }
}

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

    const r = await fetchSeguro(API_URL + "?action=add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (!r || !r.status) throw new Error("RESPUESTA_INVALIDA");

    switch (r.status) {
      case "ok":
        Swal.fire("Éxito", "Inscripción realizada", "success");
        form.reset();
        break;

      case "duplicate":
        Swal.fire("Duplicado", "Cédula ya registrada", "warning");
        break;

      case "email_duplicate":
        Swal.fire("Duplicado", "Correo ya registrado", "warning");
        break;

      case "full":
        Swal.fire("Cupos llenos", "Sin disponibilidad", "error");
        break;

      default:
        throw new Error("STATUS_DESCONOCIDO");
    }

  } catch (err) {
    console.error(err);

    let msg = "Error desconocido";

    if (err.message === "EMAIL_INVALIDO") msg = "Correo inválido";
    if (err.message === "HTTP_500") msg = "Error del servidor";
    if (err.message === "RESPUESTA_INVALIDA") msg = "Respuesta inválida del servidor";
    if (err.message === "STATUS_DESCONOCIDO") msg = "Error inesperado";

    Swal.fire("Error", msg, "error");

  } finally {
    boton.disabled = false;
    boton.innerText = "Inscribirse";
  }
});