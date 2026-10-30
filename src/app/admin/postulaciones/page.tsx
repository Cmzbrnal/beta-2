'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Download, Search, MessageCircle, RefreshCw, KeyRound, CheckCircle, Clock } from 'lucide-react';

interface Postulacion {
    id: string;
    nombres: string;
    correo: string;
    whatsapp: string;
    carrera: string;
    ciclo: string;
    fechaRegistro: string;
    estado: string;
}

export default function AdminPostulaciones() {
    const [accessKey, setAccessKey] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState('');
    const [postulaciones, setPostulaciones] = useState<Postulacion[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCarrera, setFilterCarrera] = useState('todas');

    const handleLogin = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch(`/api/postulaciones?key=${encodeURIComponent(accessKey)}`);
            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || 'Clave incorrecta');
            }

            setPostulaciones(data.postulaciones);
            setIsAuthenticated(true);
        } catch (err: any) {
            setError(err.message || 'No se pudo verificar el acceso');
        } finally {
            setLoading(false);
        }
    };

    const handleExportCSV = () => {
        if (postulaciones.length === 0) return;

        const headers = ['ID', 'Nombres y Apellidos', 'Correo', 'WhatsApp', 'Carrera', 'Ciclo', 'Fecha Registro', 'Estado'];
        const rows = postulaciones.map(p => [
            p.id,
            `"${p.nombres.replace(/"/g, '""')}"`,
            p.correo,
            p.whatsapp,
            `"${p.carrera.replace(/"/g, '""')}"`,
            p.ciclo,
            p.fechaRegistro,
            p.estado
        ]);

        const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `CIPRO_Postulaciones_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filtered = postulaciones.filter(p => {
        const matchesSearch =
            p.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.whatsapp.includes(searchTerm);
        const matchesCarrera = filterCarrera === 'todas' || p.carrera === filterCarrera;
        return matchesSearch && matchesCarrera;
    });

    return (
        <div className="min-h-screen bg-[#07090E] text-white p-4 md:p-8 font-sans selection:bg-[#FF5500] selection:text-white">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0B0F17] border border-white/10 shadow-xl">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-[#FF5500]/20 text-[#FF5500] border border-[#FF5500]/30">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold tracking-tight">
                                Panel de Miembros CIPRO
                            </h1>
                            <p className="text-xs md:text-sm text-gray-400">
                                Gestión segura de postulaciones y registros de interesados
                            </p>
                        </div>
                    </div>

                    {isAuthenticated && (
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => handleLogin()}
                                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors border border-white/10"
                                title="Actualizar datos"
                            >
                                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            </button>
                            <button
                                onClick={handleExportCSV}
                                className="px-4 py-2.5 rounded-xl bg-[#FF5500] hover:bg-[#ff6a1f] text-white font-medium text-xs md:text-sm flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(255,85,0,0.3)]"
                            >
                                <Download className="w-4 h-4" />
                                Exportar a Excel / CSV
                            </button>
                        </div>
                    )}
                </div>

                {!isAuthenticated ? (
                    /* Pantalla de Acceso Protegido */
                    <div className="max-w-md mx-auto my-16 p-8 rounded-2xl bg-[#0B0F17] border border-white/10 shadow-2xl text-center space-y-6">
                        <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FF5500]/10 border border-[#FF5500]/30 flex items-center justify-center text-[#FF5500]">
                            <KeyRound className="w-7 h-7" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white mb-2">Acceso Exclusivo para Miembros</h2>
                            <p className="text-xs text-gray-400">
                                Ingresa la clave de miembro para consultar las postulaciones recopiladas.
                            </p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-4">
                            <input
                                type="password"
                                value={accessKey}
                                onChange={(e) => setAccessKey(e.target.value)}
                                placeholder="Clave de acceso CIPRO"
                                className="w-full bg-[#131926] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 text-center focus:outline-none focus:border-[#FF5500] focus:ring-1 focus:ring-[#FF5500]"
                            />
                            {error && (
                                <p className="text-red-400 text-xs">{error}</p>
                            )}
                            <button
                                type="submit"
                                disabled={loading || !accessKey}
                                className="w-full py-3 rounded-xl bg-[#FF5500] hover:bg-[#ff6a1f] text-white font-semibold text-sm transition-all shadow-[0_0_20px_rgba(255,85,0,0.3)] disabled:opacity-50"
                            >
                                {loading ? 'Verificando...' : 'Acceder al Panel'}
                            </button>
                        </form>
                    </div>
                ) : (
                    /* Tabla de Postulaciones */
                    <div className="space-y-4">
                        {/* Filtros y Buscador */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="md:col-span-2 relative">
                                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Buscar por nombre, correo o celular..."
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0B0F17] border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF5500]"
                                />
                            </div>
                            <div>
                                <select
                                    value={filterCarrera}
                                    onChange={(e) => setFilterCarrera(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl bg-[#0B0F17] border border-white/10 text-sm text-white focus:outline-none focus:border-[#FF5500]"
                                >
                                    <option value="todas">Todas las carreras</option>
                                    <option value="Ingeniería Industrial">Ingeniería Industrial</option>
                                    <option value="Ingeniería de Sistemas">Ingeniería de Sistemas</option>
                                    <option value="Ingeniería de Software">Ingeniería de Software</option>
                                    <option value="Ingeniería Civil">Ingeniería Civil</option>
                                    <option value="Ingeniería Electrónica / Telecomunicaciones">Electrónica / Telecom</option>
                                    <option value="Ingeniería Mecánica / Mecatrónica">Mecánica / Mecatrónica</option>
                                    <option value="Administración y Negocios">Administración</option>
                                </select>
                            </div>
                        </div>

                        {/* Listado */}
                        <div className="rounded-2xl bg-[#0B0F17] border border-white/10 overflow-hidden shadow-xl">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs md:text-sm">
                                    <thead className="bg-white/5 border-b border-white/10 text-gray-400 uppercase text-[11px] tracking-wider">
                                        <tr>
                                            <th className="py-3 px-4">Postulante</th>
                                            <th className="py-3 px-4">Contacto</th>
                                            <th className="py-3 px-4">Carrera y Ciclo</th>
                                            <th className="py-3 px-4">Fecha</th>
                                            <th className="py-3 px-4 text-right">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 text-gray-300">
                                        {filtered.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="py-8 text-center text-gray-500">
                                                    No se encontraron postulaciones registradas aún.
                                                </td>
                                            </tr>
                                        ) : (
                                            filtered.map((item) => (
                                                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                                                    <td className="py-3.5 px-4">
                                                        <div className="font-semibold text-white">{item.nombres}</div>
                                                        <div className="text-[11px] text-gray-500">{item.id}</div>
                                                    </td>
                                                    <td className="py-3.5 px-4 space-y-1">
                                                        <div className="text-gray-300">{item.correo}</div>
                                                        <div className="text-gray-400 font-mono text-xs">{item.whatsapp}</div>
                                                    </td>
                                                    <td className="py-3.5 px-4">
                                                        <div className="text-white font-medium">{item.carrera}</div>
                                                        <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-white/10 text-gray-300">
                                                            {item.ciclo}
                                                        </span>
                                                    </td>
                                                    <td className="py-3.5 px-4 text-xs text-gray-400 whitespace-nowrap">
                                                        {new Date(item.fechaRegistro).toLocaleDateString()}
                                                    </td>
                                                    <td className="py-3.5 px-4 text-right">
                                                        <a
                                                            href={`https://wa.me/51${item.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${item.nombres}, te saludamos de CIPRO respecto a tu postulación.`)}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 text-xs font-medium transition-colors"
                                                        >
                                                            <MessageCircle className="w-3.5 h-3.5" />
                                                            WhatsApp
                                                        </a>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
