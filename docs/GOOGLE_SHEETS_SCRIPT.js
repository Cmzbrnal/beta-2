const SHEETS = {
  postulaciones: 'Postulaciones',
  miembros: 'Miembros',
  contenido: 'Contenido',
  archivos: 'Archivos'
};

function setupSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ensureSheet(ss, SHEETS.postulaciones, [
    'ID', 'Fecha', 'Hora', 'Código UNI', 'Nombres y Apellidos',
    'Correo Electrónico', 'WhatsApp / Celular', 'Carrera Profesional',
    'Ciclo', 'Estado'
  ], '#FF5500');
  ensureSheet(ss, SHEETS.miembros, [
    'Código UNI', 'Contraseña', 'Nombres y Apellidos', 'Correo Electrónico',
    'Celular', 'Carrera Profesional', 'Ciclo', 'Estado'
  ], '#131926');
  ensureSheet(ss, SHEETS.contenido, [
    'ID', 'Código UNI', 'Proyecto', 'Contenido JSON', 'Actualizado'
  ], '#131926');
  ensureSheet(ss, SHEETS.archivos, [
    'ID', 'Código UNI', 'Sección', 'Nombre', 'Tipo', 'URL', 'Drive ID', 'Fecha'
  ], '#131926');
}

function ensureSheet(ss, name, headers, color) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length)
      .setFontWeight('bold')
      .setBackground(color)
      .setFontColor('#FFFFFF');
    sheet.setFrozenRows(1);
  }
}

function doPost(e) {
  try {
    setupSheets();
    const body = JSON.parse(e.postData.contents || '{}');

    if (body.action === 'saveContent' || body.action === 'deleteContent') {
      return handleContent(body);
    }
    if (body.action === 'uploadFile' || body.action === 'deleteFile') {
      return handleFile(body);
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS.postulaciones);
    const data = body.data || body;
    sheet.appendRow([
      data.id || `POST-${Date.now()}`,
      data.fecha || Utilities.formatDate(new Date(), 'America/Lima', 'dd/MM/yyyy'),
      data.hora || Utilities.formatDate(new Date(), 'America/Lima', 'HH:mm:ss'),
      data.codigoUni || '',
      data.nombres || '',
      data.correo || '',
      data.whatsapp || '',
      data.carrera || '',
      data.ciclo || '',
      data.estado || 'Postulación'
    ]);
    return jsonResponse({ success: true, message: 'Postulación registrada en Google Sheets' });
  } catch (error) {
    return jsonResponse({ success: false, error: String(error) });
  }
}

function handleContent(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS.contenido);
  const memberCode = String(data.memberCode || '').trim().toUpperCase();
  const project = String(data.project || '').trim();
  const id = `${memberCode}::${project}`;
  const values = sheet.getDataRange().getValues();
  let rowNumber = -1;

  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0]) === id) {
      rowNumber = i + 1;
      break;
    }
  }

  if (data.action === 'deleteContent') {
    if (rowNumber !== -1) sheet.deleteRow(rowNumber);
    return jsonResponse({ success: true });
  }

  const content = JSON.stringify(data.content || {});
  const row = [id, memberCode, project, content, new Date()];
  if (rowNumber === -1) sheet.appendRow(row);
  else sheet.getRange(rowNumber, 1, 1, row.length).setValues([row]);
  return jsonResponse({ success: true, content: data.content || {} });
}

function handleFile(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS.archivos);
  const memberCode = String(data.memberCode || '').trim().toUpperCase();

  if (data.action === 'deleteFile') {
    const fileId = String(data.fileId || '');
    const values = sheet.getDataRange().getValues();
    for (let i = values.length - 1; i >= 1; i--) {
      if (String(values[i][0]) === fileId &&
          String(values[i][1]).trim().toUpperCase() === memberCode) {
        try {
          DriveApp.getFileById(String(values[i][6])).setTrashed(true);
        } catch (error) {
          console.warn(`No se pudo eliminar el archivo de Drive: ${error}`);
        }
        sheet.deleteRow(i + 1);
        break;
      }
    }
    return jsonResponse({ success: true });
  }

  const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp', 'image/gif'];
  const mimeType = String(data.mimeType || '');
  if (!allowedTypes.includes(mimeType)) throw new Error('Tipo de archivo no permitido.');
  if (!data.base64 || !data.fileName) throw new Error('Faltan datos del archivo.');

  const blob = Utilities.newBlob(
    Utilities.base64Decode(data.base64),
    mimeType,
    String(data.fileName)
  );
  const file = DriveApp.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  const id = `FILE-${Date.now()}`;
  const url = `https://drive.google.com/uc?export=download&id=${file.getId()}`;
  sheet.appendRow([
    id, memberCode, data.project || 'Biblioteca', file.getName(),
    mimeType, url, file.getId(), new Date()
  ]);
  return jsonResponse({
    success: true,
    file: { id, name: file.getName(), mimeType, url }
  });
}

function doGet(e) {
  try {
    setupSheets();
    const params = e.parameter || {};
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    if (params.sheet === SHEETS.miembros && params.codigoUni) {
      const values = ss.getSheetByName(SHEETS.miembros).getDataRange().getValues();
      const searchCode = String(params.codigoUni).trim().toUpperCase();
      for (let i = 1; i < values.length; i++) {
        if (String(values[i][0]).trim().toUpperCase() === searchCode) {
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

    if (params.sheet === SHEETS.postulaciones) {
      const values = ss.getSheetByName(SHEETS.postulaciones).getDataRange().getValues();
      return jsonResponse({
        success: true,
        total: Math.max(values.length - 1, 0),
        postulaciones: values.slice(1).map(row => ({
          id: row[0], fecha: row[1], hora: row[2], codigoUni: row[3],
          nombres: row[4], correo: row[5], whatsapp: row[6],
          carrera: row[7], ciclo: row[8], estado: row[9]
        }))
      });
    }

    if (params.sheet === SHEETS.contenido) {
      const id = `${String(params.memberCode || '').trim().toUpperCase()}::${String(params.project || '').trim()}`;
      const values = ss.getSheetByName(SHEETS.contenido).getDataRange().getValues();
      const row = values.slice(1).find(item => String(item[0]) === id);
      return jsonResponse({ success: true, content: row ? JSON.parse(row[3] || '{}') : {} });
    }

    if (params.sheet === SHEETS.archivos) {
      const memberCode = String(params.memberCode || '').trim().toUpperCase();
      const project = String(params.project || '').trim();
      const values = ss.getSheetByName(SHEETS.archivos).getDataRange().getValues();
      const files = values.slice(1)
        .filter(row => String(row[1]).toUpperCase() === memberCode && (!project || String(row[2]) === project))
        .map(row => ({ id: row[0], name: row[3], mimeType: row[4], url: row[5] }));
      return jsonResponse({ success: true, files });
    }

    return jsonResponse({ status: 'Activo', service: 'CIPRO Google Sheets Webhook' });
  } catch (error) {
    return jsonResponse({ success: false, error: String(error) });
  }
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
