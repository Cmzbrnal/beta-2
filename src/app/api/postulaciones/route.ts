import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const DATA_FILE = path.join(DATA_DIR, 'postulaciones.json');
const DIRECTIVA_KEY = process.env.CIPRO_DIRECTIVA_KEY;

function getGoogleWebhook() {
    return process.env.GOOGLE_SHEETS_WEBHOOK || process.env.GOOGLE_SHEETS_WEBHOOK_URL;
}

function getValidGoogleWebhook() {
    const webhook = getGoogleWebhook()?.trim();
    if (!webhook) {
        return null;
    }

    try {
        const url = new URL(webhook);
        return url.protocol === 'https:' ? url.toString() : null;
    } catch {
        return null;
    }
}

function ensureDataFile() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { nombres, codigoUni, correo, whatsapp, carrera, ciclo } = body;
        const values = [nombres, codigoUni, correo, whatsapp, carrera, ciclo];

        if (values.some((value) => typeof value !== 'string' || !value.trim())) {
            return NextResponse.json(
                { success: false, message: 'Todos los campos son obligatorios' },
                { status: 400 }
            );
        }

        const normalizedEmail = correo.trim().toLowerCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
            return NextResponse.json(
                { success: false, message: 'Ingresa un correo electrónico válido' },
                { status: 400 }
            );
        }

        const now = new Date();
        const nuevaPostulacion = {
            id: `POST-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            fecha: now.toLocaleDateString('es-PE', { year: 'numeric', month: '2-digit', day: '2-digit' }),
            hora: now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            codigoUni: String(codigoUni).trim().toUpperCase(),
            nombres: nombres.trim(),
            correo: normalizedEmail,
            whatsapp: whatsapp.trim(),
            carrera: carrera.trim(),
            ciclo: ciclo.trim(),
            estado: 'Postulación'
        };

        const googleWebhook = getValidGoogleWebhook();
        if (!googleWebhook) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'No se pudo registrar la postulación: configura GOOGLE_SHEETS_WEBHOOK con una URL /exec válida.'
                },
                { status: 503 }
            );
        }

        try {
            const webhookResponse = await fetch(googleWebhook, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body: JSON.stringify({ sheet: 'Postulaciones', data: nuevaPostulacion }),
                cache: 'no-store',
                redirect: 'follow',
                signal: AbortSignal.timeout(10000)
            });
            const responseText = await webhookResponse.text();
            let webhookBody: {
                success?: boolean;
                error?: string;
                message?: string;
            } | null = null;

            try {
                webhookBody = JSON.parse(responseText);
            } catch {
                throw new Error(
                    `Google Sheets respondió ${webhookResponse.status} con una respuesta no JSON`
                );
            }

            if (!webhookResponse.ok || webhookBody?.success !== true) {
                throw new Error(
                    `Google Sheets respondió ${webhookResponse.status}: ${
                        webhookBody?.error || webhookBody?.message || 'respuesta no válida'
                    }`
                );
            }
        } catch (webhookError) {
            console.error('Error al sincronizar con Google Sheets:', webhookError);
            return NextResponse.json(
                {
                    success: false,
                    message: 'No se pudo registrar la postulación en Google Sheets. Verifica la implementación de Apps Script.'
                },
                { status: 502 }
            );
        }

        try {
            ensureDataFile();
            const postulaciones = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8') || '[]');
            postulaciones.push(nuevaPostulacion);
            fs.writeFileSync(DATA_FILE, JSON.stringify(postulaciones, null, 2), 'utf-8');
        } catch (localError) {
            console.warn('Postulación sincronizada en Google Sheets, pero no se pudo guardar el respaldo local:', localError);
        }

        return NextResponse.json({
            success: true,
            message: 'Postulación registrada exitosamente',
            id: nuevaPostulacion.id
        });
    } catch (error) {
        console.error('Error en API postulaciones:', error);
        return NextResponse.json(
            { success: false, message: 'Error interno del servidor al procesar la postulación' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');
        const keyParam = request.nextUrl.searchParams.get('key');
        const isAuthorized = Boolean(DIRECTIVA_KEY) && (
            keyParam === DIRECTIVA_KEY ||
            authHeader === 'Bearer ' + DIRECTIVA_KEY
        );

        if (!isAuthorized) {
            return NextResponse.json(
                { success: false, message: 'Acceso denegado. Información reservada exclusivamente para la Directiva de CIPRO.' },
                { status: 403 }
            );
        }

        const googleWebhook = getValidGoogleWebhook();
        if (googleWebhook) {
            try {
                const sheetResponse = await fetch(
                    `${googleWebhook}?sheet=Postulaciones`,
                    { cache: 'no-store', signal: AbortSignal.timeout(10000) }
                );
                const sheetData = await sheetResponse.json().catch(() => null);

                if (!sheetResponse.ok || sheetData?.success !== true) {
                    throw new Error(sheetData?.error || 'Respuesta no válida de Google Sheets');
                }

                return NextResponse.json({
                    success: true,
                    total: sheetData.total,
                    postulaciones: sheetData.postulaciones,
                    source: 'google-sheets'
                });
            } catch (sheetError) {
                console.error('Error consultando postulaciones en Google Sheets:', sheetError);
            }
        }

        ensureDataFile();
        const postulaciones = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8') || '[]');
        return NextResponse.json({
            success: true,
            total: postulaciones.length,
            postulaciones,
            source: 'local-backup'
        });
    } catch (error) {
        console.error('Error al consultar postulaciones:', error);
        return NextResponse.json(
            { success: false, message: 'Error al consultar postulaciones' },
            { status: 500 }
        );
    }
}
