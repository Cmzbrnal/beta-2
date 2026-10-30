'use client';

import React from 'react';
import { Home, Github, Linkedin, Mail } from 'lucide-react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useState } from 'react';

const dockItems = [
    { icon: Home, label: 'Inicio', href: '#' },
    { icon: Github, label: 'GitHub', href: 'https://github.com' },
    { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com' },
    { icon: Mail, label: 'Contacto', href: 'mailto:contacto@cipro.com' },
];

export default function GlassDock() {
    const { scrollY } = useScroll();
    const [visible, setVisible] = useState(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        if (latest > 500) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    });

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: visible ? 0 : 100, opacity: visible ? 1 : 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-2 px-4 shadow-2xl pointer-events-auto flex items-center gap-2"
            >
                {dockItems.map((item, index) => (
                    <a
                        key={index}
                        href={item.href}
                        className="p-3 rounded-xl hover:bg-white/10 text-white/70 hover:text-white transition-all hover:scale-110 active:scale-95 group relative flex flex-col items-center justify-center"
                    >
                        <item.icon className="w-6 h-6" />
                        {/* Tooltip */}
                        <span className="absolute -top-10 scale-0 group-hover:scale-100 transition-transform bg-black/80 text-white text-xs px-2 py-1 rounded backdrop-blur-md whitespace-nowrap">
                            {item.label}
                        </span>
                    </a>
                ))}
            </motion.div>
        </div>
    );
}
