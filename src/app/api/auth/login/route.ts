import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createMemberSession, MEMBER_SESSION_COOKIE } from '@/lib/member-session';

const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'miembros.json');

interface LocalMember {
    codigoUni: string;
    password: string;
    nombres: string;
    carrera: string;
    ciclo: string;
    estado?: string;
}

function successResponse(member: Omit<LocalMember, 'password'>) {
    const response = NextResponse.json({
        success: true,
        member: {
            codigoUni: member.codigoUni,
            nombres: member.nombres,
            carrera: member.carrera,
            ciclo: member.ciclo,
            estado: member.estado || 'Miembro'
        }
    });
    response.cookies.set(MEMBER_SESSION_COOKIE, createMemberSession({
        codigoUni: member.codigoUni,
        nombres: member.nombres,
        carrera: member.carrera,
        ciclo: member.ciclo,
        estado: member.estado || 'Miembro'
    }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7
    });
    return response;
}

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
        const googleWebhook =
            process.env.GOOGLE_SHEETS_WEBHOOK ||
            process.env.GOOGLE_SHEETS_WEBHOOK_URL;
        if (googleWebhook) {
            try {
                const sheetRes = await fetch(`${googleWebhook}?sheet=Miembros&codigoUni=${encodeURIComponent(codigoUpper)}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    cache: 'no-store',
                    signal: AbortSignal.timeout(10000)
                });
                const sheetData = await sheetRes.json();
                if (sheetData.success && sheetData.member) {
                    if (sheetData.member.password === password) {
                        return successResponse({
                            codigoUni: sheetData.member.codigoUni,
                            nombres: sheetData.member.nombres,
                            carrera: sheetData.member.carrera,
                            ciclo: sheetData.member.ciclo,
                            estado: sheetData.member.estado || 'Miembro'
                        });
                    } else {
                        return NextResponse.json(
                            { success: false, message: 'Contraseña incorrecta' },
                            { status: 401 }
                        );
                    }
                }
                if (sheetRes.ok && sheetData.success === false) {
                    return NextResponse.json(
                        { success: false, message: 'Código de estudiante o contraseña incorrectos' },
                        { status: 401 }
                    );
                }
            } catch (err) {
                console.warn('Google Sheets no disponible, usando base de datos local:', err);
            }
        }

        // 2. Validación con base local (miembros.json)
        if (fs.existsSync(DATA_FILE)) {
            const raw = fs.readFileSync(DATA_FILE, 'utf-8');
            const miembros = JSON.parse(raw || '[]') as LocalMember[];

            const miembro = miembros.find(
                (m) => m.codigoUni.trim().toUpperCase() === codigoUpper
            );

            if (miembro && miembro.password === password) {
                return successResponse(miembro);
            }
        }

        return NextResponse.json(
            { success: false, message: 'Código de estudiante o contraseña incorrectos' },
            { status: 401 }
        );
    } catch (error) {
        console.error('Error en login de miembros:', error);
        return NextResponse.json(
            { success: false, message: 'Error en el servidor al autenticar' },
            { status: 500 }
        );
    }
}
