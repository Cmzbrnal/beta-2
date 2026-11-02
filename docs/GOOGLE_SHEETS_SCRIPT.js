const POSTULACIONES_SHEET = 'Postulaciones';
const MIEMBROS_SHEET = 'Miembros';

function setupSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  let postulaciones = ss.getSheetByName(POSTULACIONES_SHEET);
  if (!postulaciones) {
    postulaciones = ss.insertSheet(POSTULACIONES_SHEET);
    postulaciones.appendRow([
      'ID', 'Fecha', 'Hora', 'Código UNI', 'Nombres y Apellidos',
      'Correo Electrónico', 'WhatsApp / Celular', 'Carrera Profesional',
      'Ciclo', 'Estado'
    ]);
    postulaciones.getRange('A1:J1')
      .setFontWeight('bold')
      .setBackground('#FF5500')
      .setFontColor('#FFFFFF');
    postulaciones.setFrozenRows(1);
  }

  let miembros = ss.getSheetByName(MIEMBROS_SHEET);
  if (!miembros) {
    miembros = ss.insertSheet(MIEMBROS_SHEET);
    miembros.appendRow([
      'Código UNI', 'Contraseña', 'Nombres y Apellidos', 'Correo Electrónico',
      'Celular', 'Carrera Profesional', 'Ciclo', 'Estado'
    ]);
    miembros.getRange('A1:H1')
      .setFontWeight('bold')
      .setBackground('#131926')
      .setFontColor('#FFFFFF');
    miembros.setFrozenRows(1);
  }
}

function doPost(e) {
  try {
    setupSheets();
    const sheet = SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName(POSTULACIONES_SHEET);
    const body = JSON.parse((e.postData && e.postData.contents) || '{}');
    const data = body.data || body;
    const now = new Date();

    sheet.appendRow([
      data.id || `POST-${now.getTime()}`,
      data.fecha || Utilities.formatDate(now, 'America/Lima', 'dd/MM/yyyy'),
      data.hora || Utilities.formatDate(now, 'America/Lima', 'HH:mm:ss'),
      data.codigoUni || '',
      data.nombres || '',
      data.correo || '',
      data.whatsapp || '',
      data.carrera || '',
      data.ciclo || '',
      data.estado || 'Postulación'
    ]);

    return jsonResponse({
      success: true,
      message: 'Postulación registrada en Google Sheets'
    });
  } catch (error) {
    return jsonResponse({ success: false, error: String(error) });
  }
}

function doGet(e) {
  try {
    setupSheets();
    const params = e.parameter || {};
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    if (params.sheet === MIEMBROS_SHEET && params.codigoUni) {
      const values = ss.getSheetByName(MIEMBROS_SHEET).getDataRange().getValues();
      const codigoBuscado = String(params.codigoUni).trim().toUpperCase();

      for (let i = 1; i < values.length; i++) {
        if (String(values[i][0]).trim().toUpperCase() === codigoBuscado) {
          return jsonResponse({
            success: true,
            member: {
              codigoUni: values[i][0],
              password: String(values[i][1]),
              nombres: values[i][2],
              correo: values[i][3],
              celular: values[i][4],
              carrera: values[i][5],
              ciclo: values[i][6],
              estado: values[i][7] || 'Miembro'
            }
          });
        }
      }

      return jsonResponse({ success: false, message: 'Miembro no encontrado' });
    }

    if (params.sheet === POSTULACIONES_SHEET) {
      const values = ss.getSheetByName(POSTULACIONES_SHEET).getDataRange().getValues();
      const postulaciones = values.slice(1).map(row => ({
        id: row[0],
        fecha: row[1],
        hora: row[2],
        codigoUni: row[3],
        nombres: row[4],
        correo: row[5],
        whatsapp: row[6],
        carrera: row[7],
        ciclo: row[8],
        estado: row[9]
      }));

      return jsonResponse({
        success: true,
        total: postulaciones.length,
        postulaciones
      });
    }

    return jsonResponse({
      status: 'Activo',
      service: 'CIPRO Google Sheets Webhook'
    });
  } catch (error) {
    return jsonResponse({ success: false, error: String(error) });
  }
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
