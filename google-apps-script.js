function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Si la hoja está vacía, creamos los encabezados
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Fecha y Hora de Registro",
        "Nombre Completo",
        "Celular / WhatsApp",
        "¿Asistirá?",
        "Acompañantes",
        "Mensaje / Felicitaciones"
      ]);
      
      var headerRange = sheet.getRange(1, 1, 1, 6);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#0a1428");
      headerRange.setFontColor("#f6e27a");
    }
    
    // Extraer datos recibidos
    var fechaRegistro = new Date().toLocaleString("es-BO", { timeZone: "America/La_Paz" });
    var nombre = (e && e.parameter && e.parameter.nombre) ? e.parameter.nombre : "Sin nombre";
    var celular = (e && e.parameter && e.parameter.celular) ? e.parameter.celular : "Sin celular";
    var asistencia = (e && e.parameter && e.parameter.asistencia) ? e.parameter.asistencia : "No especificado";
    var acompanantes = (e && e.parameter && e.parameter.acompanantes) ? e.parameter.acompanantes : "0";
    var mensaje = (e && e.parameter && e.parameter.mensaje) ? e.parameter.mensaje : "Sin mensaje";
    
    // Insertar la fila
    sheet.appendRow([
      fechaRegistro,
      nombre,
      "'" + celular,
      asistencia,
      acompanantes,
      mensaje
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      "status": "success",
      "message": "Confirmación guardada correctamente"
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      "status": "error",
      "message": error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("Servicio de confirmaciones activo para Rodrigo Martinez.");
}
