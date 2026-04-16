const API_URL = "https://script.google.com/macros/s/AKfycbz9tpUb16tosD93jJzacR9MnkDsepoK2hE_gK1PCQ0LthMgBrtpcOjwun89wL0jeV4IxA/exec";

let datos = [];

// 🔐 LOGIN SIMPLE
function login() {
  const user = document.getElementById("user").value;
  const pass = document.getElementById("pass").value;

  if (user === "admin" && pass === "12345") {
    sessionStorage.setItem("admin", "ok");
    mostrarPanel();
  } else {
    Swal.fire("Error", "Credenciales incorrectas", "error");
  }
}

// 🔓 MOSTRAR PANEL
function mostrarPanel() {
  document.getElementById("loginBox").style.display = "none";
  document.getElementById("panel").style.display = "block";
  cargar();
}

// 🚪 LOGOUT
function logout() {
  sessionStorage.removeItem("admin");
  location.href = "index.html";
}

// 📥 CARGAR DATOS
async function cargar() {
  const res = await fetch(API_URL + "?action=get");
  datos = await res.json();

  render(datos);
  document.getElementById("total").innerText = "Total inscritos: " + datos.length;
}

// 🎨 RENDER TABLA
function render(data) {
  const tabla = document.getElementById("tabla");
  tabla.innerHTML = "";

  data.forEach(d => {
    tabla.innerHTML += `
      <tr>
        <td>${d.Nombres}</td>
        <td>${d.Apellidos}</td>
        <td>${d.Cedula}</td>
        <td>${d.Telefono}</td>
        <td>${d.Correo}</td>
        <td>
          <button class="btn-eliminar" onclick="eliminar('${d.ID}')">
            Eliminar
          </button>
        </td>
      </tr>
    `;
  });
}

// ❌ ELIMINAR
async function eliminar(id) {
  const confirmacion = await Swal.fire({
    title: "¿Eliminar registro?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí"
  });

  if (!confirmacion.isConfirmed) return;

  const url =
    API_URL +
    "?action=delete" +
    "&id=" + encodeURIComponent(id);

  await fetch(url);

  Swal.fire("Eliminado", "", "success");
  cargar();
}

// 🔍 FILTRAR
function filtrar() {
  const t = document.getElementById("buscar").value.toLowerCase();

  render(datos.filter(d =>
    d.Nombres.toLowerCase().includes(t) ||
    d.Apellidos.toLowerCase().includes(t) ||
    d.Cedula.toLowerCase().includes(t) ||
    d.Correo.toLowerCase().includes(t)
  ));
}

// 📄 PDF (BÁSICO SIN LIBRERÍAS COMPLEJAS)
function descargarPDF() {
  let contenido = "LISTADO DE INSCRITOS\n\n";

  datos.forEach(d => {
    contenido += `${d.Nombres} ${d.Apellidos} - ${d.Cédula} - ${d.Correo}\n`;
  });

  const blob = new Blob([contenido], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "inscritos.txt";
  a.click();
}

// 🔁 AUTO LOGIN
window.addEventListener("DOMContentLoaded", () => {
  if (sessionStorage.getItem("admin") === "ok") {
    mostrarPanel();
  }
});