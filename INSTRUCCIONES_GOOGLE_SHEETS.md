# 📋 Guía Paso a Paso: Conectar tu Invitación a Google Sheets

Sigue estos sencillos pasos para que cada confirmación que hagan tus invitados se guarde automáticamente en tu propia hoja de cálculo de Google.

---

### Paso 1: Crear la Hoja de Google Sheets
1. Entra a [Google Sheets (Hojas de cálculo)](https://sheets.google.com).
2. Haz clic en **"Crear en blanco"** (+).
3. Nómbrala como gustes, por ejemplo: `Confirmaciones Graduación - Rodrigo`.
4. *(Opcional)* Puedes dejar la primera fila vacía; el script colocará los encabezados automáticamente con un formato elegante en color azul y dorado.

---

### Paso 2: Abrir el editor de código (Apps Script)
1. En el menú superior de tu hoja de cálculo, haz clic en **Extensiones** > **Apps Script**.
2. Se abrirá una nueva pestaña con un editor de código.
3. Si hay código previo como `function myFunction() { ... }`, **bórralo completamente**.

---

### Paso 3: Pegar el código del Webhook
1. Abre el archivo `google-apps-script.js` que dejamos en esta carpeta.
2. Copia todo su contenido y pégalo en el editor de Apps Script.
3. Haz clic en el ícono de **Guardar** (el disquete 💾) o presiona `Ctrl + S`.

---

### Paso 4: Publicar la Aplicación Web (¡Paso Clave!)
1. En la esquina superior derecha de Apps Script, haz clic en el botón azul **Implementar** (*Deploy*) y selecciona **Nueva implementación** (*New deployment*).
2. Haz clic en el ícono de engranaje ⚙️ junto a "Seleccionar tipo" y elige **Aplicación web** (*Web app*).
3. Llena estos 3 campos con mucho cuidado:
   * **Descripción:** `API Invitación Rodrigo`
   * **Ejecutar como:** `Yo (tu correo de Google)`
   * **Quién tiene acceso:** Selecciona **`Cualquier persona`** (*Anyone*).
     > ⚠️ **Muy Importante:** Debes elegir *"Cualquier persona"*; de lo contrario, el formulario de la invitación no tendrá permiso para guardar las respuestas de tus invitados.
4. Haz clic en **Implementar**.

---

### Paso 5: Autorizar permisos
1. Google te mostrará una ventana pidiendo autorización de tu propia cuenta. Haz clic en **Revisar permisos** (*Authorize access*).
2. Selecciona tu cuenta de Google.
3. Te aparecerá una pantalla que dice *"Google no ha verificado esta aplicación"* (es normal porque la creaste tú mismo).
4. Haz clic abajo donde dice **Configuración avanzada** (*Advanced*) y luego en **Ir a Proyecto (no seguro)** (*Go to Untitled project*).
5. Haz clic en **Permitir** (*Allow*).

---

### Paso 6: Copiar la URL y pegarla en tu proyecto
1. Copia la dirección que aparece bajo **URL de la aplicación web** (termina en `/exec`).
2. Abre el archivo `script.js` de tu invitación en tu editor de código.
3. En la línea 10, pega tu URL dentro de las comillas:
   ```javascript
   const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycb...TU_CODIGO.../exec";
   ```
4. Guarda el archivo `script.js`.

---

### Paso 7: ¡Probar tu invitación!
1. Abre `index.html` en tu navegador.
2. Llena el formulario con tus propios datos de prueba y presiona **Confirmar Asistencia**.
3. Abre tu Google Sheets: ¡verás aparecer una nueva fila al instante con tu nombre, WhatsApp, asistencia y mensaje! 🎉
