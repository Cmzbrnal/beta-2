import { NextRequest, NextResponse } from 'next/server';

const DIRECTIVA_KEY = process.env.CIPRO_DIRECTIVA_KEY || 'directiva_cipro_2026';

function getWebhookUrl() {
    return process.env.GOOGLE_SHEETS_WEBHOOK || process.env.GOOGLE_SHEETS_WEBHOOK_URL;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { nombres, codigoUni, correo, whatsapp, carrera, ciclo } = body;

        if (!nombres || !codigoUni || !correo || !whatsapp || !carrera || !ciclo) {
            return NextResponse.json(
                { success: false, message: 'Todos los campos son obligatorios' },
                { status: 400 }
            );
        }

        const now = new Date();
        const nuevaPostulacion = {
            id: `POST-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            fecha: now.toLocaleDateString('es-PE', { year: 'numeric', month: '2-digit', day: '2-digit' }),
            hora: now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            codigoUni: String(codigoUni).trim().toUpperCase(),
            nombres: String(nombres).trim(),
            correo: String(correo).trim().toLowerCase(),
            whatsapp: String(whatsapp).trim(),
            carrera: String(carrera).trim(),
            ciclo: String(ciclo).trim(),
            estado: 'Postulación'
        };

        const googleWebhook = getWebhookUrl();
        if (!googleWebhook) {
            return NextResponse.json(
                { success: false, message: 'Google Sheets no está configurado en Vercel.' },
                { status: 503 }
            );
        }

        const webhookResponse = await fetch(googleWebhook, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sheet: 'Postulaciones', data: nuevaPostulacion }),
            cache: 'no-store',
            signal: AbortSignal.timeout(10000)
        });
        const webhookBody = await webhookResponse.json().catch(() => null);

        if (!webhookResponse.ok || webhookBody?.success !== true) {
            console.error('Google Sheets rechazó la postulación:', webhookBody);
            return NextResponse.json(
                { success: false, message: 'Google Sheets rechazó la postulación.' },
                { status: 502 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Postulación registrada exitosamente',
            id: nuevaPostulacion.id
        });
    } catch (error) {
        console.error('Error en API postulaciones:', error);
        return NextResponse.json(
            { success: false, message: 'No se pudo conectar con Google Sheets.' },
            { status: 502 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');
        const keyParam = request.nextUrl.searchParams.get('key');
        const isAuthorized =
            keyParam === DIRECTIVA_KEY ||
            authHeader === `Bearer ${DIRECTIVA_KEY}`;

        if (!isAuthorized) {
            return NextResponse.json(
                { success: false, message: 'Acceso denegado.' },
                { status: 403 }
            );
        }

        const googleWebhook = getWebhookUrl();
        if (!googleWebhook) {
            return NextResponse.json(
                { success: false, message: 'Google Sheets no está configurado.' },
                { status: 503 }
            );
        }

        const sheetResponse = await fetch(`${googleWebhook}?sheet=Postulaciones`, {
            cache: 'no-store',
            signal: AbortSignal.timeout(10000)
        });
        const sheetData = await sheetResponse.json().catch(() => null);

        if (!sheetResponse.ok || sheetData?.success !== true) {
            throw new Error(sheetData?.error || 'No se pudieron consultar las postulaciones.');
        }

        return NextResponse.json(sheetData);
    } catch (error) {
        console.error('Error al consultar postulaciones:', error);
        return NextResponse.json(
            { success: false, message: 'Error al consultar postulaciones.' },
            { status: 502 }
        );
    }
}
