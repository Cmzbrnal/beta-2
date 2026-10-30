'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, X, KeyRound, CheckCircle2, AlertCircle, Loader2, BookOpen, GraduationCap, FileText, LogOut, Info } from 'lucide-react';

interface MemberData {
    codigoUni: string;
    nombres: string;
    carrera: string;
    ciclo: string;
    estado: string;
}

interface LoginMiembrosModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentMember: MemberData | null;
    onLoginSuccess: (member: MemberData) => void;
    onLogout: () => void;
    noticeTitle?: string;
    noticeMessage?: string;
}

export default function LoginMiembrosModal({
    isOpen,
    onClose,
    currentMember,
    onLoginSuccess,
    onLogout,
    noticeTitle,
    noticeMessage
}: LoginMiembrosModalProps) {
    const [codigoUni, setCodigoUni] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!codigoUni || !password) {
            setError('Ingresa tu código y contraseña');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ codigoUni, password })
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || 'Credenciales inválidas');
            }

            onLoginSuccess(data.member);
            setPassword('');
        } catch (err: any) {
            setError(err.message || 'Error al autenticar');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
                    />

                    {/* Modal Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
                        className="relative w-full max-w-md bg-[#0B0F17] border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(255,85,0,0.15)] overflow-hidden z-10 my-auto"
                    >
                        {/* Glow superior naranja */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-[#FF5500] to-transparent" />

                        {/* Cabecera */}
                        <div className="flex items-start justify-between p-6 pb-4 border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-[#FF5500]/15 border border-[#FF5500]/30 text-[#FF5500] shadow-[0_0_15px_rgba(255,85,0,0.2)]">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white tracking-tight">
                                        {currentMember ? 'Área Exclusiva de Miembros' : (noticeTitle || 'Acceso Miembros CIPRO')}
                                    </h3>
                                    <p className="text-xs text-gray-400">
                                        {currentMember
                                            ? 'Recursos y material exclusivo para miembros'
                                            : 'Ingresa con tu código y contraseña de miembro'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                                aria-label="Cerrar modal"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Contenido */}
                        <div className="p-6">
                            {/* Banner de Aviso de Restricción si vino por hacer clic en recurso protegido */}
                            {!currentMember && noticeMessage && (
                                <div className="mb-5 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2.5 text-xs text-amber-200">
                                    <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                    <div className="leading-relaxed">
                                        <strong className="block text-amber-300 font-semibold mb-0.5">Acceso Restringido</strong>
                                        {noticeMessage}
                                    </div>
                                </div>
                            )}

                            {currentMember ? (
                                /* Vista de Miembro Autenticado */
                                <div className="space-y-5">
                                    {/* Perfil del Miembro */}
                                    <div className="p-4 rounded-xl bg-[#131926] border border-white/10 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-400">Estado de Membresía</span>
                                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                ● Miembro Activo
                                            </span>
                                        </div>
                                        <div className="text-base font-bold text-white">
                                            {currentMember.nombres}
                                        </div>
                                        <div className="text-xs text-gray-400 flex flex-wrap gap-x-3 gap-y-1">
                                            <span>Código: <strong className="text-gray-200">{currentMember.codigoUni}</strong></span>
                                            <span>Carrera: <strong className="text-gray-200">{currentMember.carrera}</strong></span>
                                        </div>
                                    </div>

                                    {/* Material Exclusivo al que tiene acceso */}
                                    <div className="space-y-2">
                                        <div className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                                            Material Desbloqueado para Ti
                                        </div>
                                        <div className="grid grid-cols-1 gap-2">
                                            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-[#FF5500]/30 transition-colors">
                                                <div className="p-2 rounded-lg bg-[#FF5500]/10 text-[#FF5500]">
                                                    <BookOpen className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <div className="text-xs font-bold text-white">Biblioteca PMO & Libros PMBOK</div>
                                                    <div className="text-[11px] text-gray-400">Plantillas, guías y formatos entregables</div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-[#FF5500]/30 transition-colors">
                                                <div className="p-2 rounded-lg bg-[#FF5500]/10 text-[#FF5500]">
                                                    <GraduationCap className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <div className="text-xs font-bold text-white">Capacitaciones & Talleres</div>
                                                    <div className="text-[11px] text-gray-400">Scrum, EDT, IA para investigación</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                                        <button
                                            type="button"
                                            onClick={onLogout}
                                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-red-400 hover:bg-red-500/10 text-xs font-medium transition-colors"
                                        >
                                            <LogOut className="w-3.5 h-3.5" />
                                            Cerrar Sesión
                                        </button>
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="px-5 py-2 rounded-xl bg-[#FF5500] hover:bg-[#ff6a1f] text-white text-xs font-semibold transition-all shadow-[0_0_15px_rgba(255,85,0,0.3)]"
                                        >
                                            Explorar Web
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                /* Formulario de Inicio de Sesión */
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-300 mb-1.5">
                                            Código de Estudiante (UNI) <span className="text-[#FF5500]">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={codigoUni}
                                            onChange={(e) => setCodigoUni(e.target.value)}
                                            placeholder="Ej. 20233999A"
                                            className="w-full bg-[#131926]/90 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 uppercase focus:outline-none focus:border-[#FF5500] focus:ring-1 focus:ring-[#FF5500] transition-colors"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-300 mb-1.5">
                                            Contraseña de Miembro <span className="text-[#FF5500]">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full bg-[#131926]/90 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF5500] focus:ring-1 focus:ring-[#FF5500] transition-colors"
                                        />
                                    </div>

                                    {error && (
                                        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                                            <AlertCircle className="w-4 h-4 shrink-0" />
                                            <span>{error}</span>
                                        </div>
                                    )}

                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full py-2.5 rounded-xl bg-[#FF5500] hover:bg-[#ff6a1f] text-white font-semibold text-xs tracking-wide transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,85,0,0.3)] hover:shadow-[0_0_30px_rgba(255,85,0,0.5)] active:scale-95 disabled:opacity-50"
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Validando miembro...
                                                </>
                                            ) : (
                                                <>
                                                    <KeyRound className="w-4 h-4" />
                                                    Ingresar como Miembro
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    <p className="text-[11px] text-gray-500 text-center pt-2">
                                        El acceso y credenciales son otorgados por la directiva de CIPRO tras la aprobación de la postulación.
                                    </p>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
