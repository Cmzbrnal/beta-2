# Guía de Conexión: Google Sheets con Web CIPRO

Esta guía explica cómo vincular la web de CIPRO con una hoja de cálculo en **Google Drive** para que la **Directiva** administre postulantes y miembros de forma 100% privada y segura.

---

## 1. Estructura de la Hoja de Cálculo

Crea una hoja de cálculo vacía en Google Sheets llamada **`CIPRO - Base de Datos Oficial`** con acceso exclusivo (compartida solo con los correos de la directiva).

El script creará automáticamente dos pestañas:

1. **Pestaña "Postulaciones" (Solo Directiva):**
   * **Columnas:** `ID`, `Fecha`, `Hora`, `Código UNI`, `Nombres y Apellidos`, `Correo Electrónico`, `WhatsApp / Celular`, `Carrera Profesional`, `Ciclo`, `Estado`.
   * Cada vez que alguien postula en la web, se inserta una nueva fila con el estado **`Postulación`**.
   * **Privacidad:** Ningún miembro común de la web tiene acceso a esta lista.

2. **Pestaña "Miembros" (Gestión de Acceso):**
   * **Columnas:** `Código UNI`, `Contraseña`, `Nombres y Apellidos`, `Correo Electrónico`, `Celular`, `Carrera Profesional`, `Ciclo`, `Estado`.
   * Aquí la directiva coloca a los miembros activos aprobados y les define una contraseña.
   * La web consulta esta pestaña cuando un miembro hace clic en **"Login Miembros"** ingresando su código UNI y contraseña.

---

## 2. Paso a Paso para Activar el Webhook en Google Sheets

1. Abre tu Google Sheet en el navegador.
2. Ve al menú superior: **Extensiones > Apps Script**.
3. Borra cualquier código que aparezca y pega todo el contenido de [`GOOGLE_SHEETS_SCRIPT.js`](./GOOGLE_SHEETS_SCRIPT.js).
4. Haz clic en el icono de **Guardar** (disquete).
5. En la parte superior derecha, haz clic en **Implementar > Nueva implementación** (*Deploy > New deployment*).
6. En el tipo de implementación (icono de engranaje), selecciona **Aplicación web** (*Web app*).
7. Configura los permisos:
   * **Descripción:** `Webhook CIPRO`
   * **Ejecutar como:** `Yo (tu correo)`
   * **Quién tiene acceso:** `Cualquier usuario` (*Anyone*) -> *(Necesario para que el servidor de la web pueda registrar las postulaciones).*
8. Haz clic en **Implementar**, autoriza los permisos de Google y copia la **URL de la aplicación web** (termina en `/exec`).

---

## 3. Conectar la URL con la Web

Crea o edita tu archivo `.env.local` en la raíz de `web-cipro` y coloca:

```env
# URL obtenida de Google Apps Script
GOOGLE_SHEETS_WEBHOOK=https://script.google.com/macros/s/TU_ID_DE_DESPLIEGUE/exec

# Clave secreta opcional para la directiva
CIPRO_DIRECTIVA_KEY=directiva_cipro_2026
```

¡Listo! A partir de ese momento:
* Cada postulación aparecerá en tiempo real en la pestaña **"Postulaciones"**.
* Cada miembro registrado en la pestaña **"Miembros"** podrá iniciar sesión en la web con su Código UNI y Contraseña.
