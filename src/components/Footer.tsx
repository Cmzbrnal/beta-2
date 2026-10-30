'use client';

import React from 'react';
import { ArrowUpRight, Github, Linkedin, Instagram } from 'lucide-react';

interface FooterProps {
    onOpenModal?: () => void;
}

export default function Footer({ onOpenModal }: FooterProps) {
    return (
        <footer className="bg-void-black text-white pt-20 pb-12 border-t border-white/5 relative overflow-hidden">
            {/* Subtle Gradient */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-electric-orange/5 rounded-full blur-[150px] pointer-events-none" />

            <div className="container relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16">
                    {/* Brand Column */}
                    <div className="md:col-span-5 space-y-6">
                        <div className="text-3xl font-black tracking-tighter text-white">
                            CIPRO.
                        </div>
                        <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
                            Formando la próxima generación de consultores líderes en gestión de proyectos.
                            Consultoría Junior con mentalidad de élite.
                        </p>
                        <div className="flex gap-4">
                            <a href="https://github.com/20233999-collab/web-cipro" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all">
                                <Github className="w-4 h-4" />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all">
                                <Linkedin className="w-4 h-4" />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all">
                                <Instagram className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    <div className="md:col-span-2">
                        <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-xs">Comunidad</h4>
                        <ul className="space-y-4">
                            {['Nosotros', 'Proyectos', 'Eventos', 'Blog'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-gray-400 hover:text-electric-orange transition-colors text-sm">{item}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="md:col-span-2">
                        <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-xs">Recursos</h4>
                        <ul className="space-y-4">
                            {['Metodologías', 'Plantillas', 'Casos de Éxito', 'E-books'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-gray-400 hover:text-electric-orange transition-colors text-sm">{item}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Join Us */}
                    <div className="md:col-span-3">
                        <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-xs">Únete a CIPRO</h4>
                        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                            ¿Listo para llevar tu carrera al siguiente nivel? Postula para ser miembro.
                        </p>
                        <button
                            type="button"
                            onClick={onOpenModal}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-bold text-sm hover:bg-electric-orange hover:text-white transition-all group cursor-pointer shadow-lg hover:shadow-[0_0_25px_rgba(255,85,0,0.4)]"
                        >
                            Postular Ahora <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
                        </button>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-gray-500 text-xs">
                        © {new Date().getFullYear()} CIPRO - Círculo de Gestión de Proyectos. Todos los derechos reservados.
                    </p>
                    <div className="flex gap-8">
                        <a href="#" className="text-gray-500 hover:text-white text-xs transition-colors">Política de Privacidad</a>
                        <a href="#" className="text-gray-500 hover:text-white text-xs transition-colors">Términos y Condiciones</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
