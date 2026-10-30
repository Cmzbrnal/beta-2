import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TOTAL_FRAMES = 141;
const FPS = 30;
const BASE_URL = 'https://raw.githubusercontent.com/20233999-collab/web-cipro/92750cf119c39e5f44d034664fa0a6cb199e901a/public/sequence/loop_cipro/';

const HeroLoop: React.FC = () => {
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

        const preloadImages = async () => {
            for (let i = 1; i <= TOTAL_FRAMES; i++) {
                const img = new Image();
                // Format: ezgif-frame-001.jpg, ezgif-frame-010.jpg, ezgif-frame-100.jpg
                const paddedIndex = i.toString().padStart(3, '0');
                img.src = `${BASE_URL}ezgif-frame-${paddedIndex}.jpg`;

                img.onload = () => {
                    loadedCount++;
                    setProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
                    if (loadedCount === TOTAL_FRAMES) {
                        // All images loaded
                        setTimeout(() => setIsLoading(false), 500); // Small delay for smoothness
                    }
                };
                
                // Add error handling just in case
                img.onerror = () => {
                    console.error(`Failed to load frame ${i}`);
                    loadedCount++; // Still count it to avoid hanging (can maybe skip frame)
                     if (loadedCount === TOTAL_FRAMES) {
                        setTimeout(() => setIsLoading(false), 500);
                    }
                };

                images.push(img);
            }
            imagesRef.current = images;
        };

        preloadImages();

        return () => {
            // Cleanup: Cancel any ongoing image loading if possible (browsers mostly handle this, but references clear)
            imagesRef.current = [];
        };
    }, []);

    // Animation Loop
    useEffect(() => {
        if (isLoading || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const animate = (time: number) => {
            if (!lastFrameTimeRef.current) lastFrameTimeRef.current = time;
            const deltaTime = time - lastFrameTimeRef.current;
            const interval = 1000 / FPS;

            if (deltaTime > interval) {
                // Update Logic
                frameIndexRef.current = (frameIndexRef.current + 1) % TOTAL_FRAMES;
                
                // Render Logic
                const img = imagesRef.current[frameIndexRef.current];
                if (img) {
                    // Responsive sizing: 50% of viewport
                    // We can use canvas width/height since we sync it to window
                    const scaleFactor = 0.5;
                    
                    // Maintain aspect ratio
                    const aspectRatio = img.naturalWidth / img.naturalHeight;
                    
                    // Determine target dimensions based on requirement "50% del tamaño del viewport"
                    // Interpreted as: width should be 50% of viewport width? Or area? 
                    // Usually "50% size" means 50% width in this context for a hero image that needs to be visible.
                    // Let's go with 50% of the viewport width, maintaining aspect ratio.
                    // Or 50% of screen height if it's too tall? 
                    // Let's fit it nicely: contain within 50% vw and 50% vh? 
                    // Let's use 50% of the viewport's smaller dimension to ensure it fits and is "50% size".
                    // OR simply 50% width. Let's try to target 50% visible width for impact.
                     requestRef.current = requestAnimationFrame(animate);

                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;
                    
                    ctx.fillStyle = '#020202';
                    ctx.fillRect(0, 0, canvas.width, canvas.height); // Clear screen

                    // Calculate 50% size
                    let targetWidth = canvas.width * 0.5;
                    let targetHeight = targetWidth / aspectRatio;

                    // Centering math
                    const x = (canvas.width - targetWidth) / 2;
                    const y = (canvas.height - targetHeight) / 2;

                    ctx.drawImage(img, x, y, targetWidth, targetHeight);
                }
                 lastFrameTimeRef.current = time - (deltaTime % interval);
            } else {
                 requestRef.current = requestAnimationFrame(animate);
            }
        };

        requestRef.current = requestAnimationFrame(animate);

        const handleResize = () => {
             // Resize handled in render loop by setting canvas properties, 
             // but strictly setting width/height acts as clear, so checking here is good practice but loop handles it.
             // We can just rely on the loop updating dimensions or force update here.
             // For performance, better not to resize in loop every frame if not needed.
             // But for simplicity and guarantee of full coverage, loop resize is okay for simple scenes or handle here.
             // Let's move resize out of loop for performance? 
             // Actually, if we want it truly responsive to window resize without lag, resize listener is better.
        };
        
        // Initial setup
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        window.addEventListener('resize', handleResize);

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            window.removeEventListener('resize', handleResize);
        };
    }, [isLoading]);


    return (
        <div className="relative w-full h-screen bg-[#020202] overflow-hidden">
            {/* Loader */}
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        className="absolute inset-0 z-50 flex items-center justify-center bg-[#020202]"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                         <div className="flex flex-col items-center gap-4">
                            <span className="text-[#FF5500] text-6xl font-black tracking-tighter">
                                {progress}%
                            </span>
                            <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                                <motion.div 
                                    className="h-full bg-[#FF5500]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                />
                            </div>
                         </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Canvas */}
            <canvas
                ref={canvasRef}
                className="block w-full h-full"
            />

            {/* UI Overlay */}
            {!isLoading && (
                <motion.div
                    className="absolute bottom-12 left-0 right-0 flex justify-center z-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                >
                    <button 
                        className="
                            px-8 py-4 
                            rounded-full 
                            bg-transparent 
                            border-2 border-[#FF5500] 
                            text-white font-bold text-lg 
                            tracking-widest
                            shadow-[0_0_20px_rgba(255,85,0,0.3)]
                            hover:shadow-[0_0_30px_rgba(255,85,0,0.6)]
                            hover:bg-[#FF5500]/10
                            transition-all duration-300
                            backdrop-blur-sm
                        "
                    >
                        ÚNETE AHORA
                    </button>
                </motion.div>
            )}
        </div>
    );
};

export default HeroLoop;
