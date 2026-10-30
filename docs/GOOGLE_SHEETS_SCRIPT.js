/**
 * =========================================================================
 * CIPRO - SCRIPT DE INTEGRACIÓN CON GOOGLE SHEETS
 * =========================================================================
 * Este script se coloca en Google Sheets: Extensiones > Apps Script.
 * 
 * Gestiona 2 pestañas:
 * 1. "Postulaciones" -> Para nuevos postulantes (Privado para la Directiva).
 * 2. "Miembros"      -> Para miembros activos autorizados a ingresar a la web.
 */

// Inicializa las pestañas y encabezados automáticamente si no existen
function setupSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. Pestaña: Postulaciones
  let sheetPostulaciones = ss.getSheetByName("Postulaciones");
  if (!sheetPostulaciones) {
    sheetPostulaciones = ss.insertSheet("Postulaciones");
    const headers = [
      "ID",
      "Fecha",
      "Hora",
      "Código UNI",
      "Nombres y Apellidos",
      "Correo Electrónico",
      "WhatsApp / Celular",
      "Carrera Profesional",
      "Ciclo",
      "Estado"
    ];
    sheetPostulaciones.appendRow(headers);
    sheetPostulaciones.getRange("A1:J1").setFontWeight("bold").setBackground("#FF5500").setFontColor("#FFFFFF");
    sheetPostulaciones.setFrozenRows(1);
  }

  // 2. Pestaña: Miembros
  let sheetMiembros = ss.getSheetByName("Miembros");
  if (!sheetMiembros) {
    sheetMiembros = ss.insertSheet("Miembros");
    const headersMiembros = [
      "Código UNI",
      "Contraseña",
      "Nombres y Apellidos",
      "Correo Electrónico",
      "Celular",
      "Carrera Profesional",
      "Ciclo",
      "Estado"
    ];
    sheetMiembros.appendRow(headersMiembros);
    sheetMiembros.getRange("A1:H1").setFontWeight("bold").setBackground("#131926").setFontColor("#FFFFFF");
    sheetMiembros.setFrozenRows(1);

    // Fila de ejemplo
    sheetMiembros.appendRow([
      "20233999A",
      "cipro2026",
      "Miembro Directiva",
      "miembro@uni.pe",
      "987654321",
      "Ingeniería Industrial",
      "7mo Ciclo",
      "Miembro"
    ]);
  }
}

// RECIBE NUEVAS POSTULACIONES DESDE LA WEB (POST)
function doPost(e) {
  try {
    setupSheets();
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("Postulaciones");

    const body = JSON.parse(e.postData.contents);
    const data = body.data || body;

    const row = [
      data.id || ("POST-" + new Date().getTime()),
      data.fecha || Utilities.formatDate(new Date(), "America/Lima", "yyyy-MM-dd"),
      data.hora || Utilities.formatDate(new Date(), "America/Lima", "HH:mm:ss"),
      data.codigoUni || "",
      data.nombres || "",
      data.correo || "",
      data.whatsapp || "",
      data.carrera || "",
      data.ciclo || "",
      data.estado || "Postulación"
    ];

    sheet.appendRow(row);

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: "Postulación registrada en Google Sheets"
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// VALIDA EL INICIO DE SESIÓN DE MIEMBROS DESDE LA WEB (GET)
function doGet(e) {
  try {
    setupSheets();
    const params = e.parameter || {};
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // Consulta de miembro por Código UNI
    if (params.sheet === "Miembros" && params.codigoUni) {
      const sheet = ss.getSheetByName("Miembros");
      const values = sheet.getDataRange().getValues();
      const searchCode = params.codigoUni.trim().toUpperCase();

      for (let i = 1; i < values.length; i++) {
        const rowCode = String(values[i][0]).trim().toUpperCase();
        if (rowCode === searchCode) {
          return ContentService.createTextOutput(JSON.stringify({
            success: true,
            member: {
              codigoUni: values[i][0],
              password: String(values[i][1]),
              nombres: values[i][2],
              correo: values[i][3],
              celular: values[i][4],
              carrera: values[i][5],
              ciclo: values[i][6],
              estado: values[i][7] || "Miembro"
            }
          })).setMimeType(ContentService.MimeType.JSON);
        }
      }

      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: "Miembro no encontrado"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "Activo",
      service: "CIPRO Google Sheets Webhook"
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
