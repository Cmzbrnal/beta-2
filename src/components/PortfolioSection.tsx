'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Upload, Plus, FileText } from 'lucide-react';

const projects = [
    {
        title: 'Ingeniero Locaso',
        description: 'Sistema automatizado de gestión académica con IA.',
        images: [
            '/images/proyectos/ingeniero-locaso.svg',
            '/images/cards/capacitaciones.svg',
            '/images/cards/eventos_exclusivos.svg',
        ],
        causas: 'Procesos manuales, reprocesos frecuentes y baja trazabilidad de información académica.',
        soluciones: 'Automatización de flujos, tableros de seguimiento y mejoras progresivas por iteraciones.',
        anexos: ['Charter del Proyecto', 'Informe Final', 'Lecciones Aprendidas'],
    },
    {
        title: 'Transformación Digital',
        description: 'Red de integración de datos para empresas en crecimiento.',
        images: [
            '/images/proyectos/transformacion-digital.svg',
            '/images/cards/recursos_premium.svg',
            '/images/cards/capacitaciones.svg',
        ],
        causas: 'Silos de información y decisiones lentas por datos dispersos en múltiples plataformas.',
        soluciones: 'Arquitectura de integración por APIs, sincronización y tableros de control ejecutivos.',
        anexos: ['Arquitectura de Solución', 'Plan de Implementación', 'Roadmap de Integración'],
    },
    {
        title: 'Gestión Ágil',
        description: 'Visualización de flujos de trabajo con metodología Scrum.',
        images: [
            '/images/proyectos/gestion-agil.svg',
            '/images/cards/eventos_exclusivos.svg',
            '/images/cards/recursos_premium.svg',
        ],
        causas: 'Baja visibilidad del avance real y poca detección temprana de cuellos de botella.',
        soluciones: 'Tableros ágiles, métricas de sprint y rituales para mejora continua de entregables.',
        anexos: ['Guía de Implementación Scrum', 'Tablero Kanban', 'Reporte de Velocity'],
    },
    {
        title: 'PMO Estratégica',
        description: 'Oficina de proyectos con enfoque en entrega de valor.',
        images: [
            '/images/proyectos/pmo-estrategica.svg',
            '/images/cards/recursos_premium.svg',
            '/images/cards/eventos_exclusivos.svg',
        ],
        causas: 'Ausencia de estándares, duplicación de esfuerzos y baja alineación con objetivos estratégicos.',
        soluciones: 'Diseño de governance model, KPIs de portafolio y lineamientos de priorización.',
        anexos: ['PMO Charter', 'Governance Model', 'Matriz de Responsabilidades'],
    },
    {
        title: 'Optimización de Procesos',
        description: 'Eficiencia y productividad a través de mejora continua.',
        images: [
            '/images/proyectos/optimizacion-procesos.svg',
            '/images/cards/capacitaciones.svg',
            '/images/cards/recursos_premium.svg',
        ],
        causas: 'Procesos con alta variabilidad, retrabajos y tiempos de ciclo extendidos.',
        soluciones: 'Mapeo AS-IS/TO-BE, automatización parcial y seguimiento de indicadores operativos.',
        anexos: ['Mapa de Procesos', 'Plan de Mejora', 'Indicadores de Eficiencia'],
    },
];

interface PortfolioSectionProps {
    member?: any;
}

function ProjectModal({
    project,
    member,
    onClose,
}: {
    project: typeof projects[0];
    member?: any;
    onClose: () => void;
}) {
    const [imageIndex, setImageIndex] = useState(0);

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setImageIndex((prev) => (prev + 1) % project.images.length);
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length);
    };

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
                className="relative w-full max-w-5xl bg-[#0B0F17] border border-white/10 rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-electric-orange to-transparent z-10" />

                <div className="relative h-56 md:h-72 flex-shrink-0 overflow-hidden">
                    <img src={project.images[imageIndex]} alt={project.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-[#0B0F17]/40 to-transparent" />
                    <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 border border-white/20 text-white flex items-center justify-center">
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 border border-white/20 text-white flex items-center justify-center">
                        <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 border border-white/20 flex items-center justify-center text-gray-300 hover:text-white hover:bg-black/70 transition-all"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h3 className="text-2xl font-bold text-white">{project.title}</h3>
                            <p className="text-gray-300 text-sm mt-1">{project.description}</p>
                        </div>
                        {member && (
                            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/90 hover:bg-white/10 transition-all text-sm">
                                <Plus className="w-4 h-4" />
                                Editar proyecto
                            </button>
                        )}
                    </div>

                    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
                        <h4 className="text-sm font-semibold text-electric-orange uppercase tracking-widest mb-3">Causas</h4>
                        <p className="text-gray-300 text-sm leading-relaxed">{project.causas}</p>
                    </div>

                    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
                        <h4 className="text-sm font-semibold text-electric-orange uppercase tracking-widest mb-3">Soluciones</h4>
                        <p className="text-gray-300 text-sm leading-relaxed">{project.soluciones}</p>
                    </div>

                    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
                        <h4 className="text-sm font-semibold text-electric-orange uppercase tracking-widest mb-3">Anexos</h4>
                        <div className="space-y-2">
                            {project.anexos.map((anexo, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-white/[0.02]">
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm text-white/80">{anexo}</span>
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-gray-400">PDF</span>
                                    </div>
                                    <button className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition-all">
                                        Descargar
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

export default function PortfolioSection({ member }: PortfolioSectionProps) {
    const [selectedProject, setSelectedProject] = useState<number | null>(null);
    const [cardImageIndex, setCardImageIndex] = useState<Record<number, number>>({});

    const shiftCardImage = (projectIndex: number, direction: 1 | -1, e: React.MouseEvent) => {
        e.stopPropagation();
        setCardImageIndex((prev) => {
            const current = prev[projectIndex] ?? 0;
            const total = projects[projectIndex].images.length;
            const next = (current + direction + total) % total;
            return { ...prev, [projectIndex]: next };
        });
    };

    return (
        <section id="portafolio" className="py-12 md:py-24 bg-void-black relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[800px] h-[300px] md:h-[400px] bg-white/5 rounded-full blur-[100px] md:blur-[150px] pointer-events-none" />

            <div className="container relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-10 md:mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">Proyectos con Propósito.</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg px-4">Casos reales donde convertimos gestión en resultados medibles.</p>
                </motion.div>

                {member && (
                    <div className="mb-6 flex justify-end">
                        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-electric-orange/10 border border-electric-orange/30 text-electric-orange text-sm font-medium hover:bg-electric-orange/20 transition-all">
                            <Plus className="w-4 h-4" />
                            Agregar nuevo proyecto
                        </button>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project, index) => {
                        const activeImage = cardImageIndex[index] ?? 0;

                        return (
                            <motion.article
                                key={project.title}
                                initial={{ opacity: 0, y: 18 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -4 }}
                                onClick={() => setSelectedProject(index)}
                                className="rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02] cursor-pointer hover:border-electric-orange/40 transition-all"
                            >
                                <div className="relative h-52 overflow-hidden">
                                    <img src={project.images[activeImage]} alt={project.title} className="w-full h-full object-cover" />
                                    <button
                                        onClick={(e) => shiftCardImage(index, -1, e)}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 border border-white/20 text-white flex items-center justify-center"
                                        aria-label={`Imagen anterior de ${project.title}`}
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={(e) => shiftCardImage(index, 1, e)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 border border-white/20 text-white flex items-center justify-center"
                                        aria-label={`Imagen siguiente de ${project.title}`}
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">{project.description}</p>
                                </div>
                            </motion.article>
                        );
                    })}
                </div>
            </div>

            <AnimatePresence>
                {selectedProject !== null && (
                    <ProjectModal
                        key={projects[selectedProject].title}
                        project={projects[selectedProject]}
                        member={member}
                        onClose={() => setSelectedProject(null)}
                    />
                )}
            </AnimatePresence>
        </section>
    );
}
