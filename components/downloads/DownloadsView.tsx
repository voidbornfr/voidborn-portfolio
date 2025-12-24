"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Download, Box, File, Cpu, Package } from 'lucide-react';
import TiltCard from '@/components/ui/TiltCard';
import MagneticButton from '@/components/ui/MagneticButton';
import Navbar from '@/components/layout/Navbar';
import BackgroundFX from '@/components/layout/BackgroundFX';
import DecryptText from '@/components/ui/DecryptText';

interface DownloadsViewProps {
    files: { name: string; size: string; path: string }[];
}

export default function DownloadsView({ files }: DownloadsViewProps) {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    const getIcon = (name: string) => {
        const ext = name.split('.').pop()?.toLowerCase();
        if (ext === 'exe') return <Cpu className="w-8 h-8 text-white" />;
        if (ext === 'zip' || ext === 'rar') return <Package className="w-8 h-8 text-white" />;
        return <Box className="w-8 h-8 text-white" />;
    };

    return (
        <main className="min-h-screen relative font-sans selection:bg-white selection:text-black overflow-hidden bg-void">
            <BackgroundFX />
            <Navbar />

            {/* Ambient Background Glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/[0.03] rounded-full blur-[150px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[150px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.01] rounded-full blur-[200px]" />
            </div>

            <div className="relative z-10 pt-32 pb-20 px-4 md:px-8 lg:px-16 flex flex-col items-center select-none">
                {/* Header */}
                <div className="text-center mb-24 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <p className="text-xs font-mono tracking-[0.5em] text-white/40 mb-4">
                            // SECURE_VAULT
                        </p>
                        <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 mb-4 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                            DOWNLOADS
                        </h1>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="flex flex-col items-center gap-4"
                    >
                        <p className="text-neutral-400 font-space tracking-wide max-w-lg mx-auto leading-relaxed">
                            Access restricted archives. <br />
                            <span className="text-white/60">Verified binaries and secure packages.</span>
                        </p>
                        <div className="h-px w-24 bg-gradient-to-r from-transparent via-white/30 to-transparent mt-8" />
                    </motion.div>
                </div>

                {/* Grid */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl"
                >
                    {files.map((file, idx) => (
                        <motion.div key={idx} variants={item}>
                            <TiltCard className="h-full bg-zinc-900/40 border border-white/10 p-8 rounded-3xl backdrop-blur-xl flex flex-col gap-6 group hover:border-white/30 transition-all duration-500 hover:shadow-[0_0_50px_rgba(255,255,255,0.05)] hover:bg-zinc-800/50">
                                <div className="flex justify-between items-start">
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-white/10 group-hover:scale-110 transition-all duration-500 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                                        {getIcon(file.name)}
                                    </div>
                                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 border border-white/5 px-3 py-1 rounded-full bg-black/40 group-hover:text-white group-hover:border-white/20 transition-colors">
                                        {file.name.split('.').pop()?.toUpperCase() || 'FILE'}
                                    </span>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <h3 className="text-2xl font-bold font-space text-white group-hover:text-glow transition-all truncate tracking-tight" title={file.name}>
                                        {file.name}
                                    </h3>
                                    <div className="flex items-center gap-2 text-sm text-neutral-500 font-mono">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500/50 group-hover:bg-green-400 group-hover:shadow-[0_0_5px_rgba(74,222,128,0.5)] transition-all" />
                                        {file.size}
                                    </div>
                                </div>

                                <div className="mt-auto pt-4 relative z-20">
                                    <Link href={file.path} download target="_blank" className="block w-full">
                                        <MagneticButton className="w-full">
                                            <button className="w-full relative overflow-hidden flex items-center justify-center gap-3 bg-white text-black font-space font-bold py-4 px-6 rounded-xl hover:bg-neutral-200 transition-all group/btn">
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
                                                <Download size={18} className="group-hover/btn:-translate-y-0.5 transition-transform" />
                                                <span className="tracking-widest text-sm">INITIATE</span>
                                            </button>
                                        </MagneticButton>
                                    </Link>
                                </div>

                                {/* Decorative corners */}
                                <div className="absolute top-4 right-4 w-2 h-2 border-t border-r border-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute bottom-4 left-4 w-2 h-2 border-b border-l border-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </TiltCard>
                        </motion.div>
                    ))}

                    {files.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center py-32 text-neutral-500 font-mono border border-white/5 rounded-3xl bg-black/20 glass-panel">
                            <Box className="w-12 h-12 mb-4 opacity-20" />
                            <p className="tracking-widest">[NO_ARCHIVES_FOUND]</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </main>
    );
}
