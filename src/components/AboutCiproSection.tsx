'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, 
    Award, 
    Briefcase, 
    GraduationCap, 
    Calendar, 
    Target, 
    Sparkles, 
    CheckCircle2, 
    ChevronRight,
    Compass
} from 'lucide-react';

interface AboutCiproSectionProps {
    onOpenPostulacion?: () => void;
}

export default function AboutCiproSection({ onOpenPostulacion }: AboutCiproSectionProps) {
    const [activeTab, setActiveTab] = useState<'beneficios' | 'historia'>('beneficios');

    const beneficios = [
        {
            icon: GraduationCap,
            title: "Capacitaciones Exclusivas",
            description: "Acceso a talleres prácticos de PMO, EDT, Scrum, herramientas de IA aplicada y software especializado de proyectos.",
            badge: "Formación Élite"
        },
        {
            icon: Users,
            title: "Red de Contactos Estratégica",
            description: "Conexión directa con profesionales egresados, asesores académicos y círculos aliados a nivel nacional (Networking de valor).",
            badge: "Networking"
        },
        {
            icon: Award,
            title: "Constancias & Horas de Impacto",
            description: "Certificación oficial respaldada por horas de participación en investigación, organización de eventos y gestión de proyectos.",
            badge: "Certificación"
        },
        {
            icon: Briefcase,
            title: "Experiencia en Proyectos Reales",
            description: "Lidera entregables reales utilizando actas, charters, dashboards y metodologías profesionales orientadas a los ODS.",
            badge: "Práctica Real"
        }
    ];

    return (
        <section id="nosotros" className="py-24 md:py-32 bg-void-black relative overflow-hidden border-b border-white/5">
            {/* Resplandor ambiental de fondo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-electric-orange/5 rounded-full blur-[160px] pointer-events-none" />

            <div className="container relative z-10 px-4 md:px-6 max-w-6xl mx-auto">
                {/* Cabecera de Sección */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12 md:mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-electric-orange uppercase tracking-widest mb-4">
                        <Sparkles className="w-3.5 h-3.5" />
                        Conoce Nuestra Esencia
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">
                        ¿Qué es CIPRO y por qué unirte?
                    </h2>
                    <p className="text-gray-400 max-w-3xl mx-auto text-base md:text-lg leading-relaxed">
                        <strong className="text-white">CIPRO</strong> (Centro de Investigación y Proyectos) es una organización técnica multidisciplinaria enfocada en estructurar el talento universitario a través de la gestión de proyectos bajo estándares PMO, metodologías ágiles e investigación aplicada.
                    </p>

                    {/* Selector de Pestañas Interactivas */}
                    <div className="flex justify-center items-center gap-2 mt-8 p-1.5 rounded-2xl bg-white/[0.03] border border-white/10 max-w-md mx-auto">
                        <button
                            type="button"
                            onClick={() => setActiveTab('beneficios')}
                            className={`flex-1 py-2.5 px-4 rounded-xl text-xs md:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                                activeTab === 'beneficios'
                                    ? 'bg-electric-orange text-white shadow-[0_0_20px_rgba(255,85,0,0.4)]'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <Award className="w-4 h-4" />
                            Beneficios de Pertenecer
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('historia')}
                            className={`flex-1 py-2.5 px-4 rounded-xl text-xs md:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                                activeTab === 'historia'
                                    ? 'bg-electric-orange text-white shadow-[0_0_20px_rgba(255,85,0,0.4)]'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <Compass className="w-4 h-4" />
                            Propósito e Historia
                        </button>
                    </div>
                </motion.div>

                {/* Contenido Conmutable */}
                <AnimatePresence mode="wait">
                    {activeTab === 'beneficios' ? (
                        <motion.div
                            key="beneficios"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.3 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        >
                            {beneficios.map((b, idx) => (
                                <div
                                    key={idx}
                                    className="group relative p-6 rounded-2xl bg-[#0B0F17]/90 border border-white/10 hover:border-electric-orange/40 transition-all duration-300 hover:shadow-[0_0_35px_rgba(255,85,0,0.15)] flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="p-3 rounded-xl bg-electric-orange/10 border border-electric-orange/20 text-electric-orange group-hover:scale-110 transition-transform">
                                                <b.icon className="w-5 h-5" />
                                            </div>
                                            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-white/5 text-gray-300 border border-white/10">
                                                {b.badge}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-electric-orange transition-colors">
                                            {b.title}
                                        </h3>
                                        <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                                            {b.description}
                                        </p>
                                    </div>

                                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-gray-500 group-hover:text-gray-300 transition-colors">
                                        <span>Valor para tu perfil profesional</span>
                                        <CheckCircle2 className="w-4 h-4 text-electric-orange" />
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="historia"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Historia */}
                                <div className="p-6 rounded-2xl bg-[#0B0F17]/90 border border-white/10 space-y-3">
                                    <div className="flex items-center gap-2 text-xs font-bold text-electric-orange uppercase tracking-wider">
                                        <Calendar className="w-4 h-4" />
                                        16 de Noviembre de 2015
                                    </div>
                                    <h3 className="text-lg font-bold text-white">
                                        ¿Cuándo y por qué se fundó?
                                    </h3>
                                    <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                                        Se fundó como una iniciativa pionera para aprender y practicar gestión de proyectos en comunidad universitaria, cerrando la brecha entre la teoría académica y el mundo laboral.
                                    </p>
                                </div>

                                {/* Propósito */}
                                <div className="p-6 rounded-2xl bg-[#0B0F17]/90 border border-white/10 space-y-3 md:col-span-2">
                                    <div className="flex items-center gap-2 text-xs font-bold text-electric-orange uppercase tracking-wider">
                                        <Target className="w-4 h-4" />
                                        Nuestro Propósito
                                    </div>
                                    <h3 className="text-lg font-bold text-white">
                                        Inspirar, potenciar y trascender
                                    </h3>
                                    <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                                        Buscamos apasionadamente generar un impacto positivo en el desarrollo de iniciativas alineadas a los <strong className="text-white">Objetivos de Desarrollo Sostenible (ODS)</strong>, combinando metodologías ágiles (Scrum, Kanban, Design Thinking) y tradicionales (PMBOK).
                                    </p>
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300">#ImpactoODS</span>
                                        <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300">#MetodologíasÁgiles</span>
                                        <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300">#ConsultoríaJunior</span>
                                        <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300">#LiderazgoPMO</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Banner inferior de acción */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-12 p-6 md:p-8 rounded-2xl bg-gradient-to-r from-electric-orange/15 via-[#0B0F17] to-transparent border border-electric-orange/30 flex flex-col md:flex-row items-center justify-between gap-6"
                >
                    <div className="space-y-1 text-center md:text-left">
                        <div className="text-lg md:text-xl font-bold text-white">
                            ¿Te gustaría formar parte de la próxima generación CIPRO?
                        </div>
                        <div className="text-xs md:text-sm text-gray-400">
                            Postula hoy y forma parte de nuestros equipos de investigación y consultoría.
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onOpenPostulacion}
                        className="px-6 py-3 rounded-xl bg-electric-orange hover:bg-[#ff6a1f] text-white font-bold text-xs md:text-sm tracking-wide shadow-[0_0_25px_rgba(255,85,0,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
                    >
                        <span>Postula Ahora</span>
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </motion.div>
            </div>
        </section>
    );
}
