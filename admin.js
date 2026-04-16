const API_URL = "https://script.google.com/macros/s/AKfycbw0njnizfHbVHfOd92E2EBNtc0FsaCITE-t3bjkneBKODXyVqX5Fwxt2HO4KvioYWwCyQ/exec";
let datos = [];

window.addEventListener("DOMContentLoaded", () => {
  if (sessionStorage.getItem("adminAuth") === "true") {
    showPanel();
  }
});

function login() {
  const user = document.getElementById("user").value;
  const pass = document.getElementById("pass").value;

  if (user === "admin" && pass === "12345") {
    sessionStorage.setItem("adminAuth", "true");
    showPanel();
  } else {
    Swal.fire("Error", "Credenciales incorrectas", "error");
  }
}

function showPanel() {
  loginBox.style.display = "none";
  panel.style.display = "block";
  cargar();
}

function logout() {
  sessionStorage.clear();
  location.href = "index.html";
}

async function cargar() {
  const res = await fetch(API_URL + "?action=get");
  datos = await res.json();
  render(datos);
  total.innerText = `Total: ${datos.length}`;
}

function render(data) {
  tabla.innerHTML = "";

  data.forEach(d => {
    tabla.innerHTML += `
      <tr>
        <td>${d.Nombres}</td>
        <td>${d.Apellidos}</td>
        <td>${d.Cédula}</td>
        <td>${d.Teléfono}</td>
        <td>${d.Correo}</td>
        <td><button class="btn-eliminar" onclick="eliminar('${d.ID}')">Eliminar</button></td>
      </tr>
    `;
  });
}

async function eliminar(id) {
  const r = await Swal.fire({
    title: "¿Eliminar?",
    icon: "warning",
    showCancelButton: true
  });

  if (!r.isConfirmed) return;

  await fetch(API_URL + "?action=delete", {
    method: "POST",
    body: JSON.stringify({ id })
  });

  Swal.fire("Eliminado", "", "success");
  cargar();
}

function filtrar() {
  const t = buscar.value.toLowerCase();

  render(datos.filter(d =>
    d.Nombres.toLowerCase().includes(t) ||
    d.Apellidos.toLowerCase().includes(t) ||
    d.Cédula.toLowerCase().includes(t) ||
    d.Correo.toLowerCase().includes(t)
  ));
}

function descargarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.text("Listado de Inscritos", 10, 10);

  let y = 20;

  datos.forEach(d => {
    doc.text(`${d.Nombres} ${d.Apellidos} | ${d.Correo}`, 10, y);
    y += 10;
  });

  doc.save("inscritos.pdf");
}