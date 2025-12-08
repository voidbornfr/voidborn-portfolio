"use client";

import Navbar from "@/components/layout/Navbar";
import BackgroundFX from "@/components/layout/BackgroundFX";
import { motion } from "framer-motion";
import TiltCard from "@/components/ui/TiltCard";

const ORIGIN_DATA = [
    {
        id: "01",
        title: "WHO I AM",
        content: (
            <>
                <p>My name is Rishab. And I don’t know if I’m “fine.”</p>
                <p className="mt-4">People see a developer, a creator. But the truth is… I build because I don’t know what to do with everything I feel.</p>
                <p className="mt-4 italic text-white/60">Code is predictable. Life isn’t.</p>
            </>
        ),
        colSpan: "md:col-span-2",
    },
    {
        id: "02",
        title: "MY BEGINNING",
        content: (
            <>
                <p>I didn’t start with inspiration. No passion story. No spark.</p>
                <p className="mt-4">I started because something inside me always felt… off. Like a missing piece I couldn’t name.</p>
                <p className="mt-4">Coding was the first place where I didn’t have to pretend.</p>
            </>
        ),
        colSpan: "md:col-span-1",
    },
    {
        id: "03",
        title: "MY YEARS",
        content: (
            <div className="space-y-4 font-mono text-sm">
                <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-white/40">2018</span>
                    <span>First line of code.</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-white/40">2020</span>
                    <span>Overthinking everything.</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-white/40">2022</span>
                    <span>Lost pieces of myself.</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-white/40">2023</span>
                    <span>Built to avoid thinking.</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-white font-bold">2025</span>
                    <span className="text-white font-bold">VoidBorn.</span>
                </div>
            </div>
        ),
        colSpan: "md:col-span-1",
    },
    {
        id: "04",
        title: "CAPABILITIES",
        content: (
            <>
                <p>People see skills: UI, Design, Backend.</p>
                <p className="mt-4">But I didn’t master these to be impressive. I mastered them because I didn’t want to feel powerless.</p>
                <div className="mt-6 flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-white/10 rounded-full text-xs">Animation</span>
                    <span className="px-3 py-1 bg-white/10 rounded-full text-xs">World-Building</span>
                    <span className="px-3 py-1 bg-white/10 rounded-full text-xs">System Architecture</span>
                </div>
            </>
        ),
        colSpan: "md:col-span-2",
    },
    {
        id: "05",
        title: "UNSPOKEN",
        content: (
            <>
                <p>I am quiet. Not because I have nothing to say, but because I’ve learned that most people don’t listen.</p>
                <p className="mt-4">I think too much. My own mind feels like a room I’m locked inside.</p>
            </>
        ),
        colSpan: "md:col-span-1",
    },
    {
        id: "06",
        title: "PROTOCOL",
        content: (
            <>
                <p>VoidBorn isn’t a project. It’s me.</p>
                <p className="mt-4">I’m building a world where my thoughts don’t suffocate me. A place where I can finally exist without apologizing for how I feel.</p>
            </>
        ),
        colSpan: "md:col-span-1",
    },
    {
        id: "07",
        title: "FUTURE",
        content: (
            <>
                <p>I don’t know. I really don’t.</p>
                <p className="mt-4">But I’ll keep moving. Not because I’m strong, but because stopping scares me more than continuing.</p>
            </>
        ),
        colSpan: "md:col-span-1",
    },
];

export default function AboutPage() {
    return (
        <main className="min-h-screen relative font-sans text-white bg-void-black overflow-x-hidden selection:bg-white selection:text-black">
            <BackgroundFX />
            <Navbar />

            <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto relative z-10">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-20 text-center"
                >
                    <div className="inline-block px-4 py-1 mb-6 border border-red-500/30 bg-red-500/5 rounded-full">
                        <p className="font-mono text-xs text-red-400 tracking-widest animate-pulse">
                            ⚠ SYSTEM_NOTE: EMOTIONAL_DISTORTION_ACTIVE
                        </p>
                    </div>
                    <h1 className="text-7xl md:text-9xl font-heading font-bold tracking-tighter mix-blend-difference mb-6">
                        ORIGIN FILE
                    </h1>
                    <p className="text-white/40 max-w-xl mx-auto font-light text-lg">
                        Decrypted memory banks. Examining core drivers and historical data.
                    </p>
                </motion.div>

                {/* Bento Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {ORIGIN_DATA.map((item, index) => (
                        <div key={item.id} className={`${item.colSpan}`}>
                            <TiltCard className="h-full border border-white/10 rounded-3xl bg-white/5 backdrop-blur-md p-8 md:p-10 flex flex-col justify-between hover:border-white/20 transition-all hover:bg-white/10 group">

                                <div className="mb-8 flex justify-between items-start">
                                    <h2 className="text-2xl font-bold tracking-tight text-white group-hover:text-shadow-sm transition-all">
                                        {item.title}
                                    </h2>
                                    <span className="font-mono text-xs text-white/20 border border-white/10 rounded px-2 py-1">
                                        [{item.id}]
                                    </span>
                                </div>

                                <div className="text-base md:text-lg leading-relaxed text-white/70 font-light group-hover:text-white/90 transition-colors">
                                    {item.content}
                                </div>

                            </TiltCard>
                        </div>
                    ))}

                    {/* Final Terminal Card */}
                    <div className="md:col-span-3">
                        <TiltCard className="h-full border border-white/10 rounded-3xl bg-black p-8 md:p-12 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
                            <div className="font-mono text-sm relative z-10">
                                <div className="flex gap-2 mb-6 opacity-50">
                                    <div className="w-3 h-3 rounded-full bg-red-500" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                    <div className="w-3 h-3 rounded-full bg-green-500" />
                                </div>
                                <div className="space-y-4 text-white/80">
                                    <p><span className="text-blue-400">root@void</span>:<span className="text-white/50">~</span>$ cat entry_08_final.txt</p>
                                    <p className="pl-4 border-l-2 border-white/20 text-white/60 italic">
                                        "I don’t talk about this. Not to people. Not out loud.<br />
                                        So I’m writing it here because the only place that understands me is the one I build myself.<br />
                                        <br />
                                        This file isn’t for the world. It’s for me.<br />
                                        For the version of me that’s tired, overwhelmed, quietly struggling,<br />
                                        but still… somehow… still trying."
                                    </p>
                                    <p className="text-red-400 mt-6">
                                        {'>'} END OF SELF-FILE.<br />
                                        {'>'} Residual heaviness detected.<br />
                                        {'>'} No fix available. Continuing anyway.<span className="animate-pulse">_</span>
                                    </p>
                                </div>
                            </div>
                        </TiltCard>
                    </div>
                </div>

            </div>
        </main>
    );
}
