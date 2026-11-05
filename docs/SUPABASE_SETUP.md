# Configuración de Supabase para contenido CIPRO

Supabase almacenará el contenido editable de la Biblioteca, Eventos y Capacitaciones. Google Sheets seguirá gestionando postulaciones y miembros/login.

## 1. Crear las tablas

En Supabase abre **SQL Editor**, crea una consulta nueva, pega el contenido de [`../supabase/schema.sql`](../supabase/schema.sql) y pulsa **Run**.

El script crea:

- `content_entries`: notas y contenido editable.
- `content_files`: metadatos de archivos.
- Bucket público `cipro-content`: PDF e imágenes.

## 2. Variables de entorno en Vercel

En **Project Settings → Environment Variables** agrega para **Production, Preview y Development**:

```env
SUPABASE_URL=https://xfgpbowzzogqziqwkiwz.supabase.co
SUPABASE_SERVICE_ROLE_KEY=pega_aqui_la_service_role_key
```

La `service_role key` se obtiene en **Project Settings → API**. Nunca la pongas en componentes `use client`, GitHub, ni en una variable que empiece por `NEXT_PUBLIC_`.

Después de guardar las variables, ejecuta un nuevo redeploy en Vercel.

## 3. Qué permanece en Google Sheets

No se cambia el webhook actual:

- `Postulaciones`: envíos del formulario.
- `Miembros`: usuarios y contraseñas para login.

Las rutas de contenido de la aplicación usan Supabase y ya no dependen de las pestañas `Contenido` y `Archivos` de Sheets.
