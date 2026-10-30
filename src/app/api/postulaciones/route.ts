import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const DATA_FILE = path.join(DATA_DIR, 'postulaciones.json');

// Clave privada para la directiva de CIPRO
const DIRECTIVA_KEY = process.env.CIPRO_DIRECTIVA_KEY || 'directiva_cipro_2026';

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

        if (!nombres || !codigoUni || !correo || !whatsapp || !carrera || !ciclo) {
            return NextResponse.json(
                { success: false, message: 'Todos los campos son obligatorios' },
                { status: 400 }
            );
        }

        ensureDataFile();

        const now = new Date();
        const fecha = now.toLocaleDateString('es-PE', { year: 'numeric', month: '2-digit', day: '2-digit' });
        const hora = now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        const nuevaPostulacion = {
            id: `POST-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            fecha,
            hora,
            codigoUni: String(codigoUni).trim().toUpperCase(),
            nombres: String(nombres).trim(),
            correo: String(correo).trim().toLowerCase(),
            whatsapp: String(whatsapp).trim(),
            carrera: String(carrera).trim(),
            ciclo: String(ciclo).trim(),
            estado: 'Postulación' // Estado solicitado: Postulación
        };

        // 1. Guardar localmente como respaldo
        const rawData = fs.readFileSync(DATA_FILE, 'utf-8');
        const postulaciones = JSON.parse(rawData || '[]');
        postulaciones.push(nuevaPostulacion);
        fs.writeFileSync(DATA_FILE, JSON.stringify(postulaciones, null, 2), 'utf-8');

        // 2. Reenvío a Google Sheets (Pestaña "Postulaciones")
        const googleWebhook = process.env.GOOGLE_SHEETS_WEBHOOK;
        if (googleWebhook) {
            try {
                await fetch(googleWebhook, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        sheet: 'Postulaciones',
                        data: nuevaPostulacion
                    })
                });
            } catch (webhookErr) {
                console.error('Error al sincronizar con Google Sheets:', webhookErr);
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Postulación registrada exitosamente',
            id: nuevaPostulacion.id
        });
    } catch (error: any) {
        console.error('Error en API postulaciones:', error);
        return NextResponse.json(
            { success: false, message: 'Error interno del servidor al procesar la postulación' },
            { status: 500 }
        );
    }
}

// Endpoint estrictamente para la DIRECTIVA (los miembros comunes no acceden aquí)
export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');
        const keyParam = request.nextUrl.searchParams.get('key');

        const isAuthorized =
            keyParam === DIRECTIVA_KEY ||
            authHeader === `Bearer ${DIRECTIVA_KEY}`;

        if (!isAuthorized) {
            return NextResponse.json(
                { success: false, message: 'Acceso denegado. Información reservada exclusivamente para la Directiva de CIPRO.' },
                { status: 403 }
            );
        }

        ensureDataFile();
        const rawData = fs.readFileSync(DATA_FILE, 'utf-8');
        const postulaciones = JSON.parse(rawData || '[]');

        return NextResponse.json({
            success: true,
            total: postulaciones.length,
            postulaciones
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: 'Error al consultar postulaciones' },
            { status: 500 }
        );
    }
}
