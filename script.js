const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
const tabla = document.querySelector("#tablaContratos tbody");
const form = document.getElementById("formContrato");
const btnCancelar = document.getElementById("btnCancelar");

let editando = false;
let idEditando = null;

// 🟢 Cargar contratos al iniciar
async function cargarContratos() {
  const { data, error } = await supabase.from("contratos").select("*");
  if (error) {
    console.error("Error al cargar:", error);
    return;
  }

  tabla.innerHTML = "";
  data.forEach(c => {
    const fila = `
      <tr>
        <td>${c.id}</td>
        <td>${c.nombre_contrato}</td>
        <td>${c.tipo_contrato}</td>
        <td>${c.cuerpo_contrato}</td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="editar(${c.id}, '${c.nombre_contrato}', '${c.tipo_contrato}', '${c.cuerpo_contrato}')">✏️</button>
          <button class="btn btn-danger btn-sm" onclick="eliminar(${c.id})">🗑️</button>
        </td>
      </tr>`;
    tabla.innerHTML += fila;
  });
}

// 🟢 Guardar o actualizar contrato
form.addEventListener("submit", async e => {
  e.preventDefault();
  const contrato = {
    nombre_contrato: form.nombre_contrato.value,
    tipo_contrato: form.tipo_contrato.value,
    cuerpo_contrato: form.cuerpo_contrato.value
  };

  if (editando) {
    const { error } = await supabase
      .from("contratos")
      .update(contrato)
      .eq("id", idEditando);
    if (error) {
      alert("❌ Error al actualizar");
    } else {
      alert("✅ Contrato actualizado");
      editando = false;
      idEditando = null;
      form.reset();
      cargarContratos();
    }
  } else {
    const { error } = await supabase.from("contratos").insert([contrato]);
    if (error) {
      alert("❌ Error al guardar");
    } else {
      alert("✅ Contrato guardado");
      form.reset();
      cargarContratos();
    }
  }
});

// 🟠 Editar contrato
function editar(id, nombre, tipo, cuerpo) {
  form.nombre_contrato.value = nombre;
  form.tipo_contrato.value = tipo;
  form.cuerpo_contrato.value = cuerpo;
  editando = true;
  idEditando = id;
}

// 🔴 Eliminar contrato
async function eliminar(id) {
  if (confirm("¿Eliminar este contrato?")) {
    const { error } = await supabase.from("contratos").delete().eq("id", id);
    if (error) alert("❌ Error al eliminar");
    else {
      alert("✅ Eliminado");
      cargarContratos();
    }
  }
}

btnCancelar.addEventListener("click", () => {
  form.reset();
  editando = false;
  idEditando = null;
});

cargarContratos();
