import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin, SUPABASE_CONTENT_BUCKET } from '@/lib/supabase-admin';
import { MEMBER_SESSION_COOKIE, readMemberSession } from '@/lib/member-session';

const MAX_FILE_SIZE = 8 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set([
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/webp',
    'image/gif',
]);
const SECTIONS = new Set(['biblioteca', 'eventos', 'capacitaciones']);
type Section = 'biblioteca' | 'eventos' | 'capacitaciones';
type EntityStatus = 'draft' | 'published';

function isSection(value: string): value is Section {
    return SECTIONS.has(value);
}

function responseError(message: string, status = 400) {
    return NextResponse.json({ success: false, message }, { status });
}

function memberFromRequest(request: NextRequest) {
    return readMemberSession(request.cookies.get(MEMBER_SESSION_COOKIE)?.value);
}

function cleanPathPart(value: string) {
    return value.trim().replace(/[^a-zA-Z0-9._-]+/g, '-').slice(0, 80) || 'content';
}

function errorMessage(error: unknown) {
    if (error instanceof Error) return error.message;
    if (error && typeof error === 'object') {
        const detail = error as { message?: string; details?: string; hint?: string; code?: string };
        return [detail.message, detail.details, detail.hint, detail.code].filter(Boolean).join(' — ');
    }
    return 'No se pudo guardar el contenido.';
}

export async function GET(request: NextRequest) {
    try {
        const section = request.nextUrl.searchParams.get('section') || '';
        const statusParam = request.nextUrl.searchParams.get('status') || 'published';
        if (!isSection(section)) return responseError('Sección inválida.', 400);

        const supabase = getSupabaseAdmin();
        let query = supabase
            .from('content_entities')
            .select('id, section, title, description, content, status, created_by, created_at, updated_at')
            .eq('section', section)
            .order('created_at', { ascending: true });
        if (statusParam !== 'all') {
            const status: EntityStatus = statusParam === 'draft' ? 'draft' : 'published';
            query = query.eq('status', status);
        }

        const { data, error } = await query;
        if (error) throw error;

        const entities = await Promise.all((data || []).map(async (entity) => {
            const files = await supabase
                .from('content_entity_files')
                .select('id, name, mime_type, public_url, created_at')
                .eq('entity_id', entity.id)
                .order('created_at', { ascending: false });
            if (files.error) throw files.error;
            return {
                ...entity,
                files: (files.data || []).map((file) => ({
                    id: file.id,
                    name: file.name,
                    mimeType: file.mime_type,
                    url: file.public_url,
                })),
            };
        }));

        return NextResponse.json({ success: true, entities });
    } catch (error) {
        console.error('Error consultando entidades de contenido:', error);
        return responseError(errorMessage(error), 502);
    }
}

export async function POST(request: NextRequest) {
    const member = memberFromRequest(request);
    if (!member) return responseError('Debes iniciar sesión como miembro.', 401);

    try {
        const supabase = getSupabaseAdmin();
        const body = await request.json();
        const action = String(body.action || '');
        const section = String(body.section || '');
        if (!isSection(section)) return responseError('Sección inválida.');

        if (action === 'save' || action === 'publish') {
            const title = String(body.title || '').trim();
            if (!title) return responseError('El título es obligatorio.');
            const entity = {
                section,
                title,
                description: String(body.description || '').trim(),
                content: body.content && typeof body.content === 'object' ? body.content as Record<string, unknown> : {},
                status: (action === 'publish' ? 'published' : 'draft') as EntityStatus,
                created_by: member.codigoUni,
                updated_at: new Date().toISOString(),
            };
            const id = body.id ? String(body.id) : '';
            const query = id
                ? supabase.from('content_entities').update(entity).eq('id', id).eq('created_by', member.codigoUni)
                : supabase.from('content_entities').insert(entity);
            const { data, error } = await query
                .select('id, section, title, description, content, status, created_by, created_at, updated_at')
                .single();
            if (error) throw error;
            return NextResponse.json({ success: true, entity: data });
        }

        if (action === 'uploadFile') {
            const entityId = String(body.entityId || '');
            const fileName = String(body.fileName || '');
            const mimeType = String(body.mimeType || '');
            const base64 = String(body.base64 || '');
            if (!entityId || !fileName || !base64 || !ALLOWED_MIME_TYPES.has(mimeType)) {
                return responseError('Selecciona un PDF o imagen válido.');
            }
            const { data: ownedEntity, error: entityError } = await supabase
                .from('content_entities')
                .select('id')
                .eq('id', entityId)
                .eq('section', section)
                .eq('created_by', member.codigoUni)
                .maybeSingle();
            if (entityError) throw entityError;
            if (!ownedEntity) return responseError('No tienes permiso para modificar este contenido.', 403);

            const buffer = Buffer.from(base64, 'base64');
            if (buffer.byteLength > MAX_FILE_SIZE) return responseError('El archivo no puede superar 8 MB.');

            const storagePath = `${section}/${member.codigoUni}/${entityId}/${Date.now()}-${cleanPathPart(fileName)}`;
            const upload = await supabase.storage
                .from(SUPABASE_CONTENT_BUCKET)
                .upload(storagePath, buffer, { contentType: mimeType, upsert: false });
            if (upload.error) throw upload.error;

            const { data: publicUrl } = supabase.storage
                .from(SUPABASE_CONTENT_BUCKET)
                .getPublicUrl(storagePath);
            const { data, error } = await supabase
                .from('content_entity_files')
                .insert({
                    entity_id: entityId,
                    member_code: member.codigoUni,
                    name: fileName,
                    mime_type: mimeType,
                    storage_path: storagePath,
                    public_url: publicUrl.publicUrl,
                })
                .select('id, name, mime_type, public_url')
                .single();
            if (error) throw error;

            return NextResponse.json({
                success: true,
                file: { id: data.id, name: data.name, mimeType: data.mime_type, url: data.public_url },
            });
        }

        if (action === 'delete') {
            const id = String(body.id || '');
            if (!id) return responseError('Falta el contenido que deseas eliminar.');
            const { data: entity, error: findError } = await supabase
                .from('content_entities')
                .select('id')
                .eq('id', id)
                .eq('section', section)
                .eq('created_by', member.codigoUni)
                .maybeSingle();
            if (findError) throw findError;
            if (!entity) return responseError('No tienes permiso para eliminar este contenido.', 403);
            const { error } = await supabase
                .from('content_entities')
                .delete()
                .eq('id', id)
                .eq('created_by', member.codigoUni);
            if (error) throw error;
            return NextResponse.json({ success: true });
        }

        return responseError('Acción no reconocida.');
    } catch (error) {
        console.error('Error guardando entidad de contenido:', error);
        return responseError(errorMessage(error), 502);
    }
}
