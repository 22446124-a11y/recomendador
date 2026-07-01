// 🔄 Carga apps directamente desde apps.json
async function actualizarAppsConIA() {
  const response = await fetch("/apps.json");
  const appsOriginales = await response.json();
  return appsOriginales;
}

// 🧠 Genera el ranking de apps (Top 3 + botón Ver más)
function generarRanking(apps, selectedFeatures) {
  const tableContainer = document.getElementById("rankingTable");
  tableContainer.innerHTML = ""; // limpiar antes de insertar

  const todasLasCaracteristicas = [
    "Restricción De Pantalla", "Geolocalización", "Monitoreo De Redes Sociales",
    "Historial De Navegación", "Bloqueo De Apps", "Filtrado De Contenido Web",
    "Supervisión De Llamadas Y Mensajes", "Informes De Actividad",
    "Gestión De Tiempo De Pantalla", "Control Remoto"
  ];

  // Calcular coincidencias
  const appsConCoincidencias = apps.map(app => {
    const matchCount = app.caracteristicas.filter(c => selectedFeatures.includes(c)).length;
    return { ...app, coincidencias: matchCount };
  });

  // Ordenar por coincidencias
  appsConCoincidencias.sort((a, b) => b.coincidencias - a.coincidencias);

  // Función para construir tabla mostrando SOLO coincidencias
  function construirTabla(lista, titulo) {
    let html = `<h3>${titulo}</h3><table><thead><tr><th>App</th>`;
    todasLasCaracteristicas.forEach(carac => {
      html += `<th>${carac}</th>`;
    });
    html += "<th>Coincidencias</th><th>Link</th></tr></thead><tbody>";

    lista.forEach(app => {
      html += `<tr><td>${app.nombre}</td>`;
      let coincidencias = 0;

      todasLasCaracteristicas.forEach(carac => {
        const coincide = selectedFeatures.includes(carac) && app.caracteristicas.includes(carac);
        if (coincide) coincidencias++;
        html += `<td>${coincide ? "✅" : ""}</td>`;
      });

      html += `<td>${coincidencias}</td>`;
      html += `<td><a href="${app.link}" target="_blank">Descargar</a></td></tr>`;
    });

    html += "</tbody></table>";
    return html;
  }

  // Mostrar solo Top 3
  const top3 = appsConCoincidencias.slice(0, 3);
  tableContainer.innerHTML = construirTabla(top3, "🏆 Top 3 recomendaciones");

  // Botón para ver más
  const boton = document.createElement("button");
  boton.textContent = "Ver más recomendaciones";
  boton.onclick = () => {
    const resto = appsConCoincidencias.slice(3);
    tableContainer.innerHTML += construirTabla(resto, "📋 Otras recomendaciones");
    boton.remove();
  };
  tableContainer.appendChild(boton);
}

// 🚀 Evento del formulario
document.getElementById("appForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const edad = parseInt(document.getElementById("edad").value);
  const selectedFeatures = Array.from(document.querySelectorAll("input[type='checkbox']:checked"))
    .map(cb => cb.value);

  const apps = await actualizarAppsConIA();

  let bestMatch = null;
  let maxScore = -1;

  apps.forEach(app => {
    const matchCount = app.caracteristicas.filter(c => selectedFeatures.includes(c)).length;
    if (matchCount > maxScore) {
      maxScore = matchCount;
      bestMatch = app;
    }
  });

  const container = document.getElementById("recommendation");
  if (bestMatch) {
    container.innerHTML = `
      <h3>${bestMatch.nombre}</h3>
      <p><strong>Edad recomendada:</strong> ${edad} años</p>
      <p><strong>Características coincidentes:</strong> ${maxScore}</p>
      <p><strong>Ventajas:</strong> ${bestMatch.ventajas || "No especificadas"}</p>
      <p><strong>Desventajas:</strong> ${bestMatch.desventajas || "No especificadas"}</p>
      <p><a href="${bestMatch.link}" target="_blank">🔗 Descargar App</a></p>
    `;
  } else {
    container.innerHTML = `<p>No se encontró una app que cumpla con los criterios seleccionados.</p>`;
  }

  generarRanking(apps, selectedFeatures);
});

// 🔄 Simulación de actualización diaria
function actualizarDatosDiarios() {
  console.log("📅 Datos actualizados automáticamente al iniciar el servidor");
}
actualizarDatosDiarios();

// 📖 Mostrar bitácora de actualizaciones
async function mostrarBitacora() {
  const response = await fetch("/bitacora");
  const logs = await response.json();

  const container = document.getElementById("bitacoraLogs");
  container.innerHTML = "<ul>" + logs.map(log => `<li>${log}</li>`).join("") + "</ul>";
}

// Llamar al cargar la página
mostrarBitacora();


