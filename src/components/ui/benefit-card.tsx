'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BenefitCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
    imageSrc: string;
    imageAlt: string;
    index?: number;
    hasDetail?: boolean;
    isOpen?: boolean;
    onClick?: () => void;
}

export default function BenefitCard({
    title,
    description,
    icon: Icon,
    imageSrc,
    imageAlt,
    index = 0,
    hasDetail = false,
    isOpen = false,
    onClick,
}: BenefitCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    // Preload image to prevent flicker
    useEffect(() => {
        const img = new Image();
        img.src = imageSrc;
        img.onload = () => setIsImageLoaded(true);
    }, [imageSrc]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15, duration: 0.6 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={hasDetail ? onClick : undefined}
            className={cn(
                "group relative h-[320px] rounded-3xl overflow-hidden",
                "border border-white/10 hover:border-electric-orange/50",
                "transition-all duration-500",
                hasDetail ? "cursor-pointer" : "cursor-default",
                isOpen && "border-electric-orange/60 shadow-[0_0_30px_rgba(255,85,0,0.2)]",
                !isImageLoaded && "bg-white/5 animate-pulse"
            )}
        >
            {/* Background Image */}
            <div className="absolute inset-0">
                {isImageLoaded && (
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                        style={{ backgroundImage: `url(${imageSrc})` }}
                        role="img"
                        aria-label={imageAlt}
                    />
                )}
            </div>

            {/* Gradient Overlays */}
            <div className="absolute inset-0">
                {/* Default gradient - emphasis on title area (top-left) */}
                <div
                    className={cn(
                        "absolute inset-0 transition-opacity duration-300",
                        "bg-gradient-to-br from-black/70 via-black/40 to-black/20",
                        isHovered && "opacity-0"
                    )}
                />

                {/* Hover gradient - darker (top 40%, middle 60%, bottom 90%) */}
                <div
                    className={cn(
                        "absolute inset-0 transition-opacity duration-300 opacity-0",
                        "bg-gradient-to-b from-black/40 via-black/60 to-black/90",
                        isHovered && "opacity-100"
                    )}
                />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-between p-8">

                {/* Top Section - Icon + Title (always visible) */}
                <div className="flex items-center gap-2">
                    {/* Icon */}
                    <motion.div
                        className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300",
                            isHovered
                                ? "bg-electric-orange/20 border border-electric-orange/30"
                                : "bg-white/10 border border-white/20"
                        )}
                    >
                        <Icon
                            className={cn(
                                "w-4 h-4 transition-colors duration-300",
                                isHovered ? "text-electric-orange" : "text-white"
                            )}
                        />
                    </motion.div>

                    {/* Title */}
                    <h3
                        className={cn(
                            "text-xl font-bold transition-colors duration-300",
                            isHovered ? "text-electric-orange" : "text-white"
                        )}
                    >
                        {title}
                    </h3>
                </div>

                {/* Bottom Section - Description + CTA (only on hover) */}
                <AnimatePresence>
                    {isHovered && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="space-y-4"
                        >
                            <p className="text-gray-200 leading-relaxed text-base">
                                {description}
                            </p>

                            {/* CTA with bouncing arrow - white text, orange on hover */}
                            <div className="group/cta flex items-center gap-2 text-white hover:text-electric-orange font-semibold text-sm transition-colors duration-200 cursor-pointer w-fit">
                                <span>Ver más</span>
                                <motion.div
                                    animate={{
                                        x: [0, 4, 0],
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                >
                                    <ArrowRight className="w-4 h-4" />
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Glassmorphism Border Enhancement */}
            <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10 pointer-events-none" />
        </motion.div>
    );
}
