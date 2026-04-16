const API_URL = "https://script.google.com/macros/s/AKfycby_2REwuKiCR0YJZ_RjF8eU1h76JriUNYrrasfEixK0DUZkwF2nkIkZ0xDG0UcCObh8/exec";

let datos = [];

// 🔐 LOGIN
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

// 🔓 PANEL
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

// 📡 JSONP
function jsonp(action) {
  return new Promise((resolve) => {
    const script = document.createElement("script");

    script.src =
      API_URL +
      "?action=" + action +
      "&callback=handleResponse";

    document.body.appendChild(script);

    window.handleResponse = (data) => {
      resolve(data);
      script.remove();
    };
  });
}

// 📥 CARGAR
async function cargar() {
  datos = await jsonp("get");
  render(datos);

  document.getElementById("total").innerText =
    "Total inscritos: " + datos.length;
}

// 🎨 RENDER
function render(data) {
  const tabla = document.getElementById("tabla");
  tabla.innerHTML = "";

  data.forEach(d => {
    tabla.innerHTML += `
      <tr>
        <td>${d.Nombres}</td>
        <td>${d.Apellidos}</td>
        <td>${d.Cédula}</td>
        <td>${d.Teléfono}</td>
        <td>${d.Correo}</td>
      </tr>
    `;
  });
}

// 🔍 FILTRO
function filtrar() {
  const t = document.getElementById("buscar").value.toLowerCase();

  render(datos.filter(d =>
    d.Nombres.toLowerCase().includes(t) ||
    d.Apellidos.toLowerCase().includes(t) ||
    d.Cédula.toLowerCase().includes(t) ||
    d.Correo.toLowerCase().includes(t)
  ));
}

// 📄 CSV EXPORT
function descargarCSV() {
  let csv = "Nombres,Apellidos,Cedula,Telefono,Correo\n";

  datos.forEach(d => {
    csv += `${d.Nombres},${d.Apellidos},${d.Cédula},${d.Teléfono},${d.Correo}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "inscritos.csv";
  a.click();
}

// 🔁 AUTO LOGIN
window.addEventListener("DOMContentLoaded", () => {
  if (sessionStorage.getItem("admin") === "ok") {
    mostrarPanel();
  }
});