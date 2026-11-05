'use client';

import React, { useEffect, useRef, useState } from 'react';
import { FileText, Image as ImageIcon, Save, Upload } from 'lucide-react';

type Section = 'biblioteca' | 'eventos' | 'capacitaciones';

type EntityFile = {
    id: string;
    name: string;
    url: string;
    mimeType: string;
};

type Entity = {
    id: string;
    title: string;
    description: string;
    content: Record<string, unknown>;
    status: 'draft' | 'published';
    files: EntityFile[];
};

export default function SectionContentFiles({
    section,
    title,
    member,
}: {
    section: Section;
    title: string;
    member?: { codigoUni: string };
}) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [entity, setEntity] = useState<Entity | null>(null);
    const [description, setDescription] = useState('');
    const [files, setFiles] = useState<EntityFile[]>([]);
    const [message, setMessage] = useState('');
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        fetch(`/api/content-entities?section=${section}&status=${member ? 'all' : 'published'}`)
            .then((response) => response.json())
            .then((data) => {
                if (!data.success) throw new Error(data.message);
                const current = data.entities?.find((item: Entity) => item.title === title) || data.entities?.[0];
                if (current) {
                    setEntity(current);
                    setDescription(current.description || '');
                    setFiles(current.files || []);
                }
            })
            .catch((error) => setMessage(error instanceof Error ? error.message : 'No se pudo cargar el contenido.'));
    }, [member, section, title]);

    const ensureEntity = async () => {
        if (entity) return entity;
        if (!member?.codigoUni) throw new Error('Debes iniciar sesión como miembro.');
        const response = await fetch('/api/content-entities', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'save',
                section,
                title,
                description,
                content: {},
            }),
        });
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data.message);
        const created = { ...data.entity, files: [] } as Entity;
        setEntity(created);
        return created;
    };

    const saveDescription = async () => {
        setBusy(true);
        setMessage('');
        try {
            const current = await ensureEntity();
            const response = await fetch('/api/content-entities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: current.status === 'published' ? 'publish' : 'save',
                    id: current.id,
                    section,
                    title,
                    description,
                    content: current.content,
                }),
            });
            const data = await response.json();
            if (!response.ok || !data.success) throw new Error(data.message);
            setEntity((value) => value ? { ...value, description } : value);
            setMessage('Contenido guardado.');
        } catch (error) {
            setMessage(error instanceof Error ? error.message : 'No se pudo guardar el contenido.');
        } finally {
            setBusy(false);
        }
    };

    const uploadFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        event.target.value = '';
        if (!file) return;
        if (!member?.codigoUni) {
            setMessage('Debes iniciar sesión como miembro.');
            return;
        }
        const allowed = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp', 'image/gif'];
        if (!allowed.includes(file.type) || file.size > 8 * 1024 * 1024) {
            setMessage('Usa PDF, PNG, JPG, WEBP o GIF de máximo 8 MB.');
            return;
        }

        setBusy(true);
        setMessage('');
        try {
            const current = await ensureEntity();
            const base64 = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
                reader.onerror = () => reject(new Error('No se pudo leer el archivo.'));
                reader.readAsDataURL(file);
            });
            const response = await fetch('/api/content-entities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'uploadFile',
                    section,
                    entityId: current.id,
                    fileName: file.name,
                    mimeType: file.type,
                    base64,
                }),
            });
            const data = await response.json();
            if (!response.ok || !data.success) throw new Error(data.message);
            setFiles((currentFiles) => [...currentFiles, data.file]);
            setMessage('Archivo cargado.');
        } catch (error) {
            setMessage(error instanceof Error ? error.message : 'No se pudo cargar el archivo.');
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="mt-6 border-t border-white/10 pt-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-500">Contenido de esta sección</p>
            {member && (
                <>
                    <textarea
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        rows={3}
                        placeholder="Escribe aquí la información de esta sección..."
                        className="w-full resize-none rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-white placeholder-gray-600 outline-none focus:border-electric-orange/50"
                    />
                    <div className="mt-3 flex flex-wrap gap-2">
                        <button onClick={saveDescription} disabled={busy} className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300 disabled:opacity-50">
                            <Save className="h-4 w-4" /> Guardar contenido
                        </button>
                        <input ref={inputRef} type="file" accept=".pdf,image/png,image/jpeg,image/webp,image/gif" onChange={uploadFile} className="hidden" />
                        <button onClick={() => inputRef.current?.click()} disabled={busy} className="flex items-center gap-2 rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-sm text-blue-300 disabled:opacity-50">
                            <Upload className="h-4 w-4" /> Subir PDF o imagen
                        </button>
                    </div>
                </>
            )}
            {files.length > 0 && (
                <div className="mt-3 space-y-2">
                    {files.map((file) => (
                        <a key={file.id} href={file.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-lg border border-blue-500/20 bg-blue-500/5 p-2 text-sm text-blue-300 hover:underline">
                            {file.mimeType.startsWith('image/') ? <ImageIcon className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                            <span className="truncate">{file.name}</span>
                        </a>
                    ))}
                </div>
            )}
            {message && <p className="mt-2 text-xs text-gray-400">{message}</p>}
        </div>
    );
}
