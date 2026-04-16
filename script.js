const API_URL = "https://script.google.com/macros/s/AKfycbyts2agN8dmA3NtgF2gabh97ZLp_l4oCDqifG4XNPRIMOsbLiVkaM6a3V-UnTtmdlZpDw/exec";
const MAX_CUPOS = 15;

const form = document.getElementById("formulario");
const contador = document.getElementById("contador");
const mensaje = document.getElementById("mensaje");
const boton = document.getElementById("inscribirse");

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

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(data.correo)) {
    Swal.fire("Error", "Correo inválido", "error");
    boton.disabled = false;
    boton.innerText = "Inscribirse";
    return;
  }

  try {
    const res = await fetch(API_URL + "?action=add", {
      method: "POST",
      body: JSON.stringify(data)
    });

    const r = await res.json();

    if (r.status === "duplicate") {
      Swal.fire("Atención", "Cédula ya registrada", "warning");
    } else if (r.status === "email_duplicate") {
      Swal.fire("Atención", "Correo ya registrado", "warning");
    } else if (r.status === "full") {
      Swal.fire("Cupos llenos", "No hay disponibilidad", "error");
    } else {
      Swal.fire("Éxito", "Inscripción realizada", "success");
      form.reset();
      actualizar();
    }

  } catch (err) {
    Swal.fire("Error", "No se pudo registrar", "error");
  }

  boton.disabled = false;
  boton.innerText = "Inscribirse";
});

async function actualizar() {
  const res = await fetch(API_URL + "?action=get");
  const data = await res.json();

  contador.innerText = `Inscritos: ${data.length} / ${MAX_CUPOS}`;

  if (data.length >= MAX_CUPOS) {
    form.style.display = "none";
    mensaje.innerText = "Cupos llenos";
  }
}

actualizar();
