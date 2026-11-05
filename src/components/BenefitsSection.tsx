'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Users, X } from 'lucide-react';
import BenefitCard from '@/components/ui/benefit-card';
import SectionContentFiles from '@/components/SectionContentFiles';

// ─── Datos base de las tarjetas ───────────────────────────────────────────────
const benefits = [
    {
        id: 'eventos',
        icon: Calendar,
        title: "Eventos Exclusivos",
        description: "Acceso privilegiado a networking y conferencias con líderes de la industria.",
        imageSrc: "/imagenes/cards/eventos_exclusivos.webp",
        imageAlt: "Eventos profesionales y networking",
        hasModal: true,
    },
    {
        id: 'capacitaciones',
        icon: Users,
        title: "Capacitaciones",
        description: "Workshops intensivos para dominar las metodologías ágiles modernas.",
        imageSrc: "/imagenes/cards/capacitaciones.webp",
        imageAlt: "Capacitación y desarrollo profesional",
        hasModal: true,
    },
];

// ─── Type badge colors ────────────────────────────────────────────────────────
const typeColors: Record<string, string> = {
    'Workshop': 'text-electric-orange border-electric-orange/40 bg-electric-orange/10',
    'Presentación': 'text-blue-400 border-blue-400/40 bg-blue-400/10',
    'Networking': 'text-emerald-400 border-emerald-400/40 bg-emerald-400/10',
    'Online': 'text-purple-400 border-purple-400/40 bg-purple-400/10',
    'Presencial': 'text-electric-orange border-electric-orange/40 bg-electric-orange/10',
    'Intensivo': 'text-rose-400 border-rose-400/40 bg-rose-400/10',
    'Taller': 'text-amber-400 border-amber-400/40 bg-amber-400/10',
};

// ─── Modal de Eventos ─────────────────────────────────────────────────────────
const eventosProximos = [
    { fecha: "Por confirmar", nombre: "Taller de Gestión Ágil con Scrum", tipo: "Workshop", lugar: "Sala de reuniones UNI" },
    { fecha: "Por confirmar", nombre: "Demo Day — Proyectos CIPRO 2025", tipo: "Presentación", lugar: "Auditorio Facultad" },
    { fecha: "Por confirmar", nombre: "Networking: Consultoras Jr. & Empresas", tipo: "Networking", lugar: "Por definir" },
];

const eventosPasados = [
    { fecha: "Mar 2025", nombre: "Introducción a PMI y PMBOK 7", tipo: "Workshop", lugar: "Sala técnica UNI" },
    { fecha: "Ene 2025", nombre: "Design Thinking Sprint", tipo: "Intensivo", lugar: "Auditorio Facultad" },
];
const eventosDefaults: SectionContent = { proximos: eventosProximos, pasados: eventosPasados };

function EventosModal({ onClose, member }: { onClose: () => void; member?: any }) {
    const [activeTab, setActiveTab] = useState<'proximos' | 'pasados'>('proximos');

    return (
        <ModalWrapper onClose={onClose}>
            <ModalHeader title="Eventos Exclusivos" subtitle="Conecta, aprende y crece con nuestra comunidad" onClose={onClose} />

            {/* Tabs */}
            <div className="flex gap-1 mb-6 border-b border-white/10">
                {(['proximos', 'pasados'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 text-sm font-medium transition-all capitalize ${
                            activeTab === tab
                                ? 'text-electric-orange border-b-2 border-electric-orange -mb-px'
                                : 'text-gray-500 hover:text-gray-300'
                        }`}
                    >
                        {tab === 'proximos' ? 'Próximos Eventos' : 'Pasados'}
                    </button>
                ))}
            </div>

            <SectionPresetEditor section="eventos" title="Eventos Exclusivos" defaults={eventosDefaults} member={member}>
                {(content) => {
                    const proximos = Array.isArray(content.proximos) ? content.proximos as typeof eventosProximos : eventosProximos;
                    const pasados = Array.isArray(content.pasados) ? content.pasados as typeof eventosPasados : eventosPasados;
                    const eventos = activeTab === 'proximos' ? proximos : pasados;
                    return (
                        <>
                            <div className="space-y-3 mb-4">
                                {eventos.map((ev, i) => (
                                    <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:border-electric-orange/20 transition-all">
                                        <div className="w-10 h-10 rounded-xl bg-electric-orange/10 border border-electric-orange/20 flex items-center justify-center flex-shrink-0 text-electric-orange font-bold text-sm">
                                            {String(i + 1).padStart(2, '0')}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white font-semibold text-sm">{ev.nombre}</p>
                                            <p className="text-gray-500 text-xs mt-0.5">📍 {ev.lugar}</p>
                                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border text-gray-300 border-white/10 bg-white/5">{ev.fecha}</span>
                                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${typeColors[ev.tipo] ?? 'text-gray-400 border-white/10 bg-white/5'}`}>{ev.tipo}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p className="text-[11px] text-gray-600 text-center mt-4">📌 Información actualizada por la directiva de CIPRO. Los detalles pueden cambiar.</p>
                        </>
                    );
                }}
            </SectionPresetEditor>
            <SectionContentFiles section="eventos" title="Eventos Exclusivos" member={member} />
        </ModalWrapper>
    );
}

// ─── Modal de Capacitaciones ──────────────────────────────────────────────────
const temario = [
    { modulo: "Introducción a la Gestión de Proyectos (PMBOK)", duracion: "4h" },
    { modulo: "Scrum Master & Product Owner", duracion: "8h" },
    { modulo: "Design Thinking aplicado a proyectos", duracion: "6h" },
    { modulo: "Kanban & Gestión Visual de Proyectos", duracion: "4h" },
    { modulo: "OKRs y KPIs para equipos ágiles", duracion: "3h" },
];

const expositores = [
    { nombre: "Luis Ramos Torres", cargo: "PMP Certified — Gerente de PMO" },
    { nombre: "Andrea Vega", cargo: "Scrum Master — Consultora Ágil" },
    { nombre: "Marcos Díaz", cargo: "Design Thinking Facilitator" },
];

const materiales = [
    { nombre: "Slides Módulo 1 — PMBOK", ext: "PDF" },
    { nombre: "Ejercicios Scrum", ext: "PDF" },
    { nombre: "Template Kanban Board", ext: "XLSX" },
];
const capacitacionesDefaults: SectionContent = { temario, expositores, materiales };

type CapTab = 'temario' | 'expositores' | 'material';
type SectionContent = Record<string, unknown>;

function SectionPresetEditor({
    section,
    title,
    defaults,
    member,
    children,
}: {
    section: 'eventos' | 'capacitaciones';
    title: string;
    defaults: SectionContent;
    member?: any;
    children: (content: SectionContent, editing: boolean, update: (value: SectionContent) => void) => React.ReactNode;
}) {
    const [content, setContent] = useState<SectionContent>(defaults);
    const [entityId, setEntityId] = useState('');
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const status = member?.codigoUni ? 'all' : 'published';
        fetch(`/api/content-entities?section=${section}&status=${status}`)
            .then((response) => response.json())
            .then((data) => {
                if (!data.success) throw new Error(data.message);
                const entity = data.entities?.find((item: any) =>
                    item.title === title && (!member?.codigoUni || item.created_by === member.codigoUni)
                );
                if (entity) {
                    setEntityId(entity.id);
                    setContent(entity.content || defaults);
                }
            })
            .catch(() => undefined);
    }, [section, title, member?.codigoUni]);

    const startEditing = () => {
        setDraft(JSON.stringify(content, null, 2));
        setEditing(true);
        setMessage('');
    };

    const save = async (publish: boolean) => {
        if (!member?.codigoUni) return;
        try {
            const parsed = JSON.parse(draft) as SectionContent;
            const response = await fetch('/api/content-entities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: publish ? 'publish' : 'save',
                    id: entityId || undefined,
                    section,
                    title,
                    description: '',
                    content: parsed,
                }),
            });
            const data = await response.json();
            if (!response.ok || !data.success) throw new Error(data.message);
            setEntityId(data.entity.id);
            setContent(parsed);
            setEditing(false);
            setMessage(publish ? 'Contenido publicado.' : 'Borrador guardado.');
        } catch (error) {
            setMessage(error instanceof Error ? error.message : 'El contenido debe tener formato JSON válido.');
        }
    };

    return (
        <>
            {children(content, editing, setContent)}
            {member && (
                <div className="mt-4 border-t border-white/10 pt-4">
                    {!editing ? (
                        <button onClick={startEditing} className="rounded-lg border border-electric-orange/30 bg-electric-orange/10 px-4 py-2 text-sm text-electric-orange">
                            Editar contenido predeterminado
                        </button>
                    ) : (
                        <>
                            <p className="mb-2 text-xs text-gray-500">Edita los datos predeterminados en formato JSON. Puedes cambiar textos, fechas, lugares y materiales.</p>
                            <textarea value={draft} onChange={(event) => setDraft(event.target.value)} rows={12} className="w-full rounded-lg border border-white/10 bg-white/5 p-3 font-mono text-xs text-white outline-none focus:border-electric-orange/50" />
                            <div className="mt-2 flex flex-wrap gap-2">
                                <button onClick={() => save(false)} className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">Guardar borrador</button>
                                <button onClick={() => save(true)} className="rounded-lg bg-electric-orange px-3 py-2 text-sm font-semibold text-white">Publicar cambios</button>
                                <button onClick={() => setEditing(false)} className="rounded-lg border border-white/10 px-3 py-2 text-sm text-gray-300">Cancelar</button>
                            </div>
                        </>
                    )}
                    {message && <p className="mt-2 text-xs text-gray-400">{message}</p>}
                </div>
            )}
        </>
    );
}

function CapacitacionesModal({ onClose, member }: { onClose: () => void; member?: any }) {
    const [activeTab, setActiveTab] = useState<CapTab>('temario');

    const tabs: { key: CapTab; label: string }[] = [
        { key: 'temario', label: 'Temario' },
        { key: 'expositores', label: 'Expositores' },
        { key: 'material', label: 'Material' },
    ];

    return (
        <ModalWrapper onClose={onClose}>
            <ModalHeader title="Programa de Capacitaciones" subtitle="Metodologías y herramientas de clase mundial" onClose={onClose} />

            {/* Tabs */}
            <div className="flex gap-1 mb-6 border-b border-white/10">
                {tabs.map(({ key, label }) => (
                    <button
                        key={key}
                        onClick={() => setActiveTab(key)}
                        className={`px-4 py-2 text-sm font-medium transition-all ${
                            activeTab === key
                                ? 'text-electric-orange border-b-2 border-electric-orange -mb-px'
                                : 'text-gray-500 hover:text-gray-300'
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            <SectionPresetEditor section="capacitaciones" title="Programa de Capacitaciones" defaults={capacitacionesDefaults} member={member}>
                {(content) => {
                    const currentTemario = Array.isArray(content.temario) ? content.temario as typeof temario : temario;
                    const currentExpositores = Array.isArray(content.expositores) ? content.expositores as typeof expositores : expositores;
                    const currentMateriales = Array.isArray(content.materiales) ? content.materiales as typeof materiales : materiales;
                    return <AnimatePresence mode="wait">
                {activeTab === 'temario' && (
                    <motion.div
                        key="temario"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="space-y-2"
                    >
                        {currentTemario.map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:border-electric-orange/20 transition-all">
                                <div className="flex items-center gap-3">
                                    <span className="text-electric-orange text-sm font-bold w-6">{String(i + 1).padStart(2, '0')}</span>
                                    <span className="text-white/80 text-sm">{item.modulo}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-500 border border-white/10 px-2 py-0.5 rounded-full">{item.duracion}</span>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                )}

                {activeTab === 'expositores' && (
                    <motion.div
                        key="expositores"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="space-y-3"
                    >
                        {currentExpositores.map((exp, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                                <div className="w-10 h-10 rounded-full bg-electric-orange/10 border border-electric-orange/20 flex items-center justify-center text-electric-orange font-bold text-sm flex-shrink-0">
                                    {exp.nombre.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <p className="text-white font-semibold text-sm">{exp.nombre}</p>
                                    <p className="text-gray-500 text-xs mt-0.5">{exp.cargo}</p>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                )}

                {activeTab === 'material' && (
                    <motion.div
                        key="material"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="space-y-2"
                    >
                        {currentMateriales.map((mat, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/[0.02]">
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-500 text-sm">📄</span>
                                    <span className="text-white/80 text-sm">{mat.nombre}</span>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-gray-400">{mat.ext}</span>
                                </div>
                                <span className="text-xs text-gray-600 border border-white/5 px-2 py-1 rounded-lg">Disponible próximamente</span>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>;
                }}
            </SectionPresetEditor>
            <SectionContentFiles section="capacitaciones" title="Programa de Capacitaciones" member={member} />
        </ModalWrapper>
    );
}

// ─── Shared modal shell components ────────────────────────────────────────────
function ModalWrapper({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
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
                className="relative w-full max-w-2xl bg-[#0B0F17] border border-white/10 rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Orange top line */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-electric-orange to-transparent z-10" />
                <div className="p-6 md:p-8 flex-1 overflow-y-auto">
                    {children}
                </div>
            </motion.div>
        </motion.div>
    );
}

function ModalHeader({ title, subtitle, onClose }: { title: string; subtitle: string; onClose: () => void }) {
    return (
        <div className="flex items-start justify-between mb-6">
            <div>
                <h3 className="text-2xl font-bold text-white mb-1">{title}</h3>
                <p className="text-sm text-gray-400">{subtitle}</p>
            </div>
            <button
                onClick={onClose}
                className="ml-4 w-8 h-8 flex-shrink-0 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}

// ─── Sección principal ────────────────────────────────────────────────────────
interface BenefitsSectionProps {
    member?: any;
    onAccessRestrictedResource?: (resourceName: string) => void;
}

export default function BenefitsSection({ member, onAccessRestrictedResource }: BenefitsSectionProps) {
    const [openModal, setOpenModal] = useState<string | null>(null);

    const handleCardClick = (id: string) => {
        setOpenModal(prev => (prev === id ? null : id));
    };

    return (
        <section id="nosotros" className="py-20 md:py-32 bg-void-black relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-electric-orange/5 rounded-full blur-[128px]" />
            </div>

            <div className="container relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12 md:mb-20"
                >
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                        Más que una comunidad.
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg hover:text-gray-300 transition-colors">
                        Gestionamos el presente, proyectamos el futuro.
                    </p>
                </motion.div>

                {/* Grid de tarjetas */}
                <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
                    {benefits.map((benefit, index) => (
                        <div key={benefit.id} className="relative">
                            <BenefitCard
                                title={benefit.title}
                                description={benefit.description}
                                icon={benefit.icon}
                                imageSrc={benefit.imageSrc}
                                imageAlt={benefit.imageAlt}
                                index={index}
                                hasDetail={benefit.hasModal}
                                isOpen={openModal === benefit.id}
                                onClick={() => handleCardClick(benefit.id)}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Modals */}
            <AnimatePresence>
                {openModal === 'eventos' && (
                    <EventosModal key="eventos" member={member} onClose={() => setOpenModal(null)} />
                )}
                {openModal === 'capacitaciones' && (
                    <CapacitacionesModal key="capacitaciones" member={member} onClose={() => setOpenModal(null)} />
                )}
            </AnimatePresence>
        </section>
    );
}
