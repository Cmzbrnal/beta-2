'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    Layers,
    Target,
    BarChart3,
    BookOpen,
    ArrowRight,
    Sparkles,
    X,
    Download,
    Upload,
    Lock,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PMOKnowledgeSectionProps {
    member?: any;
    onAccessRestrictedResource?: (resourceName: string) => void;
}

interface BentoItemProps {
    title: string;
    description?: string;
    icon: React.ReactNode;
    className?: string;
    iconClassName?: string;
    onClick?: () => void;
}

function BentoItem({
    title,
    description,
    icon,
    className,
    iconClassName,
    onClick
}: BentoItemProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={onClick}
            className={cn(
                "group relative rounded-3xl border border-white/10 overflow-hidden cursor-pointer",
                "bg-gradient-to-br from-white/[0.03] to-transparent",
                "hover:border-electric-orange/40 hover:shadow-[0_0_40px_rgba(255,85,0,0.1)]",
                "transition-all duration-300",
                className
            )}
        >
            {/* Inner gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-electric-orange/0 to-electric-orange/0 group-hover:from-electric-orange/5 group-hover:to-transparent transition-all duration-500" />

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-between p-6">
                {/* Icon */}
                <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
                    "bg-white/5 border border-white/10",
                    "group-hover:bg-electric-orange/10 group-hover:border-electric-orange/30",
                    "transition-all duration-300",
                    iconClassName
                )}>
                    {icon}
                </div>

                {/* Text Content */}
                <div className="flex-1 flex flex-col justify-end">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-electric-orange transition-colors duration-300">
                        {title}
                    </h3>
                    {description && (
                        <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300 line-clamp-2">
                            {description}
                        </p>
                    )}
                </div>

                {/* Arrow indicator */}
                <motion.div
                    className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                    <ArrowRight className="w-5 h-5 text-electric-orange" />
                </motion.div>
            </div>
        </motion.div>
    );
}

// ─── Modal data ───────────────────────────────────────────────────────────────
interface ModalData {
    id: string;
    title: string;
    description: string;
    items: { name: string; ext: string }[];
    restricted?: boolean;
}

const modalData: ModalData[] = [
    {
        id: 'biblioteca',
        title: 'Biblioteca de Recursos',
        description: '500+ templates y guías. Acceso exclusivo para miembros CIPRO con recursos actualizados sobre gestión de proyectos, marcos de referencia y mejores prácticas internacionales.',
        items: [
            { name: 'PMBOK Guide 7th Ed', ext: 'PDF' },
            { name: 'Templates Scrum', ext: 'XLSX' },
            { name: 'Guías PMO', ext: 'PDF' },
        ],
        restricted: true,
    },
    {
        id: 'metodologias',
        title: 'Metodologías Ágiles',
        description: 'Scrum, Kanban, SAFe, Design Thinking. Domina las frameworks más utilizadas en proyectos de transformación digital y gestión ágil moderna.',
        items: [
            { name: 'Guía Scrum CIPRO', ext: 'PDF' },
            { name: 'Tablero Kanban template', ext: 'XLSX' },
            { name: 'SAFe Framework', ext: 'PDF' },
        ],
    },
    {
        id: 'riesgos',
        title: 'Gestión de Riesgos',
        description: 'Matrices, planes de contingencia y registro de issues. Identifica, analiza y mitiga riesgos como un profesional con herramientas probadas.',
        items: [
            { name: 'Matriz de Riesgos', ext: 'XLSX' },
            { name: 'Plan de Contingencia', ext: 'PDF' },
            { name: 'Registro de Issues', ext: 'XLSX' },
        ],
    },
    {
        id: 'kpis',
        title: 'KPIs & Métricas',
        description: 'Dashboards y OKRs para medir el rendimiento de tus proyectos. Herramientas para visualizar el avance y comunicar resultados a stakeholders.',
        items: [
            { name: 'Dashboard KPIs', ext: 'XLSX' },
            { name: 'OKR Templates', ext: 'PDF' },
            { name: 'Burndown Charts', ext: 'XLSX' },
        ],
    },
    {
        id: 'pmo',
        title: 'PMO Setup',
        description: 'Constitución de PMO desde cero. Governance models, roles y responsabilidades para estructurar tu oficina de proyectos de manera efectiva.',
        items: [
            { name: 'PMO Charter', ext: 'PDF' },
            { name: 'Governance Model', ext: 'PDF' },
            { name: 'Roles & Responsabilidades', ext: 'XLSX' },
        ],
    },
    {
        id: 'documentacion',
        title: 'Documentación',
        description: 'Charters, planes, reportes y plantillas profesionales. Todo lo que necesitas para documentar tus proyectos con estándares internacionales.',
        items: [
            { name: 'Project Charter', ext: 'PDF' },
            { name: 'Plan de Proyecto', ext: 'PDF' },
            { name: 'Reporte de Avance', ext: 'XLSX' },
        ],
    },
];

// ─── Modal Component ──────────────────────────────────────────────────────────
function PMOModal({
    data,
    member,
    onClose,
}: {
    data: ModalData;
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
                className="relative w-full max-w-2xl bg-[#0B0F17] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Orange top line */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-electric-orange to-transparent" />

                <div className="p-6 md:p-8">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-2">{data.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed max-w-lg">{data.description}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="ml-4 w-8 h-8 flex-shrink-0 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Content section */}
                    <div className="mb-6">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
                            Contenido disponible
                        </p>
                        <div className="space-y-2">
                            {data.items.map((item, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:border-white/10 transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm text-white/80">{item.name}</span>
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-gray-400">
                                            {item.ext}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {!member && data.restricted && (
                                            <span className="flex items-center gap-1 text-[10px] font-semibold text-electric-orange border border-electric-orange/30 bg-electric-orange/10 px-2 py-0.5 rounded-full">
                                                <Lock className="w-2.5 h-2.5" />
                                                Solo miembros
                                            </span>
                                        )}
                                        <button
                                            disabled
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed"
                                        >
                                            <Download className="w-3 h-3" />
                                            Próximamente
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Upload section — visible only for members */}
                    {member && (
                        <div className="pt-4 border-t border-white/5">
                            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-all">
                                <Upload className="w-4 h-4" />
                                Subir nuevo documento
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export default function PMOKnowledgeSection({ member, onAccessRestrictedResource }: PMOKnowledgeSectionProps) {
    const [openModal, setOpenModal] = useState<string | null>(null);

    const handleBentoClick = (id: string) => {
        if (id === 'biblioteca' && !member && onAccessRestrictedResource) {
            onAccessRestrictedResource('Biblioteca de Recursos');
            return;
        }
        setOpenModal(id);
    };

    const activeModal = modalData.find(m => m.id === openModal) ?? null;

    return (
        <section id="repositorio" className="py-32 bg-void-black relative overflow-hidden">
            {/* Background subtle glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-electric-orange/5 rounded-full blur-[150px] pointer-events-none" />

            <div className="container relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                        PMO Knowledge
                    </h2>
                    <p className="text-gray-400 max-w-3xl mx-auto text-lg">
                        Convertimos la teoría en herramientas efectivas. Nuestro directorio más grande de todo lo aprendido sobre Project Management durante estos últimos 10 años.
                    </p>
                </motion.div>

                {/* Bento Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-4 gap-4"
                >
                    {/* Top Wide Card - Biblioteca de Recursos */}
                    <BentoItem
                        title="Biblioteca de Recursos"
                        description="Accede a más de 500 templates, guías y documentos esenciales para gestión de proyectos."
                        icon={<BookOpen className="w-6 h-6 text-white group-hover:text-electric-orange transition-colors" />}
                        className="md:col-span-4 h-auto min-h-[180px] md:h-[180px]"
                        onClick={() => handleBentoClick('biblioteca')}
                    />

                    {/* Left Tall Card - Metodologías Ágiles */}
                    <BentoItem
                        title="Metodologías Ágiles"
                        description="Scrum, Kanban, SAFe y más. Domina las frameworks más utilizadas."
                        icon={<Layers className="w-6 h-6 text-white group-hover:text-electric-orange transition-colors" />}
                        className="md:col-span-1 md:row-span-2 h-auto min-h-[220px] md:h-auto"
                        onClick={() => handleBentoClick('metodologias')}
                    />

                    {/* Center Medium Card - Featured: Gestión de Riesgos */}
                    <BentoItem
                        title="Gestión de Riesgos"
                        description="Identifica, analiza y mitiga riesgos como un profesional."
                        icon={
                            <div className="relative">
                                <Sparkles className="w-6 h-6 text-electric-orange" />
                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-electric-orange rounded-full animate-pulse" />
                            </div>
                        }
                        className="md:col-span-2 h-auto min-h-[180px] md:h-[200px] border-electric-orange/20 bg-gradient-to-br from-electric-orange/5 to-transparent"
                        iconClassName="bg-electric-orange/10 border-electric-orange/20"
                        onClick={() => handleBentoClick('riesgos')}
                    />

                    {/* Right Small Card - KPIs & Métricas */}
                    <BentoItem
                        title="KPIs & Métricas"
                        icon={<BarChart3 className="w-6 h-6 text-white group-hover:text-electric-orange transition-colors" />}
                        className="md:col-span-1 h-auto min-h-[160px] md:h-[200px]"
                        onClick={() => handleBentoClick('kpis')}
                    />

                    {/* Bottom Left Medium Card - PMO Setup */}
                    <BentoItem
                        title="PMO Setup"
                        description="Estructura tu oficina de proyectos desde cero."
                        icon={<Target className="w-6 h-6 text-white group-hover:text-electric-orange transition-colors" />}
                        className="md:col-span-2 h-auto min-h-[160px] md:h-[160px]"
                        onClick={() => handleBentoClick('pmo')}
                    />

                    {/* Bottom Right Card - Documentación */}
                    <BentoItem
                        title="Documentación"
                        description="Charters, planes, reportes y plantillas profesionales."
                        icon={<FileText className="w-6 h-6 text-white group-hover:text-electric-orange transition-colors" />}
                        className="md:col-span-1 h-auto min-h-[160px] md:h-[160px]"
                        onClick={() => handleBentoClick('documentacion')}
                    />
                </motion.div>
            </div>

            {/* Modals */}
            <AnimatePresence>
                {activeModal && (
                    <PMOModal
                        key={activeModal.id}
                        data={activeModal}
                        member={member}
                        onClose={() => setOpenModal(null)}
                    />
                )}
            </AnimatePresence>
        </section>
    );
}
