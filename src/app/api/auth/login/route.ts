import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'miembros.json');

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { codigoUni, password } = body;

        if (!codigoUni || !password) {
            return NextResponse.json(
                { success: false, message: 'Ingresa tu código y contraseña' },
                { status: 400 }
            );
        }

        const codigoUpper = String(codigoUni).trim().toUpperCase();

        // 1. Si existe webhook de Google Sheets, consultar la pestaña "Miembros"
        const googleWebhook = process.env.GOOGLE_SHEETS_WEBHOOK;
        if (googleWebhook) {
            try {
                const sheetRes = await fetch(`${googleWebhook}?sheet=Miembros&codigoUni=${encodeURIComponent(codigoUpper)}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });
                const sheetData = await sheetRes.json();
                if (sheetData.success && sheetData.member) {
                    if (sheetData.member.password === password) {
                        return NextResponse.json({
                            success: true,
                            member: {
                                codigoUni: sheetData.member.codigoUni,
                                nombres: sheetData.member.nombres,
                                carrera: sheetData.member.carrera,
                                ciclo: sheetData.member.ciclo,
                                estado: sheetData.member.estado || 'Miembro'
                            }
                        });
                    } else {
                        return NextResponse.json(
                            { success: false, message: 'Contraseña incorrecta' },
                            { status: 401 }
                        );
                    }
                }
            } catch (err) {
                console.warn('Google Sheets no disponible, usando base de datos local:', err);
            }
        }

        // 2. Validación con base local (miembros.json)
        if (fs.existsSync(DATA_FILE)) {
            const raw = fs.readFileSync(DATA_FILE, 'utf-8');
            const miembros = JSON.parse(raw || '[]');

            const miembro = miembros.find(
                (m: any) => String(m.codigoUni).trim().toUpperCase() === codigoUpper
            );

            if (miembro && miembro.password === password) {
                return NextResponse.json({
                    success: true,
                    member: {
                        codigoUni: miembro.codigoUni,
                        nombres: miembro.nombres,
                        carrera: miembro.carrera,
                        ciclo: miembro.ciclo,
                        estado: miembro.estado || 'Miembro'
                    }
                });
            }
        }

        return NextResponse.json(
            { success: false, message: 'Código de estudiante o contraseña incorrectos' },
            { status: 401 }
        );
    } catch (error: any) {
        console.error('Error en login de miembros:', error);
        return NextResponse.json(
            { success: false, message: 'Error en el servidor al autenticar' },
            { status: 500 }
        );
    }
}
