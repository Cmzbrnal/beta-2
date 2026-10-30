# 🚀 CIPRO - Quick Start Guide

## ✅ Server is Running!

Your development server is now active at:
**http://localhost:3000**

---

## 🔄 If You Need to Restart the Server

If you close PowerShell and need to start again, run these commands:

```powershell
# 1. Add Node.js to PATH (temporary fix)
$env:Path += ";C:\Program Files\nodejs\"

# 2. Navigate to project
cd C:\Users\HP\Documents\AntiGravity\web-cipro-public\web-cipro

# 3. Start server
npm run dev
```

---

## 🛠️ For Permanent PATH Fix

To avoid running step 1 every time:

1. Press `Win + X` → Select **"Sistema"**
2. Click **"Configuración avanzada del sistema"**
3. Click **"Variables de entorno"**
4. Under **"Variables del sistema"**, find `Path` and double-click
5. Verify that `C:\Program Files\nodejs\` exists
6. If not, click **"Nuevo"** and add it
7. Click **OK** on all windows
8. Close and reopen PowerShell

---

## 📱 What You Should See

When you open **http://localhost:3000**, you'll see:

1. **Smart Preloader** - Loading percentage (0% → 100%)
2. **Hero Animation** - Canvas loop with 141 frames at 30fps
3. **Smart Header** - Disappears on scroll down, reappears on scroll up
4. **Social Proof** - Animated counters (+10 Años, +15 Proyectos, +45 Miembros)
5. **Benefits Section** - 3 cards with orange glow on hover
6. **Glass Dock** - Bottom navigation (appears after scrolling)

---

## 🎨 Color Palette

- **Background**: `#020202` (Void Black)
- **Accent**: `#FF5500` (Electric Orange)
- **Text**: `#FFFFFF` / `#A1A1AA`

---

## 📝 Project Structure

```
web-cipro/
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Main page
│   │   └── globals.css      # Global styles
│   └── components/
│       ├── HeroHybrid.tsx   # Canvas animation
│       ├── SmartHeader.tsx  # Scroll-aware header
│       ├── SocialProof.tsx  # Animated counters
│       ├── BenefitsSection.tsx  # Feature cards
│       └── GlassDock.tsx    # Bottom dock
├── package.json
└── tailwind.config.ts
```

---

**Need help?** Ask me anything about the project!
