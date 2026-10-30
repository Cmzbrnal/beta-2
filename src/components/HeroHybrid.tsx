'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button as MovingBorderButton } from '@/components/ui/moving-border';

const TOTAL_FRAMES = 141;
const FPS = 30;
const BASE_URL = '/sequence/loop_cipro/';

interface HeroHybridProps {
    onOpenModal?: () => void;
}

export default function HeroHybrid({ onOpenModal }: HeroHybridProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [progress, setProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const requestRef = useRef<number>();
    const frameIndexRef = useRef(0);
    const lastFrameTimeRef = useRef(0);

    // Smart Preloader
    useEffect(() => {
        let loadedCount = 0;
        const images: HTMLImageElement[] = [];
        let isMounted = true;

        const preloadImages = () => {
            for (let i = 1; i <= TOTAL_FRAMES; i++) {
                const img = new Image();
                const paddedIndex = i.toString().padStart(3, '0');
                img.src = `${BASE_URL}ezgif-frame-${paddedIndex}.jpg`;

                img.onload = () => {
                    if (!isMounted) return;
                    loadedCount++;
                    setProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
                    if (loadedCount === TOTAL_FRAMES) {
                        setTimeout(() => setIsLoading(false), 800);
                    }
                };

                img.onerror = () => {
                    if (!isMounted) return;
                    console.error(`Failed to load frame ${i}`);
                    loadedCount++;
                    if (loadedCount === TOTAL_FRAMES) {
                        setTimeout(() => setIsLoading(false), 800);
                    }
                };

                images.push(img);
            }
            imagesRef.current = images;
        };

        preloadImages();

        return () => {
            isMounted = false;
            imagesRef.current = [];
        };
    }, []);

    // Animation Loop
    useEffect(() => {
        if (isLoading || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Initial setup
        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        handleResize();
        window.addEventListener('resize', handleResize);

        const animate = (time: number) => {
            if (!lastFrameTimeRef.current) lastFrameTimeRef.current = time;
            const deltaTime = time - lastFrameTimeRef.current;
            const interval = 1000 / FPS;

            if (deltaTime > interval) {
                frameIndexRef.current = (frameIndexRef.current + 1) % TOTAL_FRAMES;

                const img = imagesRef.current[frameIndexRef.current];
                if (img) {
                    const isMobile = canvas.width < 768;
                    const scaleFactor = isMobile ? 0.9 : 0.5;

                    const aspectRatio = img.naturalWidth / img.naturalHeight;

                    let targetWidth = canvas.width * scaleFactor;
                    let targetHeight = targetWidth / aspectRatio;

                    const x = (canvas.width - targetWidth) / 2;
                    const y = ((canvas.height - targetHeight) / 2) * 0.35;

                    ctx.fillStyle = '#020202';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, x, y, targetWidth, targetHeight);
                }
                lastFrameTimeRef.current = time - (deltaTime % interval);
            }

            requestRef.current = requestAnimationFrame(animate);
        };

        requestRef.current = requestAnimationFrame(animate);

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            window.removeEventListener('resize', handleResize);
        };
    }, [isLoading]);

    return (
        <section className="relative h-screen w-full overflow-hidden bg-void-black flex flex-col items-center justify-between">
            {/* Visual Media Layer: Canvas */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 z-0 h-full w-full object-cover pointer-events-none"
            />

            {/* Smart Loader Overlay */}
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-void-black"
                    >
                        <div className="relative flex flex-col items-center gap-4">
                            <div className="text-4xl md:text-6xl font-black tracking-tighter text-white">
                                {progress}%
                            </div>
                            <div className="h-[2px] w-48 bg-white/10 overflow-hidden rounded-full">
                                <motion.div
                                    className="h-full bg-electric-orange"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ ease: "linear" }}
                                />
                            </div>
                            <span className="text-xs uppercase tracking-widest text-gray-500 font-mono">
                                Iniciando Experiencia
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Content Overlay: Static & Centered at the Bottom */}
            {!isLoading && (
                <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-end pb-20 md:pb-28 text-center px-4 pointer-events-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-gradient-to-br from-black via-white to-black bg-clip-text text-transparent pb-2 drop-shadow-2xl">
                            Gestión de <br className="md:hidden" /> Proyectos
                        </h1>
                    </motion.div>

                    {/* Botón ÚNETE AHORA con iluminación reactiva al cursor y al presionar */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative group"
                    >
                        {/* Halo resplandeciente exterior al acercar el cursor */}
                        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-electric-orange via-[#ff7733] to-electric-orange opacity-40 group-hover:opacity-100 blur-xl group-hover:blur-2xl transition-all duration-300 -z-10 group-active:opacity-100 group-active:scale-110" />

                        <MovingBorderButton
                            onClick={onOpenModal}
                            borderRadius="9999px"
                            duration={2500}
                            containerClassName="h-auto w-auto shadow-[0_0_30px_rgba(255,85,0,0.5)] group-hover:shadow-[0_0_65px_rgba(255,85,0,0.9)] group-active:shadow-[0_0_90px_rgba(255,85,0,1)] transition-all duration-300 cursor-pointer"
                            className="bg-electric-orange border-none text-white font-bold text-base md:text-lg tracking-widest px-8 py-4 group-hover:brightness-110 group-active:brightness-125 transition-all"
                        >
                            ÚNETE AHORA
                        </MovingBorderButton>
                    </motion.div>
                </div>
            )}
        </section>
    );
}
