'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Target, Compass, Calendar, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function IntroCiproSection() {
    return (
        <section id="conoce-cipro" className="py-24 md:py-32 bg-void-black relative overflow-hidden border-b border-white/5">
            {/* Resplandor sutil ambiental */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-electric-orange/5 rounded-full blur-[160px] pointer-events-none" />

            <div className="container relative z-10 max-w-6xl mx-auto px-4 md:px-6">
                {/* Cabecera */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-electric-orange uppercase tracking-widest mb-4">
                        <Sparkles className="w-3.5 h-3.5" />
                        Conoce Nuestra Esencia
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                        Conoce CIPRO
                    </h2>
                    <p className="text-gray-400 max-w-3xl mx-auto text-base md:text-lg leading-relaxed">
                        Círculo de Gestión de Proyectos. Consultoría Junior con mentalidad de élite para estructurar el talento universitario hacia estándares internacionales.
                    </p>
                </motion.div>

                {/* Grid de 3 Tarjetas con la estética exacta de la web */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Tarjeta 1: ¿Qué es CIPRO? */}
                    <motion.div
                        whileHover={{ scale: 1.02, y: -4 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="group relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent hover:border-electric-orange/40 hover:shadow-[0_0_40px_rgba(255,85,0,0.15)] p-8 flex flex-col justify-between transition-all duration-300"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-electric-orange/0 to-electric-orange/0 group-hover:from-electric-orange/5 group-hover:to-transparent rounded-3xl transition-all duration-500" />
                        
                        <div className="relative z-10 space-y-4">
                            <div className="w-12 h-12 rounded-xl bg-electric-orange/10 border border-electric-orange/20 flex items-center justify-center text-electric-orange group-hover:scale-110 transition-transform">
                                <Target className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold text-white group-hover:text-electric-orange transition-colors">
                                ¿Qué es CIPRO?
                            </h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Organización técnica universitaria multidisciplinaria que estructura el talento en gestión de proyectos bajo estándares <strong className="text-white">PMO</strong>, metodologías ágiles e investigación aplicada.
                            </p>
                        </div>

                        <div className="relative z-10 mt-6 pt-4 border-t border-white/5 flex flex-wrap gap-2">
                            <span className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">#PMO</span>
                            <span className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">#Scrum</span>
                            <span className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">#Investigación</span>
                        </div>
                    </motion.div>

                    {/* Tarjeta 2: Nuestro Propósito */}
                    <motion.div
                        whileHover={{ scale: 1.02, y: -4 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="group relative rounded-3xl border border-electric-orange/30 bg-gradient-to-br from-electric-orange/5 to-transparent hover:border-electric-orange/60 hover:shadow-[0_0_50px_rgba(255,85,0,0.2)] p-8 flex flex-col justify-between transition-all duration-300"
                    >
                        <div className="relative z-10 space-y-4">
                            <div className="w-12 h-12 rounded-xl bg-electric-orange/20 border border-electric-orange/30 flex items-center justify-center text-electric-orange shadow-[0_0_15px_rgba(255,85,0,0.3)]">
                                <Compass className="w-6 h-6" />
                            </div>
                            <div className="inline-block text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-electric-orange/20 text-electric-orange border border-electric-orange/30">
                                Misión & Visión
                            </div>
                            <h3 className="text-2xl font-bold text-white group-hover:text-electric-orange transition-colors">
                                Nuestro Propósito
                            </h3>
                            <p className="text-gray-300 text-sm leading-relaxed">
                                Inspirar y potenciar el talento, comprometiéndose para trascender en comunidad mediante proyectos orientados a los <strong className="text-white">Objetivos de Desarrollo Sostenible (ODS)</strong>.
                            </p>
                        </div>

                        <div className="relative z-10 mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-electric-orange font-medium">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Impacto tangible y valor real</span>
                        </div>
                    </motion.div>

                    {/* Tarjeta 3: Historia y Trayectoria */}
                    <motion.div
                        whileHover={{ scale: 1.02, y: -4 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="group relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent hover:border-electric-orange/40 hover:shadow-[0_0_40px_rgba(255,85,0,0.15)] p-8 flex flex-col justify-between transition-all duration-300"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-electric-orange/0 to-electric-orange/0 group-hover:from-electric-orange/5 group-hover:to-transparent rounded-3xl transition-all duration-500" />
                        
                        <div className="relative z-10 space-y-4">
                            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:bg-electric-orange/10 group-hover:border-electric-orange/30 transition-all">
                                <Calendar className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold text-white group-hover:text-electric-orange transition-colors">
                                Fundación 2015
                            </h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Fundado el <strong className="text-white">16 de noviembre de 2015</strong> en la universidad como una iniciativa pionera para aprender y practicar gestión de proyectos en comunidad.
                            </p>
                        </div>

                        <div className="relative z-10 mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
                            <span>10+ años de trayectoria</span>
                            <span className="text-electric-orange font-semibold">CIPRO Oficial</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
