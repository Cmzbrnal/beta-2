import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { MEMBER_SESSION_COOKIE, readMemberSession } from '@/lib/member-session';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_FILE_SIZE = 8 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif']);
const ALLOWED_FILE_TYPES = new Set(['application/pdf', 'image/png', 'image/jpeg', 'image/webp', 'image/gif']);

function errorResponse(message: string, status = 400) {
    return NextResponse.json({ success: false, message }, { status });
}

function getErrorMessage(error: unknown, fallback: string) {
    if (error instanceof Error) return error.message;
    if (error && typeof error === 'object') {
        const details = error as { message?: string; details?: string; hint?: string; code?: string };
        return [details.message, details.details, details.hint, details.code ? `Código: ${details.code}` : '']
            .filter(Boolean)
            .join(' — ') || fallback;
    }
    return fallback;
}

function getMember(request: NextRequest) {
    return readMemberSession(request.cookies.get(MEMBER_SESSION_COOKIE)?.value);
}

function cleanPathPart(value: string) {
    return value.trim().replace(/[^a-zA-Z0-9._-]+/g, '-').slice(0, 80) || 'project';
}

export async function GET(request: NextRequest) {
    try {
        const supabase = getSupabaseAdmin();
        const member = getMember(request);
        const query = supabase
            .from('projects')
            .select('id, title, description, image_url, content, status, created_at, updated_at')
            .order('created_at', { ascending: true });

        const { data, error } = member
            ? await query
            : await query.eq('status', 'published');

        if (error) throw error;
        const projects = await Promise.all((data || []).map(async (project) => {
            const files = await supabase
                .from('content_files')
                .select('id, name, mime_type, public_url')
                .eq('project', project.id)
                .order('created_at', { ascending: false });
            if (files.error) throw files.error;
            return {
                ...project,
                files: (files.data || []).map((file) => ({
                    id: file.id,
                    name: file.name,
                    mimeType: file.mime_type,
                    url: file.public_url
                }))
            };
        }));
        return NextResponse.json({ success: true, projects });
    } catch (error) {
        console.error('Error consultando proyectos:', error);
        return errorResponse(getErrorMessage(error, 'No se pudieron cargar los proyectos.'), 502);
    }
}

export async function POST(request: NextRequest) {
    const member = getMember(request);
    if (!member) return errorResponse('Debes iniciar sesión como miembro.', 401);

    try {
        const supabase = getSupabaseAdmin();
        const body = await request.json();
        const action = String(body.action || '');

        if (action === 'uploadImage') {
            const mimeType = String(body.mimeType || '');
            const fileName = String(body.fileName || '');
            const base64 = String(body.base64 || '');
            if (!fileName || !base64 || !ALLOWED_IMAGE_TYPES.has(mimeType)) {
                return errorResponse('Selecciona una imagen PNG, JPG, WEBP o GIF.');
            }

            const buffer = Buffer.from(base64, 'base64');
            if (buffer.byteLength > MAX_IMAGE_SIZE) return errorResponse('La imagen no puede superar 5 MB.');

            const storagePath = `projects/${member.codigoUni}/${Date.now()}-${cleanPathPart(fileName)}`;
            const upload = await supabase.storage
                .from('contenido-publico')
                .upload(storagePath, buffer, { contentType: mimeType, upsert: false });
            if (upload.error) throw upload.error;

            const { data } = supabase.storage.from('contenido-publico').getPublicUrl(storagePath);
            return NextResponse.json({ success: true, imageUrl: data.publicUrl });
        }

        if (action === 'uploadFile') {
            const projectId = String(body.projectId || '');
            const mimeType = String(body.mimeType || '');
            const fileName = String(body.fileName || '');
            const base64 = String(body.base64 || '');
            if (!projectId || !fileName || !base64 || !ALLOWED_FILE_TYPES.has(mimeType)) {
                return errorResponse('Selecciona un PDF o imagen válido.');
            }
            const buffer = Buffer.from(base64, 'base64');
            if (buffer.byteLength > MAX_FILE_SIZE) return errorResponse('El archivo no puede superar 8 MB.');
            const storagePath = `projects/${member.codigoUni}/${projectId}/${Date.now()}-${cleanPathPart(fileName)}`;
            const upload = await supabase.storage
                .from('contenido-publico')
                .upload(storagePath, buffer, { contentType: mimeType, upsert: false });
            if (upload.error) throw upload.error;
            const { data: publicUrl } = supabase.storage.from('contenido-publico').getPublicUrl(storagePath);
            const { data, error } = await supabase.from('content_files').insert({
                member_code: member.codigoUni,
                project: projectId,
                name: fileName,
                mime_type: mimeType,
                storage_path: storagePath,
                public_url: publicUrl.publicUrl
            }).select('id, name, mime_type, public_url').single();
            if (error) throw error;
            return NextResponse.json({
                success: true,
                file: { id: data.id, name: data.name, mimeType: data.mime_type, url: data.public_url }
            });
        }

        if (action === 'deleteFile') {
            const fileId = String(body.fileId || '');
            const { data: file, error: findError } = await supabase
                .from('content_files')
                .select('storage_path')
                .eq('id', fileId)
                .eq('member_code', member.codigoUni)
                .single();
            if (findError) throw findError;
            const remove = await supabase.storage.from('contenido-publico').remove([file.storage_path]);
            if (remove.error) throw remove.error;
            const { error } = await supabase.from('content_files').delete().eq('id', fileId).eq('member_code', member.codigoUni);
            if (error) throw error;
            return NextResponse.json({ success: true });
        }

        if (action === 'save' || action === 'publish' || action === 'delete') {
            const id = body.id ? String(body.id) : '';
            if (action === 'delete') {
                if (!id) return errorResponse('Falta el proyecto.');
                const { error } = await supabase.from('projects').delete().eq('id', id);
                if (error) throw error;
                return NextResponse.json({ success: true });
            }

            const title = String(body.title || '').trim();
            const description = String(body.description || '').trim();
            const imageUrl = String(body.imageUrl || '').trim();
            if (!title || !description || !imageUrl) return errorResponse('Completa título, descripción e imagen.');

            const status: 'draft' | 'published' = action === 'publish' ? 'published' : 'draft';
            const project = {
                title,
                description,
                image_url: imageUrl,
                content: {
                    contexto: String(body.contexto || '').trim(),
                    solucion: String(body.solucion || '').trim(),
                    anexos: Array.isArray(body.anexos) ? body.anexos : []
                },
                status,
                updated_at: new Date().toISOString()
            };

            let projectId = id;
            if (!projectId && action === 'publish') {
                const { data: existing, error: existingError } = await supabase
                    .from('projects')
                    .select('id')
                    .eq('title', title)
                    .eq('created_by', member.codigoUni)
                    .maybeSingle();
                if (existingError) throw existingError;
                projectId = existing?.id || '';
            }
            const query = projectId
                ? supabase.from('projects').update(project).eq('id', projectId)
                : supabase.from('projects').insert({ ...project, created_by: member.codigoUni });
            const { data, error } = await query.select('id, title, description, image_url, content, status, created_at, updated_at').single();
            if (error) throw error;
            if (action === 'publish') {
                const { error: filesError } = await supabase
                    .from('content_files')
                    .update({ project: data.id })
                    .eq('member_code', member.codigoUni)
                    .eq('project', title);
                if (filesError) throw filesError;
            }
            return NextResponse.json({ success: true, project: data });
        }

        return errorResponse('Acción no reconocida.');
    } catch (error) {
        console.error('Error guardando proyecto:', error);
        return errorResponse(getErrorMessage(error, 'No se pudo guardar el proyecto.'), 502);
    }
}