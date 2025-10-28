const tabla = document.querySelector("#tablaContratos tbody");
const form = document.querySelector("#formContrato");
const btnCancelar = document.querySelector("#btnCancelar");
let editId = null;

// 🔹 Al cargar la página
document.addEventListener("DOMContentLoaded", cargarContratos);

// 📖 READ
async function cargarContratos() {
  tabla.innerHTML = `<tr><td colspan="5" class="text-center">Cargando...</td></tr>`;
  try {
    const res = await fetch(`${SUPABASE_URL}?select=*`, {
      method: "GET",
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json"
      }
    });

    if (!res.ok) throw new Error("Error al obtener contratos");
    const data = await res.json();

    tabla.innerHTML = "";
    if (data.length === 0) {
      tabla.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No hay contratos registrados</td></tr>`;
      return;
    }

    data.forEach(row => {
      tabla.innerHTML += `
        <tr>
          <td>${row.id}</td>
          <td>${row.nombre_contrato}</td>
          <td>${row.tipo_contrato}</td>
          <td>${row.cuerpo_contrato}</td>
          <td>
            <button class="btn btn-warning btn-sm" onclick="editar(${row.id}, '${row.nombre_contrato}', '${row.tipo_contrato}', '${row.cuerpo_contrato}')">Editar</button>
            <button class="btn btn-danger btn-sm" onclick="eliminar(${row.id})">Eliminar</button>
          </td>
        </tr>`;
    });
  } catch (err) {
    console.error(err);
    tabla.innerHTML = `<tr><td colspan="5" class="text-center text-danger">Error al cargar contratos</td></tr>`;
  }
}

// ➕ CREATE / ✏️ UPDATE
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const contrato = {
    nombre_contrato: document.querySelector("#nombre_contrato").value,
    tipo_contrato: document.querySelector("#tipo_contrato").value,
    cuerpo_contrato: document.querySelector("#cuerpo_contrato").value
  };

  try {
    const method = editId ? "PATCH" : "POST";
    const url = editId ? `${SUPABASE_URL}?id=eq.${editId}` : SUPABASE_URL;

    const res = await fetch(url, {
      method,
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(contrato)
    });

    if (!res.ok) throw new Error("Error al guardar");

    alert(editId ? "Contrato actualizado" : "Contrato agregado");
    form.reset();
    editId = null;
    document.querySelector("#btnGuardar").textContent = "Guardar";
    cargarContratos();
  } catch (err) {
    alert("❌ Error: " + err.message);
  }
});

// 🗑 DELETE
async function eliminar(id) {
  if (!confirm("¿Seguro que deseas eliminar este contrato?")) return;
  try {
    const res = await fetch(`${SUPABASE_URL}?id=eq.${id}`, {
      method: "DELETE",
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`
      }
    });

    if (!res.ok) throw new Error("Error al eliminar");
    alert("Contrato eliminado correctamente");
    cargarContratos();
  } catch (err) {
    alert("❌ Error: " + err.message);
  }
}

// ✏️ EDIT
function editar(id, nombre, tipo, cuerpo) {
  editId = id;
  document.querySelector("#nombre_contrato").value = nombre;
  document.querySelector("#tipo_contrato").value = tipo;
  document.querySelector("#cuerpo_contrato").value = cuerpo;
  document.querySelector("#btnGuardar").textContent = "Actualizar";
}

// 🔁 CANCELAR
btnCancelar.addEventListener("click", () => {
  form.reset();
  editId = null;
  document.querySelector("#btnGuardar").textContent = "Guardar";
});

