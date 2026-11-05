import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin, SUPABASE_CONTENT_BUCKET } from '@/lib/supabase-admin';

const MAX_FILE_SIZE = 3 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set([
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/webp',
    'image/gif'
]);

function jsonError(message: string, status = 502) {
    return NextResponse.json({ success: false, message }, { status });
}

function cleanPathPart(value: string) {
    return value.trim().replace(/[^a-zA-Z0-9._-]+/g, '-').slice(0, 80) || 'general';
}

export async function GET(request: NextRequest) {
    try {
        const supabase = getSupabaseAdmin();
        const params = request.nextUrl.searchParams;
        const sheet = params.get('sheet') || 'Contenido';
        const memberCode = (params.get('memberCode') || '').trim().toUpperCase();
        const project = params.get('project') || '';

        if (!memberCode) return jsonError('Falta el código del miembro.', 400);

        if (sheet === 'Archivos') {
            const { data, error } = await supabase
                .from('content_files')
                .select('id, name, mime_type, public_url')
                .eq('member_code', memberCode)
                .eq('project', project)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return NextResponse.json({
                success: true,
                files: (data || []).map((file) => ({
                    id: file.id,
                    name: file.name,
                    mimeType: file.mime_type,
                    url: file.public_url
                }))
            });
        }

        const { data, error } = await supabase
            .from('content_entries')
            .select('content')
            .eq('member_code', memberCode)
            .eq('project', project)
            .maybeSingle();

        if (error) throw error;
        return NextResponse.json({ success: true, content: data?.content || {} });
    } catch (error) {
        console.error('Error consultando contenido en Supabase:', error);
        return jsonError(error instanceof Error ? error.message : 'Error consultando contenido.');
    }
}

export async function POST(request: NextRequest) {
    try {
        const supabase = getSupabaseAdmin();
        const body = await request.json();
        const memberCode = String(body.memberCode || '').trim().toUpperCase();

        if (!memberCode) return jsonError('Falta el código del miembro.', 400);

        if (body.action === 'saveContent' || body.action === 'deleteContent') {
            const project = String(body.project || '').trim();
            if (!project) return jsonError('Falta el proyecto.', 400);

            if (body.action === 'deleteContent') {
                const { error } = await supabase
                    .from('content_entries')
                    .delete()
                    .eq('member_code', memberCode)
                    .eq('project', project);
                if (error) throw error;
                return NextResponse.json({ success: true });
            }

            const { data, error } = await supabase
                .from('content_entries')
                .upsert(
                    {
                        member_code: memberCode,
                        project,
                        content: body.content || {},
                        updated_at: new Date().toISOString()
                    },
                    { onConflict: 'member_code,project' }
                )
                .select('content')
                .single();

            if (error) throw error;
            return NextResponse.json({ success: true, content: data.content });
        }

        if (body.action === 'uploadFile') {
            const mimeType = String(body.mimeType || '');
            const fileName = String(body.fileName || '');
            const project = String(body.project || '').trim();
            const base64 = String(body.base64 || '');

            if (!project || !fileName || !base64) return jsonError('Faltan datos del archivo.', 400);
            if (!ALLOWED_MIME_TYPES.has(mimeType)) return jsonError('Tipo de archivo no permitido.', 400);

            const buffer = Buffer.from(base64, 'base64');
            if (buffer.byteLength > MAX_FILE_SIZE) return jsonError('El archivo no puede superar 3 MB.', 400);

            const storagePath = `${cleanPathPart(memberCode)}/${cleanPathPart(project)}/${Date.now()}-${cleanPathPart(fileName)}`;
            const upload = await supabase.storage
                .from(SUPABASE_CONTENT_BUCKET)
                .upload(storagePath, buffer, { contentType: mimeType, upsert: false });
            if (upload.error) throw upload.error;

            const { data: publicUrl } = supabase.storage
                .from(SUPABASE_CONTENT_BUCKET)
                .getPublicUrl(storagePath);
            const { data, error } = await supabase
                .from('content_files')
                .insert({
                    member_code: memberCode,
                    project,
                    name: fileName,
                    mime_type: mimeType,
                    storage_path: storagePath,
                    public_url: publicUrl.publicUrl
                })
                .select('id, name, mime_type, public_url')
                .single();

            if (error) throw error;
            return NextResponse.json({
                success: true,
                file: { id: data.id, name: data.name, mimeType: data.mime_type, url: data.public_url }
            });
        }

        if (body.action === 'deleteFile') {
            const fileId = String(body.fileId || '');
            const { data: file, error: findError } = await supabase
                .from('content_files')
                .select('storage_path')
                .eq('id', fileId)
                .eq('member_code', memberCode)
                .single();
            if (findError) throw findError;

            const remove = await supabase.storage
                .from(SUPABASE_CONTENT_BUCKET)
                .remove([file.storage_path]);
            if (remove.error) throw remove.error;

            const { error } = await supabase
                .from('content_files')
                .delete()
                .eq('id', fileId)
                .eq('member_code', memberCode);
            if (error) throw error;
            return NextResponse.json({ success: true });
        }

        return jsonError('Acción no reconocida.', 400);
    } catch (error) {
        console.error('Error guardando contenido en Supabase:', error);
        return jsonError(error instanceof Error ? error.message : 'Error guardando contenido.');
    }
}
