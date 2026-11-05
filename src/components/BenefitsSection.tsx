'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Calendar, Eye, FileText, Image as ImageIcon, Pencil, Plus, Save, Trash2, Upload, Users, X,
} from 'lucide-react';
import BenefitCard from '@/components/ui/benefit-card';

type Section = 'eventos' | 'capacitaciones';
type EntityFile = { id: string; name: string; url: string; mimeType: string };
type Entity = {
    id: string;
    title: string;
    description: string;
    content: Record<string, any>;
    status: 'draft' | 'published';
    created_by?: string;
    files: EntityFile[];
};
type EventItem = { id?: string; nombre: string; fecha: string; lugar: string; tipo: string; estado: 'proximo' | 'pasado'; files?: EntityFile[] };

const benefits = [
    { id: 'eventos', icon: Calendar, title: 'Eventos Exclusivos', description: 'Acceso privilegiado a networking y conferencias con líderes de la industria.', imageSrc: '/imagenes/cards/eventos_exclusivos.webp', imageAlt: 'Eventos profesionales y networking', hasModal: true },
    { id: 'capacitaciones', icon: Users, title: 'Capacitaciones', description: 'Workshops intensivos para dominar las metodologías ágiles modernas.', imageSrc: '/imagenes/cards/capacitaciones.webp', imageAlt: 'Capacitación y desarrollo profesional', hasModal: true },
];

const fieldClass = 'w-full rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-electric-orange/50 disabled:opacity-60';
const badgeClass = 'rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-gray-300';
const typeColors: Record<string, string> = {
    Workshop: 'text-electric-orange border-electric-orange/40 bg-electric-orange/10',
    Presentación: 'text-blue-400 border-blue-400/40 bg-blue-400/10',
    Networking: 'text-emerald-400 border-emerald-400/40 bg-emerald-400/10',
    Online: 'text-purple-400 border-purple-400/40 bg-purple-400/10',
    Presencial: 'text-electric-orange border-electric-orange/40 bg-electric-orange/10',
    Intensivo: 'text-rose-400 border-rose-400/40 bg-rose-400/10',
    Taller: 'text-amber-400 border-amber-400/40 bg-amber-400/10',
};

const defaultEvents: EventItem[] = [
    { nombre: 'Taller de Gestión Ágil con Scrum', fecha: 'Por confirmar', tipo: 'Workshop', lugar: 'Sala de reuniones UNI', estado: 'proximo' },
    { nombre: 'Demo Day — Proyectos CIPRO 2025', fecha: 'Por confirmar', tipo: 'Presentación', lugar: 'Auditorio Facultad', estado: 'proximo' },
    { nombre: 'Networking: Consultoras Jr. & Empresas', fecha: 'Por confirmar', tipo: 'Networking', lugar: 'Por definir', estado: 'proximo' },
    { nombre: 'Introducción a PMI y PMBOK 7', fecha: 'Mar 2025', tipo: 'Workshop', lugar: 'Sala técnica UNI', estado: 'pasado' },
    { nombre: 'Design Thinking Sprint', fecha: 'Ene 2025', tipo: 'Intensivo', lugar: 'Auditorio Facultad', estado: 'pasado' },
];

const defaultTraining = {
    temario: [
        { modulo: 'Introducción a la Gestión de Proyectos (PMBOK)', duracion: '4h' },
        { modulo: 'Scrum Master & Product Owner', duracion: '8h' },
        { modulo: 'Design Thinking aplicado a proyectos', duracion: '6h' },
        { modulo: 'Kanban & Gestión Visual de Proyectos', duracion: '4h' },
        { modulo: 'OKRs y KPIs para equipos ágiles', duracion: '3h' },
    ],
    expositores: [
        { nombre: 'Luis Ramos Torres', cargo: 'PMP Certified — Gerente de PMO' },
        { nombre: 'Andrea Vega', cargo: 'Scrum Master — Consultora Ágil' },
        { nombre: 'Marcos Díaz', cargo: 'Design Thinking Facilitator' },
    ],
};

function ModalWrapper({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
    return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md" onClick={onClose}>
        <motion.div initial={{ opacity: 0, scale: .95 }} animate={{ opacity: 1, scale: 1 }} className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0B0F17] shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="h-[2px] bg-gradient-to-r from-transparent via-electric-orange to-transparent" />
            <div className="min-h-0 flex-1 overflow-y-auto p-6 md:p-8">{children}</div>
        </motion.div>
    </motion.div>;
}

function ModalHeader({ title, subtitle, onClose }: { title: string; subtitle: string; onClose: () => void }) {
    return <div className="mb-6 flex items-start justify-between">
        <div><h3 className="mb-1 text-2xl font-bold text-white">{title}</h3><p className="text-sm text-gray-400">{subtitle}</p></div>
        <button onClick={onClose} className="ml-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-400"><X className="h-4 w-4" /></button>
    </div>;
}

function useEntities(section: Section, member?: any) {
    const [entities, setEntities] = useState<Entity[]>([]);
    const [loading, setLoading] = useState(true);
    const reload = async () => {
        setLoading(true);
        try {
            const status = member?.codigoUni ? 'all' : 'published';
            const response = await fetch(`/api/content-entities?section=${section}&status=${status}`);
            const data = await response.json();
            if (!response.ok || !data.success) throw new Error(data.message);
            setEntities((data.entities || []).filter((entity: Entity) => !member?.codigoUni || entity.created_by === member.codigoUni || entity.status === 'published'));
        } finally { setLoading(false); }
    };
    useEffect(() => { reload().catch(() => setLoading(false)); }, [section, member?.codigoUni]);
    return { entities, loading, reload };
}

function PreviewFile({ file }: { file: EntityFile }) {
    const previewUrl = file.mimeType === 'application/pdf' ? `${file.url}#page=1` : file.url;
    return <a href={previewUrl} target="_blank" rel="noreferrer" title="Vista previa" className="inline-flex items-center gap-1 text-blue-300 hover:text-white">
        <Eye className="h-4 w-4" /><span className="sr-only">Vista previa de {file.name}</span>
    </a>;
}

function EntityFiles({ section, entity, member, onChange }: { section: Section; entity: Entity; member?: any; onChange: (files: EntityFile[]) => void }) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [busy, setBusy] = useState(false);
    const upload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]; event.target.value = '';
        if (!file || !member?.codigoUni) return;
        if (!['application/pdf', 'image/png', 'image/jpeg', 'image/webp', 'image/gif'].includes(file.type) || file.size > 8 * 1024 * 1024) return;
        setBusy(true);
        try {
            const base64 = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader(); reader.onload = () => resolve(String(reader.result).split(',')[1] || ''); reader.onerror = () => reject(new Error('No se pudo leer el archivo.')); reader.readAsDataURL(file);
            });
            const response = await fetch('/api/content-entities', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'uploadFile', section, entityId: entity.id, fileName: file.name, mimeType: file.type, base64 }) });
            const data = await response.json(); if (!response.ok || !data.success) throw new Error(data.message);
            onChange([...entity.files, data.file]);
        } finally { setBusy(false); }
    };
    return <div className="mt-4 border-t border-white/10 pt-4">
        {member && <><input ref={inputRef} type="file" accept=".pdf,image/png,image/jpeg,image/webp,image/gif" onChange={upload} className="hidden" /><button onClick={() => inputRef.current?.click()} disabled={busy} className="flex items-center gap-2 rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-sm text-blue-300 disabled:opacity-50"><Upload className="h-4 w-4" />{busy ? 'Cargando...' : 'Subir afiche, PDF o imagen'}</button></>}
        <div className="mt-2 space-y-2">{entity.files.map((file) => <div key={file.id} className="flex items-center justify-between rounded-lg border border-blue-500/20 bg-blue-500/5 p-2 text-sm">
            <span className="flex min-w-0 items-center gap-2 text-blue-300">{file.mimeType.startsWith('image/') ? <ImageIcon className="h-4 w-4" /> : <FileText className="h-4 w-4" />}<span className="truncate">{file.name}</span></span><PreviewFile file={file} />
        </div>)}</div>
    </div>;
}

function EventForm({ event, onSave, onCancel }: { event?: EventItem; onSave: (event: EventItem) => void; onCancel: () => void }) {
    const [form, setForm] = useState<EventItem>(event || { nombre: '', fecha: '', lugar: '', tipo: 'Workshop', estado: 'proximo' });
    const update = (key: keyof EventItem, value: string) => setForm((current) => ({ ...current, [key]: value }));
    return <div className="space-y-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <input value={form.nombre} onChange={(e) => update('nombre', e.target.value)} placeholder="Título del evento" className={fieldClass} />
        <div className="grid gap-3 sm:grid-cols-2"><input value={form.fecha} onChange={(e) => update('fecha', e.target.value)} placeholder="Fecha (ej. 20 Nov 2026)" className={fieldClass} /><input value={form.lugar} onChange={(e) => update('lugar', e.target.value)} placeholder="Lugar" className={fieldClass} /></div>
        <div className="grid gap-3 sm:grid-cols-2"><input value={form.tipo} onChange={(e) => update('tipo', e.target.value)} placeholder="Tipo o etiqueta" className={fieldClass} /><select value={form.estado} onChange={(e) => update('estado', e.target.value)} className={fieldClass}><option value="proximo">Próximo evento</option><option value="pasado">Evento pasado</option></select></div>
        <div className="flex gap-2"><button onClick={() => form.nombre.trim() && onSave(form)} className="rounded-lg bg-electric-orange px-3 py-2 text-sm font-semibold text-white"><Save className="mr-1 inline h-4 w-4" />Guardar</button><button onClick={onCancel} className="rounded-lg border border-white/10 px-3 py-2 text-sm text-gray-300">Cancelar</button></div>
    </div>;
}

function EventosModal({ onClose, member }: { onClose: () => void; member?: any }) {
    const { entities, loading, reload } = useEntities('eventos', member);
    const [tab, setTab] = useState<'proximo' | 'pasado'>('proximo');
    const [editing, setEditing] = useState<EventItem | null>(null);
    const [creating, setCreating] = useState(false);
    const [message, setMessage] = useState('');
    const events = useMemo(() => {
        const current = entities.filter((entity) => entity.content?.kind === 'event').map((entity) => ({ id: entity.id, ...entity.content, files: entity.files }));
        if (current.length) return current as EventItem[];
        const legacy = entities.find((entity) => Array.isArray(entity.content?.proximos) || Array.isArray(entity.content?.pasados));
        if (legacy) {
            return [
                ...(legacy.content.proximos || []).map((event: Omit<EventItem, 'estado'>) => ({ ...event, estado: 'proximo' })),
                ...(legacy.content.pasados || []).map((event: Omit<EventItem, 'estado'>) => ({ ...event, estado: 'pasado' })),
            ];
        }
        return defaultEvents;
    }, [entities]);
    const visible = events.filter((event) => event.estado === tab);
    const save = async (event: EventItem) => {
        if (!member?.codigoUni) return;
        const response = await fetch('/api/content-entities', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'publish', id: event.id, section: 'eventos', title: event.nombre, content: { ...event, kind: 'event' } }) });
        const data = await response.json(); if (!response.ok || !data.success) { setMessage(data.message); return; }
        setEditing(null); setCreating(false); setMessage('Evento publicado.'); reload();
    };
    const remove = async (event: EventItem) => {
        if (!event.id || !confirm('¿Eliminar este evento?')) return;
        await fetch('/api/content-entities', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'delete', section: 'eventos', id: event.id }) });
        reload();
    };
    return <ModalWrapper onClose={onClose}><ModalHeader title="Eventos Exclusivos" subtitle="Crea y administra cada evento por separado" onClose={onClose} />
        <div className="mb-5 flex border-b border-white/10">{(['proximo', 'pasado'] as const).map((value) => <button key={value} onClick={() => setTab(value)} className={`px-4 py-2 text-sm ${tab === value ? 'border-b-2 border-electric-orange text-electric-orange' : 'text-gray-500'}`}>{value === 'proximo' ? 'Próximos eventos' : 'Pasados'}</button>)}</div>
        {member && <button onClick={() => { setCreating(true); setEditing(null); }} className="mb-4 flex items-center gap-2 rounded-lg border border-electric-orange/30 bg-electric-orange/10 px-3 py-2 text-sm text-electric-orange"><Plus className="h-4 w-4" />Crear evento</button>}
        {creating && <EventForm onSave={save} onCancel={() => setCreating(false)} />}
        <div className="mt-4 space-y-3">{!loading && visible.map((event, index) => <div key={event.id || event.nombre} className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
            {editing === event ? <EventForm event={event} onSave={save} onCancel={() => setEditing(null)} /> : <div className="flex items-start gap-4"><div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-electric-orange/20 bg-electric-orange/10 text-sm font-bold text-electric-orange">{String(index + 1).padStart(2, '0')}</div><div className="min-w-0 flex-1"><p className="font-semibold text-white">{event.nombre}</p><p className="mt-0.5 text-xs text-gray-500">📍 {event.lugar}</p><div className="mt-2 flex flex-wrap gap-2"><span className={badgeClass}>{event.fecha}</span><span className={`${badgeClass} ${typeColors[event.tipo] || ''}`}>{event.tipo}</span></div></div>{member && <div className="flex gap-2"><button onClick={() => setEditing(event)} title="Editar" className="text-gray-400 hover:text-white"><Pencil className="h-4 w-4" /></button>{event.id && <button onClick={() => remove(event)} title="Eliminar" className="text-red-400"><Trash2 className="h-4 w-4" /></button>}</div>}</div>}
            {event.id && <EntityFiles section="eventos" entity={entities.find((entity) => entity.id === event.id)!} member={member} onChange={() => reload()} />}
        </div>)}</div>
        {message && <p className="mt-3 text-xs text-gray-400">{message}</p>}
    </ModalWrapper>;
}

function CapacitacionesModal({ onClose, member }: { onClose: () => void; member?: any }) {
    const { entities, loading, reload } = useEntities('capacitaciones', member);
    const entity = entities.find((item) => item.title === 'Programa de Capacitaciones') || null;
    const [tab, setTab] = useState<'temario' | 'expositores'>('temario');
    const [form, setForm] = useState(defaultTraining);
    const [editing, setEditing] = useState(false);
    const [message, setMessage] = useState('');
    useEffect(() => { if (entity) setForm({ temario: entity.content?.temario || defaultTraining.temario, expositores: entity.content?.expositores || defaultTraining.expositores }); }, [entity]);
    const save = async (publish: boolean) => {
        if (!member?.codigoUni) return;
        const response = await fetch('/api/content-entities', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: publish ? 'publish' : 'save', id: entity?.id, section: 'capacitaciones', title: 'Programa de Capacitaciones', content: form }) });
        const data = await response.json(); if (!response.ok || !data.success) { setMessage(data.message); return; }
        setEditing(false); setMessage(publish ? 'Capacitación publicada.' : 'Borrador guardado.'); reload();
    };
    const addRow = (key: 'temario' | 'expositores') => setForm((current) => ({ ...current, [key]: [...current[key], key === 'temario' ? { modulo: '', duracion: '' } : { nombre: '', cargo: '' }] }));
    return <ModalWrapper onClose={onClose}><ModalHeader title="Programa de Capacitaciones" subtitle="Edita el contenido con casillas, sin código" onClose={onClose} />
        <div className="mb-5 flex border-b border-white/10">{(['temario', 'expositores'] as const).map((value) => <button key={value} onClick={() => setTab(value)} className={`px-4 py-2 text-sm ${tab === value ? 'border-b-2 border-electric-orange text-electric-orange' : 'text-gray-500'}`}>{value === 'temario' ? 'Temario' : 'Expositores'}</button>)}</div>
        {tab === 'temario' ? <div className="space-y-2">{form.temario.map((item, index) => <div key={index} className="flex gap-2"><input value={item.modulo} disabled={!editing} onChange={(e) => setForm((c) => ({ ...c, temario: c.temario.map((row, i) => i === index ? { ...row, modulo: e.target.value } : row) }))} placeholder="Módulo" className={`${fieldClass} flex-1`} /><input value={item.duracion} disabled={!editing} onChange={(e) => setForm((c) => ({ ...c, temario: c.temario.map((row, i) => i === index ? { ...row, duracion: e.target.value } : row) }))} placeholder="Duración" className={`${fieldClass} w-24`} />{editing && <button onClick={() => setForm((c) => ({ ...c, temario: c.temario.filter((_, i) => i !== index) }))} className="text-red-400"><Trash2 className="h-4 w-4" /></button>}</div>)}</div> : <div className="space-y-2">{form.expositores.map((item, index) => <div key={index} className="flex gap-2"><input value={item.nombre} disabled={!editing} onChange={(e) => setForm((c) => ({ ...c, expositores: c.expositores.map((row, i) => i === index ? { ...row, nombre: e.target.value } : row) }))} placeholder="Nombre" className={`${fieldClass} flex-1`} /><input value={item.cargo} disabled={!editing} onChange={(e) => setForm((c) => ({ ...c, expositores: c.expositores.map((row, i) => i === index ? { ...row, cargo: e.target.value } : row) }))} placeholder="Cargo" className={`${fieldClass} flex-1`} />{editing && <button onClick={() => setForm((c) => ({ ...c, expositores: c.expositores.filter((_, i) => i !== index) }))} className="text-red-400"><Trash2 className="h-4 w-4" /></button>}</div>)}</div>}
        {member && <div className="mt-5 flex flex-wrap gap-2">{editing ? <><button onClick={() => addRow(tab)} className="rounded-lg border border-white/10 px-3 py-2 text-sm text-gray-300"><Plus className="mr-1 inline h-4 w-4" />Agregar fila</button><button onClick={() => save(false)} className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">Guardar borrador</button><button onClick={() => save(true)} className="rounded-lg bg-electric-orange px-3 py-2 text-sm font-semibold text-white">Publicar</button></> : <button onClick={() => setEditing(true)} className="rounded-lg border border-electric-orange/30 bg-electric-orange/10 px-3 py-2 text-sm text-electric-orange"><Pencil className="mr-1 inline h-4 w-4" />Editar capacitación</button>}</div>}
        {entity ? <EntityFiles section="capacitaciones" entity={entity} member={member} onChange={() => reload()} /> : <p className="mt-5 text-xs text-gray-500">Guarda o publica la capacitación para habilitar la carga de archivos.</p>}
        {message && <p className="mt-3 text-xs text-gray-400">{message}</p>}
    </ModalWrapper>;
}

interface BenefitsSectionProps { member?: any; onAccessRestrictedResource?: (resourceName: string) => void; }

export default function BenefitsSection({ member }: BenefitsSectionProps) {
    const [openModal, setOpenModal] = useState<string | null>(null);
    return <section id="nosotros" className="relative overflow-hidden bg-void-black py-20 md:py-32">
        <div className="container relative z-10"><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12 text-center md:mb-20"><h2 className="mb-6 text-3xl font-bold tracking-tight text-white md:text-5xl">Más que una comunidad.</h2><p className="mx-auto max-w-2xl text-lg text-gray-400">Gestionamos el presente, proyectamos el futuro.</p></motion.div>
            <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">{benefits.map((benefit, index) => <div key={benefit.id}><BenefitCard {...benefit} index={index} isOpen={openModal === benefit.id} onClick={() => setOpenModal(openModal === benefit.id ? null : benefit.id)} hasDetail /></div>)}</div>
        </div>
        <AnimatePresence>{openModal === 'eventos' && <EventosModal member={member} onClose={() => setOpenModal(null)} />}{openModal === 'capacitaciones' && <CapacitacionesModal member={member} onClose={() => setOpenModal(null)} />}</AnimatePresence>
    </section>;
}
