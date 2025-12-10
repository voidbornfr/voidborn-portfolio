"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Terminal } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import PortalScene from "./PortalScene";
import { Suspense, useEffect, useState } from "react";
import DecryptText from "@/components/ui/DecryptText";

// GLITCH TEXT COMPONENT
const GlitchStatus = () => {
    const [text, setText] = useState("SYSTEM_STATUS: ONLINE");
    const [glitching, setGlitching] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setGlitching(true);
            const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
            let iterations = 0;

            const glitchInterval = setInterval(() => {
                setText(prev =>
                    prev.split("").map((char, index) => {
                        if (index < 3) return char; // keep 'SYS' stable sometimes? No, let's random all
                        return chars[Math.floor(Math.random() * chars.length)];
                    }).join("")
                );
                iterations++;
                if (iterations > 5) {
                    clearInterval(glitchInterval);
                    setText("SYSTEM_STATUS: ONLINE");
                    setGlitching(false);
                }
            }, 50);

        }, 10000 + Math.random() * 4000); // 10-14s random interval

        return () => clearInterval(interval);
    }, []);

    return (
        <span className={glitching ? "text-red-500/80" : "text-text-muted"}>
            {text}
        </span>
    );
}

export default function HeroGateway() {
    const [mounted, setMounted] = useState(false);

    // Audio Ref
    // const audioRef = useRef<HTMLAudioElement>(null); // Uncomment when audio is ready

    // Parallax logic
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth springs for mouse movement
    const mouseX = useSpring(x, { stiffness: 50, damping: 20 });
    const mouseY = useSpring(y, { stiffness: 50, damping: 20 });

    const handleMouseMove = (e: React.MouseEvent) => {
        const { innerWidth, innerHeight } = window;
        const xPct = (e.clientX / innerWidth) - 0.5;
        const yPct = (e.clientY / innerHeight) - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    // Layer Transforms
    const rishabX = useTransform(mouseX, [-0.5, 0.5], ["-1%", "1%"]);
    const rishabY = useTransform(mouseY, [-0.5, 0.5], ["-1%", "1%"]);

    const architectX = useTransform(mouseX, [-0.5, 0.5], ["-2%", "2%"]);
    const architectY = useTransform(mouseY, [-0.5, 0.5], ["-2%", "2%"]);

    const sceneX = useTransform(mouseX, [-0.5, 0.5], ["4%", "-4%"]); // Inverse and stronger
    const sceneY = useTransform(mouseY, [-0.5, 0.5], ["4%", "-4%"]);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <section
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
            onMouseMove={handleMouseMove}
        >
            {/* Ambient Audio (Placeholder) */}
            <audio loop id="ambient-audio">
                <source src="/audio/ambient_void.mp3" type="audio/mp3" />
            </audio>

            {/* Ambient 3D Core - Background */}
            <motion.div
                style={{ x: sceneX, y: sceneY }}
                className="absolute inset-0 z-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.5 }} // Boot sequence: 2nd (stars/scene)
            >
                <Canvas camera={{ position: [0, 0, 25], fov: 45 }}>
                    <Suspense fallback={null}>
                        <PortalScene />
                    </Suspense>
                </Canvas>
            </motion.div>

            {/* Glow Behind Title */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none z-0"
                style={{ background: "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 60%)" }}
            />

            {/* Content - Centralized */}
            <div className="relative z-10 text-center flex flex-col items-center max-w-5xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5, duration: 0.8 }} // Boot sequence: 3rd (Status)
                    className="text-xs md:text-sm font-mono tracking-[0.6em] mb-8 uppercase"
                >
                    <GlitchStatus />
                </motion.div>

                <h1 className="text-7xl md:text-9xl font-bold text-white leading-[0.8] font-heading tracking-tighter mix-blend-difference relative">
                    <motion.div
                        style={{ x: rishabX, y: rishabY }}
                        initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        transition={{ duration: 1.5, delay: 1.5, ease: "easeOut" }} // Boot sequence: 3rd (Title)
                    >
                        RISHAB
                    </motion.div>
                    <motion.div
                        style={{ x: architectX, y: architectY }}
                        initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        transition={{ duration: 1.5, delay: 1.7, ease: "easeOut" }}
                        className="text-text-muted mt-2 block text-5xl md:text-9xl"
                    >
                        ARCHITECT
                    </motion.div>
                </h1>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.2, duration: 1 }} // Boot sequence: 4th (Buttons/Bottom)
                    className="mt-12 flex flex-col items-center gap-6"
                >
                    <p className="max-w-md text-sm md:text-base text-text-muted font-mono tracking-wide leading-relaxed">
               // BUILDING_DIGITAL_REALITIES
                        <br />
               // IMMERSIVE_INTERFACES
                    </p>

                    <div className="flex flex-wrap gap-6 justify-center mt-4">
                        <Link
                            href="/projects"
                            className="group px-10 py-4 rounded-full bg-white text-black font-bold tracking-widest hover:scale-110 active:scale-95 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.6)] flex items-center gap-2"
                        >
                            <span>ENTER_ARCHIVE</span>
                            <ArrowRight size={18} className="group-hover:-rotate-45 transition-transform duration-300" />
                        </Link>

                        <Link
                            href="/about"
                            className="px-10 py-4 rounded-full border border-white/20 text-white font-medium tracking-widest hover:bg-white/10 active:scale-95 transition-all duration-300 flex items-center gap-2 hover:border-white/50"
                        >
                            <Terminal size={14} />
                            <span>ORIGIN_STORY</span>
                        </Link>
                    </div>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 3.0, duration: 1 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                >
                    <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-white/50 to-transparent animate-pulse" />
                    <span className="text-[10px] tracking-widest font-mono text-white/30">SCROLL</span>
                </motion.div>
            </div>
        </section>
    );
}
