"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

export default function AudioController() {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false); // Start unmuted by default logic, but browser might block
    const [hasInteracted, setHasInteracted] = useState(false);

    useEffect(() => {
        // Attempt autoplay on mount
        const playAudio = async () => {
            if (audioRef.current) {
                try {
                    audioRef.current.volume = 0.4; // 40% volume
                    await audioRef.current.play();
                    setIsPlaying(true);
                } catch (err) {
                    console.log("Autoplay blocked by browser. Update interaction required.");
                    setIsPlaying(false);
                }
            }
        };

        playAudio();

        // Fallback: Add global click listener to unlock audio if autoplay blocked
        const handleInteraction = () => {
            if (!hasInteracted && audioRef.current && audioRef.current.paused) {
                audioRef.current.play().catch(e => console.error(e));
                setIsPlaying(true);
                setHasInteracted(true);
            }
        };

        window.addEventListener("click", handleInteraction);
        return () => window.removeEventListener("click", handleInteraction);
    }, [hasInteracted]);

    const toggleAudio = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.play();
                setIsPlaying(true);
            }
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-50 mix-blend-difference">
            <audio ref={audioRef} loop src="/background music/music.m4a" />

            <button
                onClick={toggleAudio}
                className="group flex items-center gap-3 pr-4 pl-4 py-2 rounded-full border border-white/20 bg-black/20 backdrop-blur-md hover:bg-white/10 transition-all hover:scale-105 active:scale-95"
            >
                <div className="relative w-4 h-4 flex items-center justify-center">
                    {/* Sound Wave Animation */}
                    <AnimatePresence mode="wait">
                        {isPlaying ? (
                            <motion.div
                                key="playing"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex gap-[2px] items-end h-3"
                            >
                                <motion.div
                                    animate={{ height: [4, 12, 4] }}
                                    transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
                                    className="w-[2px] bg-white rounded-full"
                                />
                                <motion.div
                                    animate={{ height: [8, 16, 6] }}
                                    transition={{ repeat: Infinity, duration: 0.6, delay: 0.1, ease: "easeInOut" }}
                                    className="w-[2px] bg-white rounded-full"
                                />
                                <motion.div
                                    animate={{ height: [6, 10, 4] }}
                                    transition={{ repeat: Infinity, duration: 0.9, delay: 0.2, ease: "easeInOut" }}
                                    className="w-[2px] bg-white rounded-full"
                                />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="muted"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <VolumeX size={16} className="text-white/50" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <span className="text-[10px] font-mono tracking-widest text-white/50 group-hover:text-white transition-colors hidden md:block">
                    {isPlaying ? "AUDIO_ACTIVE" : "AUDIO_MUTED"}
                </span>
            </button>
        </div>
    );
}
