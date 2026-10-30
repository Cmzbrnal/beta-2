'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, X, Upload, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

const projects = [
    {
        title: "Ingeniero Locaso",
        description: "Sistema automatizado de gestión académica con IA.",
        image: "/images/proyectos/ingeniero-locaso.png",
        contexto: "Este proyecto surgió de la necesidad de automatizar procesos académicos que consumían tiempo excesivo. La gestión manual de notas, horarios y comunicados generaba errores frecuentes y una experiencia deficiente para alumnos y docentes.",
        solucion: "Se implementó una plataforma inteligente con IA que centraliza la gestión académica, automatiza notificaciones, y ofrece dashboards en tiempo real. Se aplicó metodología Scrum con sprints de 2 semanas logrando un 70% de reducción en tiempos operativos.",
        anexos: [
            { name: "Charter del Proyecto", ext: "PDF" },
            { name: "Informe Final", ext: "PDF" },
        ],
    },
    {
        title: "Transformación Digital",
        description: "Red de integración de datos para empresas en crecimiento.",
        image: "/images/proyectos/transformacion-digital.png",
        contexto: "Las empresas en expansión enfrentan silos de información que frenan su crecimiento. Los datos dispersos en múltiples sistemas generan decisiones lentas y costosas.",
        solucion: "Diseñamos una arquitectura de integración de datos con APIs RESTful y un ETL robusto. Se usó Kanban para gestión visual del flujo, logrando integrar 5 sistemas core en 3 meses.",
        anexos: [
            { name: "Arquitectura de Solución", ext: "PDF" },
            { name: "Plan de Implementación", ext: "XLSX" },
        ],
    },
    {
        title: "Gestión Ágil",
        description: "Visualización de flujos de trabajo con metodología Scrum.",
        image: "/images/proyectos/gestion-agil.png",
        contexto: "Equipos con baja visibilidad del avance real del proyecto y dificultad para detectar cuellos de botella a tiempo, resultando en entregas tardías.",
        solucion: "Implementación de tableros Scrum físicos y digitales con métricas de velocity, burndown charts y retrospectivas estructuradas. Se logró una mejora del 45% en predictibilidad de entregas.",
        anexos: [
            { name: "Guía de Implementación Scrum", ext: "PDF" },
            { name: "Tablero Kanban Template", ext: "XLSX" },
        ],
    },
    {
        title: "PMO Estratégica",
        description: "Oficina de proyectos con enfoque en entrega de valor.",
        image: "/images/proyectos/pmo-estrategica.png",
        contexto: "Organización con múltiples proyectos sin un ente centralizador, causando duplicación de esfuerzos, falta de estándares y baja alineación estratégica.",
        solucion: "Constitución de una PMO con governance model, marcos de referencia estandarizados y KPIs de portafolio. Alineación de proyectos a objetivos estratégicos con OKRs trimestrales.",
        anexos: [
            { name: "PMO Charter", ext: "PDF" },
            { name: "Governance Model", ext: "PDF" },
        ],
    },
    {
        title: "Optimización de Procesos",
        description: "Eficiencia y productividad a través de mejora continua.",
        image: "/images/proyectos/optimizacion-procesos.png",
        contexto: "Procesos operativos con alta tasa de reprocesos y tiempos de ciclo elevados. Falta de estandarización y métricas claras de eficiencia.",
        solucion: "Aplicación de Lean Six Sigma para identificar desperdicios y rediseñar flujos críticos. Automatización de pasos manuales y capacitación del equipo en mejora continua, logrando 30% de reducción en tiempo de ciclo.",
        anexos: [
            { name: "Mapa de Procesos AS-IS / TO-BE", ext: "PDF" },
            { name: "Plan de Mejora", ext: "XLSX" },
        ],
    },
];

interface PortfolioSectionProps {
    member?: any;
}

// ─── Project Modal ────────────────────────────────────────────────────────────
function ProjectModal({
    project,
    member,
    onClose,
}: {
    project: typeof projects[0];
    member?: any;
    onClose: () => void;
}) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="relative w-full max-w-3xl bg-[#0B0F17] border border-white/10 rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Orange top line */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-electric-orange to-transparent z-10" />

                {/* Project image header */}
                <div className="relative h-48 flex-shrink-0 overflow-hidden">
                    <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-[#0B0F17]/40 to-transparent" />
                    <div className="absolute bottom-4 left-6 right-14">
                        <h3 className="text-2xl font-bold text-white">{project.title}</h3>
                        <p className="text-gray-300 text-sm mt-1">{project.description}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 border border-white/20 flex items-center justify-center text-gray-300 hover:text-white hover:bg-black/70 transition-all"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Bloque 1: Contexto / Problemática */}
                    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
                        <h4 className="text-sm font-semibold text-electric-orange uppercase tracking-widest mb-3">
                            Contexto / Problemática
                        </h4>
                        <p className="text-gray-300 text-sm leading-relaxed">{project.contexto}</p>
                        {member && (
                            <textarea
                                className="mt-3 w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white placeholder-gray-600 resize-none focus:outline-none focus:border-electric-orange/40 transition-colors"
                                rows={2}
                                placeholder="Añadir notas sobre el contexto..."
                            />
                        )}
                    </div>

                    {/* Bloque 2: Solución desarrollada */}
                    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
                        <h4 className="text-sm font-semibold text-electric-orange uppercase tracking-widest mb-3">
                            Solución desarrollada
                        </h4>
                        <p className="text-gray-300 text-sm leading-relaxed">{project.solucion}</p>
                        {member && (
                            <textarea
                                className="mt-3 w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white placeholder-gray-600 resize-none focus:outline-none focus:border-electric-orange/40 transition-colors"
                                rows={2}
                                placeholder="Añadir notas sobre la solución..."
                            />
                        )}
                    </div>

                    {/* Bloque 3: Anexos y PDFs */}
                    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
                        <h4 className="text-sm font-semibold text-electric-orange uppercase tracking-widest mb-3">
                            Anexos y PDFs
                        </h4>
                        <div className="space-y-2">
                            {project.anexos.map((anexo, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-white/[0.02]"
                                >
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm text-white/80">{anexo.name}</span>
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-gray-400">
                                            {anexo.ext}
                                        </span>
                                    </div>
                                    <button
                                        disabled
                                        className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed"
                                    >
                                        Próximamente
                                    </button>
                                </div>
                            ))}
                        </div>
                        {member && (
                            <button className="mt-3 flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-all">
                                <Upload className="w-4 h-4" />
                                Subir PDF
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export default function PortfolioSection({ member }: PortfolioSectionProps) {
    const [centerIndex, setCenterIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [selectedProject, setSelectedProject] = useState<number | null>(null);
    const totalProjects = projects.length;

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Get index with wrapping
    const getWrappedIndex = (index: number) => {
        return ((index % totalProjects) + totalProjects) % totalProjects;
    };

    // Navigate to previous
    const prevSlide = () => {
        setCenterIndex(getWrappedIndex(centerIndex - 1));
    };

    // Navigate to next
    const nextSlide = () => {
        setCenterIndex(getWrappedIndex(centerIndex + 1));
    };

    // Click on card: center it; if already center, open modal
    const goToSlide = (index: number) => {
        if (index === centerIndex) {
            setSelectedProject(index);
        } else {
            setCenterIndex(index);
        }
    };

    // Get visible cards (5 cards: -2, -1, center, +1, +2)
    const getVisibleCards = () => {
        const positions = [-2, -1, 0, 1, 2];
        return positions.map(offset => {
            const actualIndex = getWrappedIndex(centerIndex + offset);
            return {
                project: projects[actualIndex],
                actualIndex,
                offset,
            };
        });
    };

    const visibleCards = getVisibleCards();

    return (
        <section id="portafolio" className="py-8 md:py-32 bg-void-black relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[800px] h-[300px] md:h-[400px] bg-white/5 rounded-full blur-[100px] md:blur-[150px] pointer-events-none" />

            <div className="container">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-4 md:mb-20"
                >
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                        Proyectos con Propósito.
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg px-4">
                        Es el centro del círculo. Casos de éxito donde transformamos la gestión en resultados tangibles.
                    </p>
                </motion.div>

                {/* Carousel Container */}
                <div className="relative flex items-center justify-center h-[520px] md:h-[620px]">

                    {/* Left Arrow */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-2 md:left-8 top-[38%] md:top-[42%] -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-sm"
                    >
                        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </button>

                    {/* Cards */}
                    <div className="relative flex items-center justify-center w-full h-full perspective-1000">
                        <AnimatePresence mode="popLayout">
                            {visibleCards.map(({ project, actualIndex, offset }) => {
                                // On mobile, hide cards with offset > 1
                                if (isMobile && Math.abs(offset) > 1) return null;

                                const isCenter = offset === 0;
                                const rotation = offset * 8;
                                // Wider spread so side cards are clearly visible
                                const xOffset = isMobile ? offset * 55 : offset * 145;
                                const translateX = `calc(-50% + ${xOffset}px)`;
                                const scale = isCenter ? 1 : (isMobile ? 0.75 : 0.72) - Math.abs(offset) * 0.04;
                                const opacity = isCenter ? 1 : Math.abs(offset) === 1 ? 0.55 : 0.25;
                                const zIndex = 10 - Math.abs(offset);

                                return (
                                    <motion.div
                                        key={actualIndex}
                                        initial={{ opacity: 0, scale: 0.8, x: "calc(-50% + 0px)" }}
                                        animate={{
                                            opacity,
                                            scale,
                                            x: translateX,
                                            rotate: rotation,
                                            zIndex,
                                        }}
                                        exit={{ opacity: 0, scale: 0.8, x: "calc(-50% + 0px)" }}
                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                        onClick={() => goToSlide(actualIndex)}
                                        className="absolute cursor-pointer left-1/2 top-[10%] md:top-[25%] -translate-y-1/2 flex flex-col items-center"
                                        style={{ zIndex }}
                                    >
                                        {/* Card */}
                                        <motion.div
                                            whileHover={isCenter ? { scale: 1.05, boxShadow: "0 0 80px rgba(255,255,255,0.5)" } : {}}
                                            className={cn(
                                                "w-[200px] h-[280px] md:w-[320px] md:h-[400px] rounded-3xl overflow-hidden bg-void-black",
                                                "border-2 transition-all duration-300 relative",
                                                isCenter
                                                    ? "border-white/40 shadow-[0_0_60px_rgba(255,255,255,0.35)]"
                                                    : "border-white/10 hover:border-white/30 hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]"
                                            )}
                                        >
                                            {/* Image */}
                                            <img
                                                src={project.image}
                                                alt={project.title}
                                                className="w-full h-full object-cover"
                                            />

                                            {/* Center card hint overlay */}
                                            {isCenter && (
                                                <div className="absolute inset-0 flex items-end justify-center pb-4 opacity-0 hover:opacity-100 transition-opacity duration-300">
                                                    <span className="text-xs font-medium text-white/80 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                                                        Click para ver detalles
                                                    </span>
                                                </div>
                                            )}
                                        </motion.div>

                                        {/* Text below card - only visible for center */}
                                        {/* We use absolute positioning to avoid affecting the vertical center of the card */}
                                        <motion.div
                                            className="absolute top-[calc(100%+1.5rem)] text-center w-[280px] md:w-[400px]"
                                            animate={{
                                                opacity: isCenter ? 1 : 0,
                                                y: isCenter ? 0 : 10,
                                                pointerEvents: isCenter ? "auto" : "none"
                                            }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                                                {project.title}
                                            </h3>
                                            <p className="text-gray-300 text-sm md:text-base mb-4 line-clamp-2 px-4">
                                                {project.description}
                                            </p>

                                            {/* "ir" link → now opens modal */}
                                            <motion.div
                                                onClick={(e) => { e.stopPropagation(); setSelectedProject(centerIndex); }}
                                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-all duration-300 cursor-pointer group rounded-full hover:bg-white/10 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                                                whileHover={{ scale: 1.05 }}
                                            >
                                                <span>ver proyecto</span>
                                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </motion.div>
                                        </motion.div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>

                    {/* Right Arrow */}
                    <button
                        onClick={nextSlide}
                        className="absolute right-2 md:right-8 top-[40%] md:top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-sm"
                    >
                        <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </button>
                </div>

                {/* Dots indicator */}
                <div className="flex justify-center gap-2 mt-10">
                    {projects.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={cn(
                                "w-2 h-2 rounded-full transition-all duration-300",
                                index === centerIndex
                                    ? "bg-white w-6"
                                    : "bg-white/30 hover:bg-white/50"
                            )}
                        />
                    ))}
                </div>
            </div>

            {/* Project Modal */}
            <AnimatePresence>
                {selectedProject !== null && (
                    <ProjectModal
                        key={selectedProject}
                        project={projects[selectedProject]}
                        member={member}
                        onClose={() => setSelectedProject(null)}
                    />
                )}
            </AnimatePresence>
        </section>
    );
}
