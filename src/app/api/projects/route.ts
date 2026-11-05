import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { MEMBER_SESSION_COOKIE, readMemberSession } from '@/lib/member-session';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif']);

function errorResponse(message: string, status = 400) {
    return NextResponse.json({ success: false, message }, { status });
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
        return NextResponse.json({ success: true, projects: data || [] });
    } catch (error) {
        console.error('Error consultando proyectos:', error);
        return errorResponse(error instanceof Error ? error.message : 'No se pudieron cargar los proyectos.', 502);
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

            const query = id
                ? supabase.from('projects').update(project).eq('id', id)
                : supabase.from('projects').insert({ ...project, created_by: member.codigoUni });
            const { data, error } = await query.select('id, title, description, image_url, content, status, created_at, updated_at').single();
            if (error) throw error;
            return NextResponse.json({ success: true, project: data });
        }

        return errorResponse('Acción no reconocida.');
    } catch (error) {
        console.error('Error guardando proyecto:', error);
        return errorResponse(error instanceof Error ? error.message : 'No se pudo guardar el proyecto.', 502);
    }
}
