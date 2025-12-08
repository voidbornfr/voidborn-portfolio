"use client";

import Navbar from "@/components/layout/Navbar";
import BackgroundFX from "@/components/layout/BackgroundFX";
import { motion } from "framer-motion";

const experiments = [
    { title: "FLUID_SIM_01", status: "ACTIVE" },
    { title: "TYPO_KINETICS", status: "ARCHIVED" },
    { title: "SHADER_VOID", status: "BETA" },
    { title: "AI_AGENTS", status: "TESTING" },
    { title: "AUDIO_REACT", status: "ACTIVE" },
    { title: "DATA_VIS", status: "PENDING" },
];

export default function LabPage() {
    return (
        <main className="min-h-screen relative font-sans text-white overflow-hidden">
            <BackgroundFX />
            <Navbar />

            <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
                    <div>
                        <h1 className="text-6xl md:text-8xl font-heading font-bold tracking-tighter mix-blend-overlay">LAB</h1>
                        <p className="text-sm font-mono tracking-[0.3em] text-text-muted mt-2">EXPERIMENTAL_PROTOTYPES</p>
                    </div>
                    <div className="text-right">
                        <span className="block text-4xl font-mono font-bold">06</span>
                        <span className="text-xs tracking-widest text-text-muted">ACTIVE_EXPERIMENTS</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {experiments.map((ex, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            className="aspect-square border border-white/5 bg-white/5 rounded-3xl p-6 flex flex-col justify-between hover:bg-white/10 hover:scale-[1.02] transition-all cursor-pointer"
                        >
                            <div className="w-full flex justify-end">
                                <span className={`text-[10px] font-mono border rounded-full px-2 py-0.5 ${ex.status === 'ACTIVE' ? 'border-white text-white' : 'border-white/20 text-white/40'}`}>
                                    {ex.status}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold tracking-wide">{ex.title}</h3>
                        </motion.div>
                    ))}
                </div>
            </div>
        </main>
    );
}
