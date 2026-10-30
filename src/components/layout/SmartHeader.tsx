'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const navLinks = [
    { name: 'Repositorio', href: 'https://github.com/20233999-collab/web-cipro' },
    { name: 'Portafolio', href: '#' },
    { name: 'Nosotros', href: '#' },
];

export default function SmartHeader() {
    const [isVisible, setIsVisible] = useState(true);
    const [isAtTop, setIsAtTop] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Check if at top
            setIsAtTop(currentScrollY < 10);

            // Determine visibility
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scrolling down - hide
                setIsVisible(false);
            } else {
                // Scrolling up - show
                setIsVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.header
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className={cn(
                        "fixed top-0 left-0 right-0 z-[100] transition-all duration-300",
                        isAtTop
                            ? "bg-transparent py-8"
                            : "bg-void-black/80 backdrop-blur-md border-b border-white/5 py-4"
                    )}
                >
                    <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 bg-electric-orange rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(255,85,0,0.5)] group-hover:scale-110 transition-transform">
                                <span className="font-bold text-white text-sm">C</span>
                            </div>
                            <span className="text-white font-bold tracking-tighter text-xl">CIPRO</span>
                        </Link>

                        {/* Navigation */}
                        <nav className="hidden md:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-white/60 hover:text-white transition-colors text-sm font-medium"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </nav>

                        {/* CTA / Action */}
                        <button className="px-5 py-2 rounded-full border border-white/10 text-white text-sm font-medium hover:bg-white/5 transition-colors">
                            Contacto
                        </button>
                    </div>
                </motion.header>
            )}
        </AnimatePresence>
    );
}
