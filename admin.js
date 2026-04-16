const API_URL = "https://script.google.com/macros/s/AKfycbyNsJhTaYrOlsjuVFVKMDtRKNWPEpbr2GAArEwerV-cLDJAmtbdeSMWCJbImJNMmKglXQ/exec";

let datos = [];

// LOGIN
function login() {
  if (user.value === "admin" && pass.value === "12345") {
    sessionStorage.setItem("admin", "ok");
    mostrar();
  } else {
    Swal.fire("Error", "Credenciales incorrectas", "error");
  }
}

function mostrar() {
  loginBox.style.display = "none";
  panel.style.display = "block";
  cargar();
}

function logout() {
  sessionStorage.clear();
  location.href = "index.html";
}

// CARGAR
async function cargar() {
  const res = await fetch(API_URL + "?action=get");
  datos = await res.json();

  render(datos);
  total.innerText = "Total: " + datos.length;
}

// RENDER
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

// ELIMINAR
async function eliminar(id) {
  await fetch(API_URL, {
    method: "POST",
    body: new URLSearchParams({
      action: "delete",
      id: id
    })
  });

  Swal.fire("Eliminado", "", "success");
  cargar();
}

// FILTRO
function filtrar() {
  const t = buscar.value.toLowerCase();

  render(datos.filter(d =>
    d.Nombres.toLowerCase().includes(t) ||
    d.Apellidos.toLowerCase().includes(t) ||
    d.Cédula.toLowerCase().includes(t) ||
    d.Correo.toLowerCase().includes(t)
  ));
}

// PDF
function descargarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.text("Inscritos", 10, 10);

  let y = 20;

  datos.forEach(d => {
    doc.text(`${d.Nombres} ${d.Apellidos} - ${d.Correo}`, 10, y);
    y += 10;
  });

  doc.save("inscritos.pdf");
}

// AUTO LOGIN
if (sessionStorage.getItem("admin") === "ok") {
  mostrar();
}