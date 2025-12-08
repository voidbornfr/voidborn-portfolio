"use client";

import Navbar from "@/components/layout/Navbar";
import BackgroundFX from "@/components/layout/BackgroundFX";
import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowRight, CheckCircle } from "lucide-react";
import DecryptText from "@/components/ui/DecryptText";
import MagneticButton from "@/components/ui/MagneticButton";

export default function ContactPage() {
    const [sent, setSent] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSent(true);
        // Logic to send email would go here
    };

    return (
        <main className="min-h-screen relative font-sans text-white overflow-hidden flex items-center justify-center bg-void-black">
            <BackgroundFX />
            <Navbar />

            {/* Ambient Background Glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/[0.03] rounded-full blur-[150px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[150px]" />
            </div>

            <div className="max-w-7xl w-full px-6 relative z-10 pt-20 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

                {/* Left Column: Typography & Info */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="hidden lg:block space-y-12"
                >
                    <div>
                        <p className="text-xs font-mono tracking-[0.5em] text-white/40 mb-4 ml-1">
                            // SECURE_CHANNEL
                        </p>
                        <h1 className="text-8xl font-heading font-bold tracking-tighter leading-[0.8] mb-6">
                            LET'S<br />
                            <span className="text-white/20">TALK.</span>
                        </h1>
                        <p className="text-lg text-white/60 font-light leading-relaxed max-w-md">
                            Have a vision for the next digital frontier? Initiate the uplink protocol below. I'm always listening for signals from the void.
                        </p>
                    </div>

                    <div className="space-y-4 font-mono text-sm text-white/40">
                        <div className="flex items-center gap-4">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span>STATUS: ONLINE & READY</span>
                        </div>
                        <p>LOC: 127.0.0.1 // EARTH</p>
                    </div>
                </motion.div>

                {/* Right Column: Form Interface */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    {!sent ? (
                        <form
                            onSubmit={handleSubmit}
                            className="bg-zinc-900/10 backdrop-blur-2xl p-10 md:p-14 rounded-[3rem] border border-white/5 relative overflow-hidden"
                        >
                            {/* Subtle Gradient Border Top */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />

                            {/* Mobile Header (visible only on small screens) */}
                            <div className="lg:hidden mb-12 text-center">
                                <h1 className="text-5xl font-bold tracking-tighter mb-2">TRANSMISSION</h1>
                                <DecryptText text="ESTABLISH_UPLINK" speed={80} className="text-xs font-mono text-white/50 tracking-widest" />
                            </div>

                            <div className="space-y-10">
                                {/* Name Field */}
                                <div className="relative group">
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('name')}
                                        onBlur={() => setFocusedField(null)}
                                        className="w-full bg-transparent border-b border-white/10 py-4 text-2xl font-light focus:outline-none transition-all placeholder:text-transparent text-white"
                                        placeholder="Identification"
                                    />
                                    <label
                                        className={`absolute left-0 pointer-events-none transition-all duration-300 font-mono text-xs tracking-widest uppercase
                                            ${focusedField === 'name' || formData.name ? '-top-3 text-white/50 text-[10px]' : 'top-5 text-white/30 text-sm'}`}
                                    >
                                        Identification
                                    </label>
                                    <div className={`absolute bottom-0 left-0 h-[1px] bg-white transition-all duration-500 ${focusedField === 'name' ? 'w-full' : 'w-0'}`} />
                                </div>

                                {/* Email Field */}
                                <div className="relative group">
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('email')}
                                        onBlur={() => setFocusedField(null)}
                                        className="w-full bg-transparent border-b border-white/10 py-4 text-2xl font-light focus:outline-none transition-all placeholder:text-transparent text-white"
                                        placeholder="Frequency (Email)"
                                    />
                                    <label
                                        className={`absolute left-0 pointer-events-none transition-all duration-300 font-mono text-xs tracking-widest uppercase
                                            ${focusedField === 'email' || formData.email ? '-top-3 text-white/50 text-[10px]' : 'top-5 text-white/30 text-sm'}`}
                                    >
                                        Frequency (Email)
                                    </label>
                                    <div className={`absolute bottom-0 left-0 h-[1px] bg-white transition-all duration-500 ${focusedField === 'email' ? 'w-full' : 'w-0'}`} />
                                </div>

                                {/* Message Field */}
                                <div className="relative group">
                                    <textarea
                                        name="message"
                                        required
                                        rows={3}
                                        value={formData.message}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('message')}
                                        onBlur={() => setFocusedField(null)}
                                        className="w-full bg-transparent border-b border-white/10 py-4 text-2xl font-light focus:outline-none transition-all placeholder:text-transparent text-white resize-none"
                                        placeholder="Transmission Content"
                                    />
                                    <label
                                        className={`absolute left-0 pointer-events-none transition-all duration-300 font-mono text-xs tracking-widest uppercase
                                            ${focusedField === 'message' || formData.message ? '-top-3 text-white/50 text-[10px]' : 'top-5 text-white/30 text-sm'}`}
                                    >
                                        Transmission Content
                                    </label>
                                    <div className={`absolute bottom-0 left-0 h-[1px] bg-white transition-all duration-500 ${focusedField === 'message' ? 'w-full' : 'w-0'}`} />
                                </div>
                            </div>

                            <div className="mt-16 flex justify-end">
                                <MagneticButton>
                                    <button
                                        type="submit"
                                        className="group relative bg-white text-black px-12 py-5 rounded-full font-bold tracking-wide overflow-hidden flex items-center gap-3 transition-transform hover:scale-105"
                                    >
                                        <span className="relative z-10">INITIATE</span>
                                        <ArrowRight className="relative z-10 w-5 h-5 transition-transform group-hover:translate-x-1" />
                                        <div className="absolute inset-0 bg-white group-hover:bg-gray-200 transition-colors" />
                                    </button>
                                </MagneticButton>
                            </div>
                        </form>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-zinc-900/10 backdrop-blur-2xl p-20 rounded-[3rem] border border-white/5 text-center flex flex-col items-center justify-center min-h-[500px]"
                        >
                            <div className="w-24 h-24 bg-white text-black rounded-full flex items-center justify-center mb-8">
                                <CheckCircle size={40} strokeWidth={1.5} />
                            </div>
                            <h2 className="text-4xl font-bold tracking-tight mb-4 text-white">RECEIVED</h2>
                            <p className="text-white/50 max-w-xs mx-auto mb-12 leading-relaxed">
                                Your signal has pierced the void. I will respond to your frequency shortly.
                            </p>
                            <button
                                onClick={() => setSent(false)}
                                className="text-xs font-mono tracking-[0.2em] border-b border-white/20 pb-1 hover:border-white transition-colors text-white/40 hover:text-white"
                            >
                                SEND_ANOTHER
                            </button>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </main>
    );
}
