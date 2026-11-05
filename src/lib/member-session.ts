import crypto from 'crypto';

export const MEMBER_SESSION_COOKIE = 'cipro_member_session';

type MemberSession = {
    codigoUni: string;
    nombres: string;
    carrera: string;
    ciclo: string;
    estado: string;
};

function getSessionSecret() {
    return process.env.CIPRO_SESSION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
}

function sign(payload: string) {
    return crypto.createHmac('sha256', getSessionSecret()).update(payload).digest('base64url');
}

export function createMemberSession(member: MemberSession) {
    const payload = Buffer.from(JSON.stringify({
        member,
        expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7
    })).toString('base64url');
    return `${payload}.${sign(payload)}`;
}

export function readMemberSession(value?: string): MemberSession | null {
    if (!value || !getSessionSecret()) return null;
    const [payload, signature] = value.split('.');
    if (!payload || !signature || sign(payload) !== signature) return null;

    try {
        const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
        if (parsed.expiresAt < Date.now()) return null;
        return parsed.member as MemberSession;
    } catch {
        return null;
    }
}
