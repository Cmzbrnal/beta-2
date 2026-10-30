import { NextRequest, NextResponse } from 'next/server';
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
        const googleWebhook = process.env.GOOGLE_SHEETS_WEBHOOK || process.env.GOOGLE_SHEETS_WEBHOOK_URL;
        if (!googleWebhook) {
            return NextResponse.json(
                { success: false, message: 'Google Sheets no está configurado.' },
                { status: 503 }
            );
        }

        try {
            const sheetRes = await fetch(`${googleWebhook}?sheet=Miembros&codigoUni=${encodeURIComponent(codigoUpper)}`, {
                cache: 'no-store',
                signal: AbortSignal.timeout(10000)
            });
            const sheetData = await sheetRes.json().catch(() => null);
            if (!sheetRes.ok) {
                throw new Error('Google Sheets no respondió correctamente.');
            }
            if (sheetData?.success && sheetData.member) {
                if (sheetData.member.password !== password) {
                    return NextResponse.json(
                        { success: false, message: 'Contraseña incorrecta' },
                        { status: 401 }
                    );
                }
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
            }
        } catch (err) {
            console.error('Error consultando Google Sheets:', err);
            return NextResponse.json(
                { success: false, message: 'No se pudo consultar la base de miembros.' },
                { status: 502 }
            );
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
