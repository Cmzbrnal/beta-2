import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { MEMBER_SESSION_COOKIE, readMemberSession } from '@/lib/member-session';

const SECTIONS = new Set(['biblioteca', 'eventos', 'capacitaciones', 'pmo', 'metodologias', 'documentacion']);
type Section = 'biblioteca' | 'eventos' | 'capacitaciones' | 'pmo' | 'metodologias' | 'documentacion';

const fallbackSpaces = [
    { id: 'biblioteca', space_key: 'biblioteca', section: 'biblioteca', title: 'Biblioteca de Recursos', description: 'Templates, guías y documentos esenciales para gestión de proyectos.', display_order: 1, is_default: true },
    { id: 'metodologias', space_key: 'metodologias', section: 'metodologias', title: 'Metodologías Ágiles', description: 'Scrum, Kanban, SAFe y más para proyectos de transformación.', display_order: 2, is_default: true },
    { id: 'riesgos', space_key: 'riesgos', section: 'documentacion', title: 'Gestión de Riesgos', description: 'Matrices, planes de contingencia y registro de issues.', display_order: 3, is_default: true },
    { id: 'kpis', space_key: 'kpis', section: 'documentacion', title: 'KPIs & Métricas', description: 'Dashboards y OKRs para medir el rendimiento de tus proyectos.', display_order: 4, is_default: true },
    { id: 'pmo', space_key: 'pmo', section: 'pmo', title: 'PMO Setup', description: 'Estructura tu oficina de proyectos desde cero.', display_order: 5, is_default: true },
    { id: 'documentacion', space_key: 'documentacion', section: 'documentacion', title: 'Documentación', description: 'Charters, planes, reportes y plantillas profesionales.', display_order: 6, is_default: true },
];

function errorResponse(message: string, status = 400) {
    return NextResponse.json({ success: false, message }, { status });
}

function memberFromRequest(request: NextRequest) {
    return readMemberSession(request.cookies.get(MEMBER_SESSION_COOKIE)?.value);
}

export async function GET() {
    try {
        const { data, error } = await getSupabaseAdmin()
            .from('content_spaces')
            .select('id, space_key, section, title, description, display_order, is_default')
            .order('display_order', { ascending: true })
            .order('created_at', { ascending: true });
        if (error) {
            if (error.code === '42P01') return NextResponse.json({ success: true, spaces: fallbackSpaces });
            throw error;
        }
        return NextResponse.json({ success: true, spaces: data?.length ? data : fallbackSpaces });
    } catch (error) {
        console.error('Error consultando espacios:', error);
        return errorResponse('No se pudieron cargar los espacios.', 502);
    }
}

export async function POST(request: NextRequest) {
    const member = memberFromRequest(request);
    if (!member) return errorResponse('Debes iniciar sesión como miembro.', 401);

    try {
        const body = await request.json();
        const action = String(body.action || '');
        const supabase = getSupabaseAdmin();
        if (action === 'delete') {
            const id = String(body.id || '');
            if (!id) return errorResponse('Falta el espacio que deseas eliminar.');
            const { error } = await supabase.from('content_spaces').delete().eq('id', id).eq('is_default', false).eq('created_by', member.codigoUni);
            if (error) throw error;
            return NextResponse.json({ success: true });
        }

        if (action !== 'save') return errorResponse('Acción no reconocida.');
        const title = String(body.title || '').trim().replace(/\s+/g, ' ');
        const description = String(body.description || '').trim();
        const section = String(body.section || '');
        if (!title || title.length > 100) return errorResponse('Indica un título válido de máximo 100 caracteres.');
        if (!SECTIONS.has(section)) return errorResponse('Sección inválida.');
        const id = String(body.id || '');
        const values = {
            title,
            description,
            section: section as Section,
            updated_at: new Date().toISOString(),
        };
        if (id) {
            const { data, error } = await supabase.from('content_spaces').update(values).eq('id', id).select('id, space_key, section, title, description, display_order, is_default').single();
            if (error) throw error;
            return NextResponse.json({ success: true, space: data });
        }
        const spaceKey = `custom-${member.codigoUni}-${Date.now()}`;
        const { data, error } = await supabase.from('content_spaces').insert({
            ...values,
            space_key: spaceKey,
            display_order: 99,
            is_default: false,
            created_by: member.codigoUni,
        }).select('id, space_key, section, title, description, display_order, is_default').single();
        if (error) throw error;
        return NextResponse.json({ success: true, space: data });
    } catch (error) {
        console.error('Error guardando espacio:', error);
        return errorResponse('No se pudo guardar el espacio.', 502);
    }
}
