'use client';

import React, { useState } from 'react';
import SmartHeader from '@/components/SmartHeader';
import HeroHybrid from '@/components/HeroHybrid';
import PortfolioSection from '@/components/PortfolioSection';
import BenefitsSection from '@/components/BenefitsSection';
import SocialProof from '@/components/SocialProof';
import PMOKnowledgeSection from '@/components/PMOKnowledgeSection';
import Footer from '@/components/Footer';
import GlassDock from '@/components/GlassDock';
import PostulacionModal from '@/components/PostulacionModal';
import LoginMiembrosModal from '@/components/LoginMiembrosModal';
import IntroCiproSection from '@/components/IntroCiproSection';

interface MemberData {
    codigoUni: string;
    nombres: string;
    carrera: string;
    ciclo: string;
    estado: string;
}

export default function Home() {
    const [isPostulacionOpen, setIsPostulacionOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [currentMember, setCurrentMember] = useState<MemberData | null>(null);

    // Mensaje de aviso cuando intentan entrar a la Biblioteca de Recursos
    const [loginNotice, setLoginNotice] = useState<{ title?: string; message?: string }>({});

    const handleLoginSuccess = (member: MemberData) => {
        setCurrentMember(member);
        setLoginNotice({});
    };

    const handleLogout = () => {
        setCurrentMember(null);
        setLoginNotice({});
    };

    // Aviso al hacer clic en Biblioteca de Recursos
    const handleAccessRestrictedResource = (resourceName: string) => {
        if (!currentMember) {
            setLoginNotice({
                title: "Inicia sesión para continuar",
                message: `La "${resourceName}" y las plantillas oficiales son de acceso exclusivo para miembros activos de CIPRO. Ingresa con tu Código UNI y Contraseña para acceder.`
            });
        } else {
            setLoginNotice({});
        }
        setIsLoginOpen(true);
    };

    const handleOpenRegularLogin = () => {
        setLoginNotice({});
        setIsLoginOpen(true);
    };

    return (
        <main className="min-h-screen bg-void-black selection:bg-electric-orange selection:text-white">
            {/* Header con botón Login Miembros arriba a la derecha */}
            <SmartHeader
                onOpenLogin={handleOpenRegularLogin}
                member={currentMember}
            />

            {/* 1. Hero Section con botón ÚNETE AHORA (Captura 1) */}
            <div id="inicio">
                <HeroHybrid onOpenModal={() => setIsPostulacionOpen(true)} />
            </div>

            {/* Content Flow con el orden solicitado */}
            <div className="relative z-10 bg-void-black">
                {/* 2. Intro CIPRO: ¿Qué es?, Propósito, Fundación */}
                <div id="cipro">
                    <IntroCiproSection />
                </div>

                {/* 3. Proyectos con Propósito: Carrusel 3D interactivo */}
                <PortfolioSection member={currentMember} />

                {/* 4. Más que una comunidad: Eventos, Recursos, Capacitaciones */}
                <BenefitsSection
                    member={currentMember}
                    onAccessRestrictedResource={handleAccessRestrictedResource}
                />

                {/* 4. Social Proof: +10 Años, +15 Proyectos, +45 Miembros (Captura 2) */}
                <SocialProof />

                {/* 5. PMO Knowledge con Bento Grid interactivo (Captura 3) */}
                <PMOKnowledgeSection
                    member={currentMember}
                    onAccessRestrictedResource={handleAccessRestrictedResource}
                />

                {/* 6. Footer con botón Postular Ahora (Captura 5) */}
                <Footer onOpenModal={() => setIsPostulacionOpen(true)} />
            </div>

            {/* Menú flotante inferior */}
            <GlassDock />

            {/* Modal de Postulación Emergente */}
            <PostulacionModal
                isOpen={isPostulacionOpen}
                onClose={() => setIsPostulacionOpen(false)}
            />

            {/* Modal de Login de Miembros */}
            <LoginMiembrosModal
                isOpen={isLoginOpen}
                onClose={() => setIsLoginOpen(false)}
                currentMember={currentMember}
                onLoginSuccess={handleLoginSuccess}
                onLogout={handleLogout}
                noticeTitle={loginNotice.title}
                noticeMessage={loginNotice.message}
            />
        </main>
    );
}
