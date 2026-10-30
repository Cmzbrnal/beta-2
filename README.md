# CIPRO - Círculo de Gestión de Proyectos

Landing page oficial de CIPRO, consultora junior de élite especializada en gestión de proyectos.

## 🚀 Stack Tecnológico

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Animaciones**: Framer Motion
- **Lenguaje**: TypeScript
- **Despliegue**: Vercel

## 📁 Estructura del Proyecto

```
web-cipro/
├── docs/                          # 📚 Documentación
│   ├── GUÍA_GIT.md               # Guía de Git y GitHub
│   ├── DEPLOYMENT_GUIDE.md       # Guía de despliegue en Vercel
│   └── QUICK_START.md            # Inicio rápido
│
├── public/                        # 🖼️ Archivos estáticos
│   └── sequence/loop_cipro/      # 141 frames del loop de animación
│
├── src/
│   ├── app/                      # 🏠 Rutas y páginas (App Router)
│   │   ├── layout.tsx            # Layout raíz
│   │   ├── page.tsx              # Página principal
│   │   └── globals.css           # Estilos globales
│   │
│   ├── components/               # 🧩 Componentes React
│   │   ├── ui/                   # Componentes UI reutilizables
│   │   │   └── moving-border.tsx # Efecto de borde animado
│   │   ├── HeroHybrid.tsx        # Hero con canvas loop
│   │   ├── SmartHeader.tsx       # Header inteligente
│   │   ├── SocialProof.tsx       # Contadores animados
│   │   ├── BenefitsSection.tsx   # Sección de beneficios
│   │   ├── PortfolioSection.tsx  # Galería de proyectos
│   │   ├── Footer.tsx            # Pie de página
│   │   └── GlassDock.tsx         # Dock flotante
│   │
│   └── lib/                      # 🛠️ Utilidades
│       └── utils.ts              # Helpers (cn, etc.)
│
├── .cursorrules                   # ⚙️ Reglas de AI/Cursor
├── .gitignore                     # 🚫 Archivos ignorados por Git
├── package.json                   # 📦 Dependencias
├── tailwind.config.ts             # 🎨 Configuración de Tailwind
├── tsconfig.json                  # 📘 Configuración de TypeScript
└── README.md                      # 📖 Este archivo
```

## 🎯 Características Principales

### Hero Section
- Canvas animado con 141 frames (30fps)
- Preloader inteligente con progreso
- Título con gradiente metálico
- Botón CTA con efecto de chispa eléctrica orbital

### Componentes Interactivos
- Header que aparece/desaparece según scroll
- Contadores animados (Social Proof)
- Galería de proyectos con efectos hover
- Dock flotante con tooltips

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Modo desarrollo
npm run dev

# Build de producción
npm run build

# Iniciar producción
npm start
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📚 Documentación

- **[Guía de Git](./docs/GUÍA_GIT.md)**: Comandos y flujo de trabajo con Git
- **[Guía de Despliegue](./docs/DEPLOYMENT_GUIDE.md)**: Cómo desplegar en Vercel
- **[Quick Start](./docs/QUICK_START.md)**: Inicio rápido del proyecto

## 🔄 Proceso de Actualización

### GitHub (Repositorio)
✅ **Commits ilimitados** - No hay límite
✅ **Pushes ilimitados** - No hay límite
✅ **Almacenamiento**: 1GB gratis (suficiente para este proyecto)

### Vercel (Hosting)
**Plan Hobby (Gratis)**:
- ✅ Despliegues ilimitados
- ✅ 100GB de ancho de banda/mes
- ✅ Builds ilimitados
- ⚠️ Límite: 6,000 minutos de build/mes (más que suficiente)

**Flujo de Actualización:**
1. Edita archivos localmente
2. `git add .`
3. `git commit -m "descripción"`
4. `git push origin main`
5. Vercel despliega automáticamente (2-3 min)

## 🎨 Paleta de Colores

- **Void Black**: `#020202`
- **Electric Orange**: `#FF5500`
- **White**: `#FFFFFF`
- **Gray Secondary**: `#A1A1AA`

## 📝 Checkpoints Importantes

### v1.0.0-Hero-Final
- Hero Loop finalizado
- Layout optimizado
- Título con gradiente metálico
- Espaciado perfeccionado

### Latest
- Efecto Moving Border en CTA
- Estructura completa de landing page
- Footer y Portfolio integrados

## 🤝 Contribución

Este es un proyecto privado de CIPRO. Para cambios:
1. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
2. Commit: `git commit -m "feat: descripción"`
3. Push: `git push origin feature/nueva-funcionalidad`
4. Crea un Pull Request

## 📄 Licencia

© 2024 CIPRO - Círculo de Gestión de Proyectos. Todos los derechos reservados.

---

**Desarrollado con ❤️ por el equipo CIPRO**