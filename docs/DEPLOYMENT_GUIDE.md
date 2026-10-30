# 🚀 Guía de Despliegue en Vercel - CIPRO

## Paso 1: Crear Cuenta en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Haz clic en **"Sign Up"**
3. Selecciona **"Continue with GitHub"** (recomendado)
4. Autoriza a Vercel para acceder a tus repositorios

---

## Paso 2: Importar el Proyecto

### Opción A: Desde el Dashboard de Vercel

1. En el dashboard, haz clic en **"Add New..."** → **"Project"**
2. Busca el repositorio **`web-cipro`**
3. Haz clic en **"Import"**

### Opción B: Desde GitHub (Más Rápido)

1. Ve a tu repositorio en GitHub: `https://github.com/20233999-collab/web-cipro`
2. En la página principal del repo, verás un botón de Vercel (si ya conectaste tu cuenta)
3. O simplemente ve a: `https://vercel.com/new` y selecciona el repo

---

## Paso 3: Configuración del Proyecto

Vercel detectará automáticamente que es un proyecto **Next.js 14**. Verifica esta configuración:

### **Framework Preset**
- ✅ **Next.js** (detectado automáticamente)

### **Root Directory**
- ✅ `./` (raíz del proyecto)

### **Build and Output Settings**

| Campo | Valor | Nota |
|-------|-------|------|
| **Build Command** | `npm run build` | ✅ Dejar por defecto |
| **Output Directory** | `.next` | ✅ Dejar por defecto |
| **Install Command** | `npm install` | ✅ Dejar por defecto |

### **Environment Variables**
Por ahora, **NO necesitas agregar ninguna**. Tu proyecto no usa variables de entorno sensibles.

---

## Paso 4: Configuración Avanzada (Opcional pero Recomendada)

Antes de hacer clic en **"Deploy"**, expande **"Advanced Settings"**:

### **Node.js Version**
- Selecciona: **`20.x`** (la más reciente LTS)

### **Ignored Build Step**
- Dejar vacío (queremos que siempre se construya)

---

## Paso 5: Desplegar

1. Haz clic en **"Deploy"**
2. Vercel comenzará a:
   - ✅ Clonar tu repositorio
   - ✅ Instalar dependencias (`npm install`)
   - ✅ Ejecutar el build (`npm run build`)
   - ✅ Desplegar a producción

**Tiempo estimado**: 2-3 minutos

---

## Paso 6: Verificación Post-Despliegue

Una vez completado, verás:

1. **URL de Producción**: `https://web-cipro-[hash].vercel.app`
2. **Estado**: ✅ Ready

### **Checklist de Verificación**

Visita tu sitio y verifica:

- ✅ El Hero con el loop de canvas se carga correctamente
- ✅ Las 141 imágenes del loop se cargan desde `/public/sequence/loop_cipro/`
- ✅ El botón CTA muestra el efecto de chispa eléctrica
- ✅ El header aparece/desaparece al hacer scroll
- ✅ Todas las secciones (Social Proof, Benefits, Portfolio, Footer) se ven bien

---

## Paso 7: Configurar Dominio Personalizado (Opcional)

Si tienes un dominio propio:

1. Ve a tu proyecto en Vercel → **"Settings"** → **"Domains"**
2. Haz clic en **"Add"**
3. Ingresa tu dominio (ej: `cipro.com`)
4. Sigue las instrucciones para actualizar los DNS

---

## Paso 8: Configuración de Auto-Deploy

Vercel ya configuró automáticamente:

✅ **Cada push a `main`** → Deploy automático a producción
✅ **Cada Pull Request** → Preview deployment único

### **Desactivar Auto-Deploy (Si lo prefieres manual)**

1. Ve a **"Settings"** → **"Git"**
2. En **"Production Branch"**, desmarca **"Auto-deploy"**

---

## Optimizaciones Recomendadas

### **1. Configurar `next.config.js` para Imágenes**

Si en el futuro usas imágenes externas (Unsplash, etc.), agrega esto:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com'],
  },
}

module.exports = nextConfig
```

### **2. Verificar que `.gitignore` incluya:**

```
.vercel
.next
node_modules
```

✅ Ya lo tienes configurado

---

## Solución de Problemas Comunes

### ❌ Error: "Build failed"

**Causa**: Errores de TypeScript o dependencias faltantes

**Solución**:
1. Ejecuta localmente: `npm run build`
2. Corrige los errores que aparezcan
3. Haz commit y push de nuevo

### ❌ Las imágenes del loop no cargan

**Causa**: Las imágenes no están en el repositorio

**Solución**:
1. Verifica que la carpeta `public/sequence/loop_cipro/` esté en GitHub
2. Asegúrate de que las 141 imágenes estén ahí
3. Haz push si falta algo

### ❌ El sitio carga pero se ve roto

**Causa**: Tailwind CSS no se compiló correctamente

**Solución**:
1. Verifica que `tailwind.config.ts` esté en el repo
2. Verifica que `postcss.config.js` esté en el repo
3. Redeploy desde Vercel

---

## Comandos Útiles de Vercel CLI (Opcional)

Si quieres desplegar desde la terminal:

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Desplegar a preview
vercel

# Desplegar a producción
vercel --prod
```

---

## Resumen de URLs

Después del despliegue tendrás:

1. **Producción**: `https://web-cipro.vercel.app` (o tu dominio personalizado)
2. **Preview**: Una URL única por cada commit/PR
3. **Dashboard**: `https://vercel.com/[tu-usuario]/web-cipro`

---

**¡Listo!** Tu sitio estará en vivo en minutos. 🚀

Si tienes algún problema durante el despliegue, avísame y te ayudo a resolverlo.
