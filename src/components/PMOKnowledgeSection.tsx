'use client';

import React, { useEffect, useState } from 'react';
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
    Pencil,
    Plus,
    Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import SectionContentFiles from '@/components/SectionContentFiles';

interface PMOKnowledgeSectionProps {
    member?: any;
    onAccessRestrictedResource?: (resourceName: string) => void;
}

type SpaceSection = 'biblioteca' | 'eventos' | 'capacitaciones' | 'pmo' | 'metodologias' | 'documentacion';
type Space = {
    id: string;
    space_key: string;
    section: SpaceSection;
    title: string;
    description: string;
    display_order: number;
    is_default: boolean;
};

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
    section: SpaceSection;
    title: string;
    description: string;
    restricted?: boolean;
}

const fallbackSpaces: Space[] = [
    {
        id: 'biblioteca',
        space_key: 'biblioteca',
        section: 'biblioteca',
        title: 'Biblioteca de Recursos',
        description: '500+ templates y guías. Acceso exclusivo para miembros CIPRO con recursos actualizados sobre gestión de proyectos, marcos de referencia y mejores prácticas internacionales.',
        display_order: 1,
        is_default: true,
    },
    {
        id: 'metodologias',
        space_key: 'metodologias',
        section: 'metodologias',
        title: 'Metodologías Ágiles',
        description: 'Scrum, Kanban, SAFe, Design Thinking. Domina las frameworks más utilizadas en proyectos de transformación digital y gestión ágil moderna.',
        display_order: 2,
        is_default: true,
    },
    {
        id: 'riesgos',
        space_key: 'riesgos',
        section: 'documentacion',
        title: 'Gestión de Riesgos',
        description: 'Matrices, planes de contingencia y registro de issues. Identifica, analiza y mitiga riesgos como un profesional con herramientas probadas.',
        display_order: 3,
        is_default: true,
    },
    {
        id: 'kpis',
        space_key: 'kpis',
        section: 'documentacion',
        title: 'KPIs & Métricas',
        description: 'Dashboards y OKRs para medir el rendimiento de tus proyectos. Herramientas para visualizar el avance y comunicar resultados a stakeholders.',
        display_order: 4,
        is_default: true,
    },
    {
        id: 'pmo',
        space_key: 'pmo',
        section: 'pmo',
        title: 'PMO Setup',
        description: 'Constitución de PMO desde cero. Governance models, roles y responsabilidades para estructurar tu oficina de proyectos de manera efectiva.',
        display_order: 5,
        is_default: true,
    },
    {
        id: 'documentacion',
        space_key: 'documentacion',
        section: 'documentacion',
        title: 'Documentación',
        description: 'Charters, planes, reportes y plantillas profesionales. Todo lo que necesitas para documentar tus proyectos con estándares internacionales.',
        display_order: 6,
        is_default: true,
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
                    </div>
                    <SectionContentFiles section={data.section} title={data.title} member={member} />
                </div>
            </motion.div>
        </motion.div>
    );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export default function PMOKnowledgeSection({ member, onAccessRestrictedResource }: PMOKnowledgeSectionProps) {
    const [openModal, setOpenModal] = useState<string | null>(null);
    const [spaces, setSpaces] = useState<Space[]>(fallbackSpaces);
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState({ id: '', title: '', description: '', section: 'biblioteca' as SpaceSection });
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch('/api/content-spaces')
            .then((response) => response.json())
            .then((data) => {
                if (!data.success) throw new Error(data.message);
                setSpaces(data.spaces);
            })
            .catch((error) => setMessage(error instanceof Error ? error.message : 'No se pudieron cargar los espacios.'));
    }, []);

    const handleBentoClick = (id: string) => {
        const space = spaces.find((item) => item.id === id);
        if (space?.section === 'biblioteca' && !member && onAccessRestrictedResource) {
            onAccessRestrictedResource(space.title);
            return;
        }
        setOpenModal(id);
    };

    const activeModal = spaces.find((space) => space.id === openModal) ?? null;

    const saveSpace = async () => {
        if (!member || !draft.title.trim()) return;
        setMessage('');
        const response = await fetch('/api/content-spaces', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'save', ...draft }),
        });
        const data = await response.json();
        if (!response.ok || !data.success) {
            setMessage(data.message || 'No se pudo guardar el espacio.');
            return;
        }
        setSpaces((current) => draft.id
            ? current.map((space) => space.id === draft.id ? data.space : space)
            : [...current, data.space]);
        setDraft({ id: '', title: '', description: '', section: 'biblioteca' });
        setMessage('Espacio guardado.');
    };

    const deleteSpace = async (space: Space) => {
        if (!member || space.is_default || !window.confirm(`¿Eliminar "${space.title}"?`)) return;
        const response = await fetch('/api/content-spaces', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'delete', id: space.id }),
        });
        const data = await response.json();
        if (!response.ok || !data.success) {
            setMessage(data.message || 'No se pudo eliminar el espacio.');
            return;
        }
        setSpaces((current) => current.filter((item) => item.id !== space.id));
        if (openModal === space.id) setOpenModal(null);
    };

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
                    {member && (
                        <button onClick={() => setEditing((value) => !value)} className="mt-5 inline-flex items-center gap-2 rounded-lg border border-electric-orange/30 bg-electric-orange/10 px-4 py-2 text-sm text-orange-200">
                            <Pencil className="h-4 w-4" /> {editing ? 'Cerrar edición' : 'Editar espacios'}
                        </button>
                    )}
                </motion.div>

                {editing && member && (
                    <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                        <div className="flex flex-wrap gap-2">
                            {spaces.map((space) => (
                                <button key={space.id} onClick={() => setDraft({ id: space.id, title: space.title, description: space.description, section: space.section })} className="rounded-lg border border-white/10 px-3 py-2 text-xs text-gray-300 hover:border-electric-orange/40">
                                    {space.title}
                                </button>
                            ))}
                            <button onClick={() => setDraft({ id: '', title: '', description: '', section: 'biblioteca' })} className="inline-flex items-center gap-1 rounded-lg border border-blue-500/30 px-3 py-2 text-xs text-blue-300">
                                <Plus className="h-3 w-3" /> Nuevo espacio
                            </button>
                        </div>
                        <div className="mt-4 grid gap-2 md:grid-cols-[1fr_1fr_180px_auto]">
                            <input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} placeholder="Título del espacio" className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none" />
                            <input value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} placeholder="Descripción corta" className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none" />
                            <select value={draft.section} onChange={(event) => setDraft({ ...draft, section: event.target.value as SpaceSection })} className="rounded-lg border border-white/10 bg-[#131926] px-3 py-2 text-sm text-white outline-none">
                                <option value="biblioteca">Biblioteca</option>
                                <option value="pmo">PMO Setup</option>
                                <option value="metodologias">Metodologías ágiles</option>
                                <option value="documentacion">Documentación</option>
                                <option value="eventos">Eventos</option>
                                <option value="capacitaciones">Capacitaciones</option>
                            </select>
                            <button onClick={saveSpace} className="rounded-lg bg-electric-orange px-4 py-2 text-sm font-semibold text-white">Guardar</button>
                        </div>
                        {draft.id && !spaces.find((space) => space.id === draft.id)?.is_default && (
                            <button onClick={() => { const space = spaces.find((item) => item.id === draft.id); if (space) deleteSpace(space); }} className="mt-3 inline-flex items-center gap-1 text-xs text-red-300">
                                <Trash2 className="h-3 w-3" /> Eliminar espacio
                            </button>
                        )}
                        {message && <p className="mt-2 text-xs text-gray-400">{message}</p>}
                    </div>
                )}

                {/* Bento Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-4 gap-4"
                >
                    {/* Top Wide Card - Biblioteca de Recursos */}
                    {spaces.map((space, index) => (
                        <BentoItem
                            key={space.id}
                            title={space.title}
                            description={space.description}
                            icon={index === 0 ? <BookOpen className="w-6 h-6 text-white group-hover:text-electric-orange transition-colors" /> : index === 1 ? <Layers className="w-6 h-6 text-white group-hover:text-electric-orange transition-colors" /> : index === 4 ? <Target className="w-6 h-6 text-white group-hover:text-electric-orange transition-colors" /> : <FileText className="w-6 h-6 text-white group-hover:text-electric-orange transition-colors" />}
                            className={index === 0 ? 'md:col-span-4 min-h-[180px] md:h-[180px]' : index === 1 ? 'md:col-span-1 md:row-span-2 min-h-[220px]' : 'md:col-span-1 min-h-[160px] md:h-[200px]'}
                            onClick={() => handleBentoClick(space.id)}
                        />
                    ))}

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
