'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, X, Upload, FileText, Save, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type Project = {
    id?: string;
    title: string;
    description: string;
    image: string;
    contexto: string;
    solucion: string;
    anexos: { name: string; ext: string }[];
    files?: { id: string; name: string; url: string; mimeType: string }[];
    status?: 'draft' | 'published';
};

const defaultProjects: Project[] = [
    {
        title: "Ingeniero Locaso",
        description: "Sistema automatizado de gestión académica con IA.",
        image: "/imagenes/proyectos/ingeniero-locaso.png",
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
        image: "/imagenes/proyectos/transformacion-digital.png",
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
        image: "/imagenes/proyectos/gestion-agil.png",
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
        image: "/imagenes/proyectos/pmo-estrategica.png",
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
        image: "/imagenes/proyectos/optimizacion-procesos.png",
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
    onEdit,
    onClose,
}: {
    project: Project;
    member?: any;
    onEdit?: () => void;
    onClose: () => void;
}) {
    const [notes, setNotes] = useState({ contexto: '', solucion: '' });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [files, setFiles] = useState<{ id: string; name: string; url: string; mimeType?: string }[]>(project.files || []);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (project.id) return;
        if (!member?.codigoUni) return;
        fetch(`/api/member-content?sheet=Contenido&memberCode=${encodeURIComponent(member.codigoUni)}&project=${encodeURIComponent(project.title)}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.success && data.content) setNotes(data.content);
            })
            .catch(() => setMessage('No se pudieron cargar tus notas.'));
    }, [member?.codigoUni, project.title]);

    useEffect(() => {
        if (project.id) return;
        if (!member?.codigoUni) return;
        fetch(`/api/member-content?sheet=Archivos&memberCode=${encodeURIComponent(member.codigoUni)}&project=${encodeURIComponent(project.title)}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.success) setFiles(data.files || []);
            })
            .catch(() => setMessage('No se pudieron cargar los archivos.'));
    }, [member?.codigoUni, project.title]);

    const uploadProjectFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        event.target.value = '';
        if (!file || !member?.codigoUni) return;
        const allowed = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp', 'image/gif'];
        if (!allowed.includes(file.type) || file.size > 3 * 1024 * 1024) {
            setMessage('Usa PDF, PNG, JPG, WEBP o GIF de máximo 3 MB.');
            return;
        }
        setUploading(true);
        try {
            const base64 = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
                reader.onerror = () => reject(new Error('No se pudo leer el archivo.'));
                reader.readAsDataURL(file);
            });
            const response = await fetch(project.id ? '/api/projects' : '/api/member-content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'uploadFile',
                    projectId: project.id,
                    memberCode: member.codigoUni,
                    project: project.title,
                    fileName: file.name,
                    mimeType: file.type,
                    base64
                })
            });
            const data = await response.json();
            if (!response.ok || !data.success) throw new Error(data.message);
            setFiles((current) => [...current, data.file]);
            setMessage('Archivo subido.');
        } catch (error) {
            setMessage(error instanceof Error ? error.message : 'No se pudo subir el archivo.');
        } finally {
            setUploading(false);
        }
    };

    const deleteProjectFile = async (fileId: string) => {
        const response = await fetch(project.id ? '/api/projects' : '/api/member-content', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'deleteFile', memberCode: member.codigoUni, projectId: project.id, fileId })
        });
        const data = await response.json();
        if (response.ok && data.success) setFiles((current) => current.filter((file) => file.id !== fileId));
    };

    const saveNotes = async () => {
        if (!member?.codigoUni) return;
        setSaving(true);
        setMessage('');
        try {
            const response = await fetch('/api/member-content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'saveContent',
                    memberCode: member.codigoUni,
                    project: project.title,
                    content: notes
                })
            });
            const data = await response.json();
            if (!response.ok || !data.success) throw new Error(data.message);
            setMessage('Notas guardadas.');
        } catch (error) {
            setMessage(error instanceof Error ? error.message : 'No se pudieron guardar las notas.');
        } finally {
            setSaving(false);
        }
    };

    const clearNotes = async () => {
        setNotes({ contexto: '', solucion: '' });
        if (!member?.codigoUni) return;
        await fetch('/api/member-content', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'deleteContent',
                memberCode: member.codigoUni,
                project: project.title
            })
        });
        setMessage('Notas eliminadas.');
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="relative w-full max-w-3xl bg-[#0B0F17] border border-white/10 rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col pb-20 md:pb-0"
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
                    {member && onEdit && (
                        <button
                            onClick={onEdit}
                            className="absolute top-4 right-14 rounded-lg border border-electric-orange/30 bg-black/50 px-3 py-1.5 text-xs text-electric-orange hover:bg-electric-orange/10"
                        >
                            Editar
                        </button>
                    )}
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
                                value={notes.contexto}
                                onChange={(event) => setNotes((current) => ({ ...current, contexto: event.target.value }))}
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
                                value={notes.solucion}
                                onChange={(event) => setNotes((current) => ({ ...current, solucion: event.target.value }))}
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
                                    <span className="text-xs text-gray-500">Sin archivo</span>
                                </div>
                            ))}
                        </div>
                        {member && (
                            <div className="mt-3 flex items-center gap-2 flex-wrap">
                                <input ref={fileInputRef} type="file" accept=".pdf,image/png,image/jpeg,image/webp,image/gif" onChange={uploadProjectFile} className="hidden" />
                                <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-300 text-sm font-medium hover:bg-blue-500/20 transition-all disabled:opacity-50">
                                    <Upload className="w-4 h-4" />
                                    {uploading ? 'Subiendo...' : 'Subir archivo'}
                                </button>
                                <button onClick={saveNotes} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-all disabled:opacity-50">
                                    <Save className="w-4 h-4" />
                                    {saving ? 'Guardando...' : 'Guardar notas'}
                                </button>
                                <button onClick={clearNotes} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-all">
                                    <Trash2 className="w-4 h-4" />
                                    Borrar notas
                                </button>
                                {message && <span className="text-xs text-gray-400">{message}</span>}
                            </div>
                        )}
                        {files.map((file) => (
                            <div key={file.id} className="mt-2 flex items-center justify-between gap-3 p-3 rounded-lg border border-blue-500/20 bg-blue-500/5">
                                <a href={file.url} target="_blank" rel="noreferrer" className="text-sm text-blue-300 hover:underline truncate">{file.name}</a>
                                {member && <button onClick={() => deleteProjectFile(file.id)} className="text-xs text-red-400 hover:text-red-300">Borrar</button>}
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

function ProjectEditor({
    member,
    project,
    onSaved,
    onClose,
}: {
    member: any;
    project?: Project;
    onSaved: (project: Project) => void;
    onClose: () => void;
}) {
    const [form, setForm] = useState({
        title: project?.title || '',
        description: project?.description || '',
        imageUrl: project?.image || '',
        contexto: project?.contexto || '',
        solucion: project?.solucion || '',
    });
    const [preview, setPreview] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const imageInputRef = useRef<HTMLInputElement>(null);

    const update = (key: keyof typeof form, value: string) => {
        setForm((current) => ({ ...current, [key]: value }));
    };

    const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        event.target.value = '';
        if (!file) return;
        if (!['image/png', 'image/jpeg', 'image/webp', 'image/gif'].includes(file.type) || file.size > 5 * 1024 * 1024) {
            setMessage('Usa PNG, JPG, WEBP o GIF de máximo 5 MB.');
            return;
        }

        try {
            const base64 = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
                reader.onerror = () => reject(new Error('No se pudo leer la imagen.'));
                reader.readAsDataURL(file);
            });
            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'uploadImage', fileName: file.name, mimeType: file.type, base64 })
            });
            const data = await response.json();
            if (!response.ok || !data.success) throw new Error(data.message);
            update('imageUrl', data.imageUrl);
            setMessage('Imagen cargada.');
        } catch (error) {
            setMessage(error instanceof Error ? error.message : 'No se pudo cargar la imagen.');
        }
    };

    const save = async (publish: boolean) => {
        if (!form.title.trim() || !form.description.trim() || !form.imageUrl) {
            setMessage('Completa título, descripción e imagen.');
            return;
        }
        if (publish && !window.confirm('¿Seguro que deseas publicar este proyecto?')) return;
        setSaving(true);
        setMessage('');
        try {
            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: publish ? 'publish' : 'save',
                    id: project?.id,
                    title: form.title,
                    description: form.description,
                    imageUrl: form.imageUrl,
                    contexto: form.contexto,
                    solucion: form.solucion,
                })
            });
            const data = await response.json();
            if (!response.ok || !data.success) throw new Error(data.message);
            const saved = data.project;
            onSaved({
                id: saved.id,
                title: saved.title,
                description: saved.description,
                image: saved.image_url,
                contexto: saved.content?.contexto || '',
                solucion: saved.content?.solucion || '',
                anexos: saved.content?.anexos || [],
                status: saved.status,
            });
            setMessage(publish ? 'Proyecto publicado.' : 'Borrador guardado.');
        } catch (error) {
            setMessage(error instanceof Error ? error.message : 'No se pudo guardar el proyecto.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <motion.div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 backdrop-blur-md p-4" onClick={onClose}>
            <motion.div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0B0F17] p-6 pb-28 md:pb-6" onClick={(event) => event.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-white">{project ? 'Editar proyecto' : 'Nuevo proyecto'}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
                </div>
                {preview ? (
                    <div className="space-y-5">
                        {form.imageUrl && <img src={form.imageUrl} alt={form.title} className="w-full h-56 object-cover rounded-xl" />}
                        <h4 className="text-2xl font-bold text-white">{form.title || 'Sin título'}</h4>
                        <p className="text-gray-300">{form.description}</p>
                        <div className="rounded-xl border border-white/10 p-4"><h5 className="text-electric-orange uppercase text-sm font-bold mb-2">Contexto / Problemática</h5><p className="text-gray-300">{form.contexto}</p></div>
                        <div className="rounded-xl border border-white/10 p-4"><h5 className="text-electric-orange uppercase text-sm font-bold mb-2">Solución desarrollada</h5><p className="text-gray-300">{form.solucion}</p></div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {(['title', 'description', 'contexto', 'solucion'] as const).map((field) => (
                            <label key={field} className="block text-sm text-gray-400">
                                {field === 'title' ? 'Título' : field === 'description' ? 'Descripción corta' : field === 'contexto' ? 'Contexto / Problemática' : 'Solución desarrollada'}
                                <textarea value={form[field]} onChange={(event) => update(field, event.target.value)} rows={field === 'title' ? 1 : 4} className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 p-3 text-white outline-none focus:border-electric-orange/50" />
                            </label>
                        ))}
                        <input ref={imageInputRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={uploadImage} className="hidden" />
                        <button onClick={() => imageInputRef.current?.click()} className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">Subir imagen</button>
                        {form.imageUrl && <img src={form.imageUrl} alt="Vista previa" className="h-32 w-full rounded-lg object-cover" />}
                    </div>
                )}
                {message && <p className="mt-4 text-sm text-gray-400">{message}</p>}
                <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                    <button onClick={() => setPreview((value) => !value)} className="rounded-lg border border-white/15 px-4 py-2 text-sm text-white">{preview ? 'Volver a editar' : 'Previsualizar'}</button>
                    <button onClick={() => save(false)} disabled={saving} className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">{saving ? 'Guardando...' : 'Guardar borrador'}</button>
                    <button onClick={() => save(true)} disabled={saving} className="rounded-lg bg-electric-orange px-4 py-2 text-sm font-semibold text-white">Publicar</button>
                </div>
            </motion.div>
        </motion.div>
    );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export default function PortfolioSection({ member }: PortfolioSectionProps) {
    const [projectList, setProjectList] = useState<Project[]>(defaultProjects);
    const [centerIndex, setCenterIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [selectedProject, setSelectedProject] = useState<number | null>(null);
    const [editingProject, setEditingProject] = useState<Project | null | undefined>(undefined);
    const totalProjects = projectList.length;

    useEffect(() => {
        fetch('/api/projects')
            .then((response) => response.json())
            .then((data) => {
                if (data.success && data.projects?.length) {
                    const remoteProjects = data.projects.map((project: any) => ({
                        id: project.id,
                        title: project.title,
                        description: project.description,
                        image: project.image_url,
                        contexto: project.content?.contexto || '',
                        solucion: project.content?.solucion || '',
                        anexos: project.content?.anexos || [],
                        files: project.files || [],
                        status: project.status,
                    }));
                    setProjectList(remoteProjects);
                } else {
                    setProjectList([]);
                }
            })
            .catch(() => undefined);
    }, [member?.codigoUni]);

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
                project: projectList[actualIndex],
                actualIndex,
                offset,
            };
        });
    };

    const visibleCards = totalProjects ? getVisibleCards() : [];

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

                {projectList.length === 0 && (
                    <div className="flex min-h-[220px] items-center justify-center text-center text-gray-500">
                        Aún no hay proyectos publicados.
                    </div>
                )}

                {projectList.length > 0 && (<>
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
                    {projectList.map((_, index) => (
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
                </>)}

                {member && (
                    <div className="mt-8 flex justify-center pb-24 md:pb-8">
                        <button onClick={() => setEditingProject(null)} className="rounded-full bg-electric-orange px-5 py-2 text-sm font-semibold text-white hover:bg-orange-500">
                            + Nuevo proyecto
                        </button>
                    </div>
                )}
            </div>

            {/* Project Modal */}
            <AnimatePresence>
                {selectedProject !== null && (
                    <ProjectModal
                        key={selectedProject}
                        project={projectList[selectedProject]}
                        member={member}
                        onEdit={() => {
                            setEditingProject(projectList[selectedProject]);
                            setSelectedProject(null);
                        }}
                        onClose={() => setSelectedProject(null)}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {editingProject !== undefined && member && (
                    <ProjectEditor
                        member={member}
                        project={editingProject || undefined}
                        onClose={() => setEditingProject(undefined)}
                        onSaved={(saved) => {
                            setProjectList((current) => {
                                const index = current.findIndex((item) => item.id === saved.id);
                                if (index < 0) return [...current, saved];
                                return current.map((item, itemIndex) => itemIndex === index ? saved : item);
                            });
                            setEditingProject(undefined);
                        }}
                    />
                )}
            </AnimatePresence>
        </section>
    );
}