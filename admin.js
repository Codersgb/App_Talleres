const API_URL = "https://script.google.com/macros/s/AKfycbxMb6EOyMrBmYP2sx0lgaIyrMPvMXUpg0aSkm8_9rn9BXG-HGEUTH7XIAg9zTQM28R94A/execc";

let datos = [];

// 🔐 LOGIN
function login() {
  const u = document.getElementById("user").value;
  const p = document.getElementById("pass").value;

  if (u === "admin" && p === "12345") {
    sessionStorage.setItem("admin", "ok");
    mostrar();
  } else {
    Swal.fire("Error", "Credenciales incorrectas", "error");
  }
}

function mostrar() {
  document.getElementById("loginBox").style.display = "none";
  document.getElementById("panel").style.display = "block";
  cargar();
}

function logout() {
  sessionStorage.removeItem("admin");
  location.href = "index.html";
}

// 🔥 JSONP
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
    "Total: " + datos.length;
}

// 🎨 TABLA
function render(data) {
  const t = document.getElementById("tabla");
  t.innerHTML = "";

  data.forEach(d => {
    t.innerHTML += `
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
  const v = document.getElementById("buscar").value.toLowerCase();

  render(datos.filter(d =>
    d.Nombres.toLowerCase().includes(v) ||
    d.Apellidos.toLowerCase().includes(v) ||
    d.Cédula.toLowerCase().includes(v) ||
    d.Correo.toLowerCase().includes(v)
  ));
}

// 📄 EXPORT CSV
function exportar() {
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

// auto login
window.addEventListener("DOMContentLoaded", () => {
  if (sessionStorage.getItem("admin") === "ok") {
    mostrar();
  }
});
