import { NextRequest, NextResponse } from 'next/server';

function getWebhookUrl() {
    return process.env.GOOGLE_SHEETS_WEBHOOK || process.env.GOOGLE_SHEETS_WEBHOOK_URL;
}

async function callWebhook(payload: Record<string, unknown>) {
    const webhook = getWebhookUrl();
    if (!webhook) {
        throw new Error('Google Sheets no está configurado.');
    }

    const response = await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        cache: 'no-store',
        signal: AbortSignal.timeout(20000)
    });
    const data = await response.json().catch(() => null);

    if (!response.ok || data?.success !== true) {
        throw new Error(data?.error || 'Google Sheets rechazó la operación.');
    }

    return data;
}

export async function GET(request: NextRequest) {
    try {
        const webhook = getWebhookUrl();
        if (!webhook) {
            return NextResponse.json({ success: false, message: 'Google Sheets no está configurado.' }, { status: 503 });
        }

        const params = request.nextUrl.searchParams;
        const query = new URLSearchParams({
            sheet: params.get('sheet') || 'Contenido',
            memberCode: params.get('memberCode') || '',
            project: params.get('project') || ''
        });
        const response = await fetch(`${webhook}?${query.toString()}`, {
            cache: 'no-store',
            signal: AbortSignal.timeout(10000)
        });
        const data = await response.json().catch(() => null);

        if (!response.ok || data?.success !== true) {
            throw new Error(data?.error || 'No se pudo consultar el contenido.');
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error consultando contenido de miembro:', error);
        return NextResponse.json(
            { success: false, message: error instanceof Error ? error.message : 'Error consultando contenido.' },
            { status: 502 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { memberCode, ...payload } = body;

        if (!memberCode) {
            return NextResponse.json({ success: false, message: 'Falta el código del miembro.' }, { status: 400 });
        }

        const data = await callWebhook({
            ...payload,
            memberCode: String(memberCode).trim().toUpperCase()
        });
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error guardando contenido de miembro:', error);
        return NextResponse.json(
            { success: false, message: error instanceof Error ? error.message : 'Error guardando contenido.' },
            { status: 502 }
        );
    }
}
