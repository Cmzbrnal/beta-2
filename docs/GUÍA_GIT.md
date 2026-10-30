# 🚀 Guía Maestra de Git y GitHub - Proyecto CIPRO

Esta guía contiene todo lo que necesitas saber para gestionar el código de este proyecto de manera segura y eficiente.

---

## 1. El Flujo de Trabajo Básico (Subir cambios)

Para subir tus cambios a GitHub, siempre sigue este orden en tu terminal (PowerShell o VS Code):

1. **`git status`**: Opcional, pero recomendado para ver qué archivos has modificado.
2. **`git add .`**: Prepara todos los archivos modificados para el commit.
3. **`git commit -m "Descripción de lo que hiciste"`**: Crea un "punto de guardado" local con un mensaje descriptivo.
4. **`git push origin main`**: Sube tus puntos de guardado locales a la nube (GitHub).

---

## 2. Cómo Volver atrás (El Botón de Pánico 🚨)

Si algo se rompe y quieres regresar a una versión que funcionaba, tienes varias opciones:

### A. Deshacer cambios que NO has guardado (Commit)
Si editaste un archivo, no has hecho `commit`, y quieres que vuelva a estar como al principio:
```powershell
git checkout -- nombre-del-archivo.tsx
# O para deshacer TODO lo que no has guardado:
git reset --hard
```

### B. Volver a una versión anterior (Después de un Commit)
1. Busca el ID del commit al que quieres volver:
   ```powershell
   git log --oneline -n 10
   ```
2. Copia el código de 7 caracteres (ej: `a1b2c3d`) y ejecuta:
   ```powershell
   git reset --hard a1b2c3d
   ```
   *⚠️ ADVERTENCIA: Esto borrará permanentemente todos los cambios hechos después de ese commit localmente.*

### C. Sincronización Forzada (`Force Push`) 🛠️
Si hiciste un `reset --hard` de un commit que ya estaba en GitHub, tu PC y la nube estarán "divergentes". Para arreglarlo y que GitHub acepte tu versión local como la única verdad:
```powershell
git push origin main --force
```
*⚠️ Nota: Solo úsalo cuando quieras borrar commits del historial de GitHub que ya no deseas que existan.*

---

## 3. Uso de Etiquetas (`Tags`) 🏷️

Los Tags son nombres humanos para commits específicos. Sirven para marcar hitos o versiones finales.

- **Crear un Tag local**: `git tag -a v1.0.0-Nombre -m "mensaje"`
- **Subir el Tag a GitHub**: `git push origin v1.0.0-Nombre`
- **Volver a un Tag**: `git checkout v1.0.0-Nombre`

---

## 4. Conceptos Clave de Git que debes conocer

- **Repositorio (Repo)**: La carpeta del proyecto que Git está vigilando.
- **Commit**: Una "foto" de tu código en un momento dado. Es un punto de restauración.
- **Main**: El nombre de la rama principal de tu código.
- **Remote (Origin)**: Es la versión de tu código que vive en los servidores de GitHub.

---

## 5. Historial de Commits y Avances Clave (Checkpoints)

Aquí llevaremos un registro de los grandes hitos alcanzados en el proyecto.

### 📍 Checkpoint 1: Inicialización y Activos
- **Fecha y Hora**: 2026-02-04 | 02:29 AM
- **Commit ID**: `6446554`
- **Detalles**: 
    - Se configuró la estructura base de Next.js 14.
    - Se migraron 141 frames de imagen de la secuencia local a la carpeta `public/` para permitir su carga en el Canvas.
    - Se implementó la lógica de precarga suave (Smart Preloader) del 0% al 100%.

### 📍 Checkpoint 2: Hero Section & Layout Finalizado (HITO ACTUAL) 🏆
- **Fecha y Hora**: 2026-02-04 | 03:26 AM
- **Commit ID**: `12e3288`
- **Tag**: `v1.0.0-Hero-Final`
- **Detalles**:
    - **Optimización de Canvas**: Se elevó la posición del loop reduciendo el espacio con el header en un 65% para un look más Hero.
    - **Re-branding**: Se cambió el título principal a "Gestión de Proyectos" con tipografía optimizada.
    - **Cleanup UX**: Se eliminó el subtítulo para un diseño minimalista y se ajustó la distancia entre el loop y el título (reducción del 25%).
    - **CTA**: Botón "Únete Ahora" con estilo pill y efectos de animación Framer Motion.
    - **Documentación**: Inclusión de esta guía maestra de Git.

---
*Guía actualizada por Antigravity tras la sincronización forzada del repositorio.*
