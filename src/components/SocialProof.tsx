'use client';

import React, { useRef } from 'react';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';

function Counter({ to, label }: { to: number; label: string }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const spring = useSpring(0, { duration: 2000 });
    const display = useTransform(spring, (current) => Math.round(current));

    useEffect(() => {
        if (isInView) {
            spring.set(to);
        }
    }, [isInView, to, spring]);

    return (
        <div ref={ref} className="flex flex-col items-center">
            <span className="text-4xl md:text-6xl font-black text-white tracking-tighter flex items-baseline">
                +<motion.span>{display}</motion.span>
            </span>
            <span className="text-sm md:text-base text-gray-400 mt-2 uppercase tracking-widest font-medium">
                {label}
            </span>
        </div>
    );
}

export default function SocialProof() {
    return (
        <section className="py-16 md:py-24 bg-void-black border-y border-white/5">
            <div className="container">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center">
                    <Counter to={10} label="Años de Historia" />
                    <Counter to={15} label="Proyectos" />
                    <Counter to={45} label="Miembros Activos" />
                </div>
            </div>
        </section>
    );
}
