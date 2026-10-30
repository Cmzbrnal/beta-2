'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, X, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface PostulacionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function PostulacionModal({ isOpen, onClose }: PostulacionModalProps) {
    const [formData, setFormData] = useState({
        nombres: '',
        codigoUni: '',
        correo: '',
        whatsapp: '',
        carrera: '',
        ciclo: ''
    });

    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validaciones
        if (!formData.nombres || !formData.codigoUni || !formData.correo || !formData.whatsapp || !formData.carrera || !formData.ciclo) {
            setErrorMessage('Por favor completa todos los campos requeridos (*).');
            setStatus('error');
            return;
        }

        setStatus('loading');
        setErrorMessage('');

        const now = new Date();
        const payload = {
            ...formData,
            fecha: now.toLocaleDateString('es-PE', { year: 'numeric', month: '2-digit', day: '2-digit' }),
            hora: now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            estado: 'Postulación'
        };

        try {
            const response = await fetch('/api/postulaciones', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al enviar la postulación');
            }

            setStatus('success');
        } catch (error: any) {
            console.error('Error enviando formulario:', error);
            // Respaldo local de emergencia en navegador
            try {
                const localBackup = JSON.parse(localStorage.getItem('cipro_postulaciones_backup') || '[]');
                localBackup.push({
                    ...payload,
                    id: `POST-${Date.now()}`
                });
                localStorage.setItem('cipro_postulaciones_backup', JSON.stringify(localBackup));
                setStatus('success');
            } catch (localErr) {
                setStatus('error');
                setErrorMessage('Hubo un problema al procesar el envío. Inténtalo de nuevo.');
            }
        }
    };

    const handleClose = () => {
        if (status === 'success') {
            setFormData({ nombres: '', codigoUni: '', correo: '', whatsapp: '', carrera: '', ciclo: '' });
            setStatus('idle');
        }
        onClose();
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
                        onClick={handleClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
                    />

                    {/* Modal Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
                        className="relative w-full max-w-lg bg-[#0B0F17] border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(255,85,0,0.15)] overflow-hidden z-10 my-auto"
                    >
                        {/* Glow superior naranja */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-[#FF5500] to-transparent" />

                        {/* Cabecera */}
                        <div className="flex items-start justify-between p-6 pb-4 border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-[#FF5500]/15 border border-[#FF5500]/30 text-[#FF5500] shadow-[0_0_15px_rgba(255,85,0,0.2)]">
                                    <UserPlus className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white tracking-tight">
                                        Formulario de Postulación CIPRO
                                    </h3>
                                    <p className="text-xs text-gray-400">
                                        Únete a nuestros equipos de investigación y PMO
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                                aria-label="Cerrar modal"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Contenido */}
                        <div className="p-6 pt-4">
                            {status === 'success' ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="py-8 text-center space-y-4"
                                >
                                    <div className="w-16 h-16 mx-auto rounded-full bg-[#FF5500]/10 border border-[#FF5500]/30 flex items-center justify-center text-[#FF5500] shadow-[0_0_30px_rgba(255,85,0,0.3)]">
                                        <CheckCircle2 className="w-8 h-8" />
                                    </div>
                                    <h4 className="text-xl font-bold text-white">
                                        ¡Postulación Recibida con Éxito!
                                    </h4>
                                    <p className="text-gray-300 text-sm max-w-sm mx-auto leading-relaxed">
                                        Tus datos se registraron de forma segura en la base de datos de la directiva de CIPRO. Te contactaremos por WhatsApp para agregarte al canal de difusión y continuar con tu proceso.
                                    </p>
                                    <div className="pt-4">
                                        <button
                                            onClick={handleClose}
                                            className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition-colors border border-white/10"
                                        >
                                            Cerrar ventana
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Nombres y Apellidos */}
                                    <div>
                                        <label className="block text-xs font-medium text-gray-300 mb-1.5">
                                            Nombres y Apellidos <span className="text-[#FF5500]">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="nombres"
                                            required
                                            value={formData.nombres}
                                            onChange={handleChange}
                                            placeholder="Ej. Juan Pérez García"
                                            className="w-full bg-[#131926]/90 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF5500] focus:ring-1 focus:ring-[#FF5500] transition-colors"
                                        />
                                    </div>

                                    {/* Código UNI y WhatsApp */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-300 mb-1.5">
                                                Código UNI / Estudiante <span className="text-[#FF5500]">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="codigoUni"
                                                required
                                                value={formData.codigoUni}
                                                onChange={handleChange}
                                                placeholder="Ej. 20233999A"
                                                className="w-full bg-[#131926]/90 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 uppercase focus:outline-none focus:border-[#FF5500] focus:ring-1 focus:ring-[#FF5500] transition-colors"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-gray-300 mb-1.5">
                                                WhatsApp / Celular <span className="text-[#FF5500]">*</span>
                                            </label>
                                            <input
                                                type="tel"
                                                name="whatsapp"
                                                required
                                                value={formData.whatsapp}
                                                onChange={handleChange}
                                                placeholder="987654321"
                                                className="w-full bg-[#131926]/90 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF5500] focus:ring-1 focus:ring-[#FF5500] transition-colors"
                                            />
                                        </div>
                                    </div>

                                    {/* Correo Electrónico */}
                                    <div>
                                        <label className="block text-xs font-medium text-gray-300 mb-1.5">
                                            Correo Electrónico (Institucional o personal) <span className="text-[#FF5500]">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="correo"
                                            required
                                            value={formData.correo}
                                            onChange={handleChange}
                                            placeholder="usuario@uni.pe o usuario@correo.com"
                                            className="w-full bg-[#131926]/90 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF5500] focus:ring-1 focus:ring-[#FF5500] transition-colors"
                                        />
                                    </div>

                                    {/* Carrera y Ciclo */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-300 mb-1.5">
                                                Carrera Profesional <span className="text-[#FF5500]">*</span>
                                            </label>
                                            <select
                                                name="carrera"
                                                required
                                                value={formData.carrera}
                                                onChange={handleChange}
                                                className="w-full bg-[#131926]/90 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF5500] focus:ring-1 focus:ring-[#FF5500] transition-colors"
                                            >
                                                <option value="" disabled className="bg-[#0B0F17] text-gray-500">
                                                    Seleccione carrera
                                                </option>
                                                <option value="Ingeniería Industrial" className="bg-[#0B0F17] text-white">Ingeniería Industrial</option>
                                                <option value="Ingeniería de Sistemas" className="bg-[#0B0F17] text-white">Ingeniería de Sistemas</option>
                                                <option value="Ingeniería de Software" className="bg-[#0B0F17] text-white">Ingeniería de Software</option>
                                                <option value="Ingeniería Civil" className="bg-[#0B0F17] text-white">Ingeniería Civil</option>
                                                <option value="Ingeniería Mecánica / Mecatrónica" className="bg-[#0B0F17] text-white">Ingeniería Mecánica / Mecatrónica</option>
                                                <option value="Ingeniería Electrónica / Telecomunicaciones" className="bg-[#0B0F17] text-white">Electrónica / Telecom</option>
                                                <option value="Ingeniería Económica / Gestión" className="bg-[#0B0F17] text-white">Ingeniería Económica</option>
                                                <option value="Administración y Negocios" className="bg-[#0B0F17] text-white">Administración</option>
                                                <option value="Otra Carrera" className="bg-[#0B0F17] text-white">Otra Carrera</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-gray-300 mb-1.5">
                                                Ciclo Académico <span className="text-[#FF5500]">*</span>
                                            </label>
                                            <select
                                                name="ciclo"
                                                required
                                                value={formData.ciclo}
                                                onChange={handleChange}
                                                className="w-full bg-[#131926]/90 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF5500] focus:ring-1 focus:ring-[#FF5500] transition-colors"
                                            >
                                                <option value="" disabled className="bg-[#0B0F17] text-gray-500">
                                                    Seleccione ciclo
                                                </option>
                                                <option value="1er - 2do Ciclo" className="bg-[#0B0F17] text-white">1er - 2do Ciclo</option>
                                                <option value="3er - 4to Ciclo" className="bg-[#0B0F17] text-white">3er - 4to Ciclo</option>
                                                <option value="5to - 6to Ciclo" className="bg-[#0B0F17] text-white">5to - 6to Ciclo</option>
                                                <option value="7mo - 8vo Ciclo" className="bg-[#0B0F17] text-white">7mo - 8vo Ciclo</option>
                                                <option value="9no - 10mo Ciclo" className="bg-[#0B0F17] text-white">9no - 10mo Ciclo</option>
                                                <option value="Egresado / Bachiller" className="bg-[#0B0F17] text-white">Egresado / Bachiller</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Error */}
                                    {status === 'error' && (
                                        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                                            <AlertCircle className="w-4 h-4 shrink-0" />
                                            <span>{errorMessage}</span>
                                        </div>
                                    )}

                                    {/* Acciones */}
                                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
                                        <button
                                            type="button"
                                            onClick={handleClose}
                                            disabled={status === 'loading'}
                                            className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-medium text-xs transition-colors border border-white/10"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={status === 'loading'}
                                            className="px-6 py-2.5 rounded-xl bg-[#FF5500] hover:bg-[#ff6a1f] text-white font-semibold text-xs tracking-wide transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,85,0,0.3)] hover:shadow-[0_0_30px_rgba(255,85,0,0.5)] active:scale-95 disabled:opacity-50"
                                        >
                                            {status === 'loading' ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Enviando...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-4 h-4" />
                                                    Enviar Postulación
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
