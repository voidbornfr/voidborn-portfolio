'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Sparkles, Terminal, Gamepad2, Archive } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function VoidAI() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
        { role: 'assistant', content: "What do you seek?" }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const toggleOpen = () => setIsOpen(!isOpen);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleCommand = (command: string) => {
        switch (command) {
            case 'projects':
                setMessages(prev => [...prev, { role: 'user', content: 'Show me your projects.' }]);
                setMessages(prev => [...prev, { role: 'assistant', content: 'Accessing Archive...' }]);
                setTimeout(() => router.push('/projects'), 1000);
                break;
            case 'game':
                setMessages(prev => [...prev, { role: 'user', content: 'Play the game.' }]);
                setMessages(prev => [...prev, { role: 'assistant', content: 'Initiating Pursuit protocol...' }]);
                setTimeout(() => router.push('/shadow-escape'), 1000); // Assuming this is the game route
                break;
            case 'lore':
                sendMessage('What is VOIDBORN?');
                break;
        }
    };

    const sendMessage = async (text: string = input) => {
        if (!text.trim()) return;

        if (input) setInput('');
        setMessages(prev => [...prev, { role: 'user', content: text }]);
        setLoading(true);

        try {
            const response = await fetch('/api/void-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text }),
            });

            const data = await response.json();

            if (data.redirect) {
                router.push(data.redirect);
            }

            setMessages(prev => [...prev, { role: 'assistant', content: data.reply || "Signal interrupted." }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: "Error: Connection lost." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Floating Orb */}
            <motion.div
                className="fixed bottom-8 right-8 z-50 cursor-pointer group"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleOpen}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="relative w-12 h-12 rounded-full flex items-center justify-center">
                    {/* Glow Effect */}
                    <div className="absolute inset-0 rounded-full bg-[rgba(188,188,255,0.35)] blur-md animate-pulse group-hover:blur-xl transition-all duration-500" />
                    <div className="relative z-10 w-full h-full rounded-full bg-black/80 border border-white/10 flex items-center justify-center backdrop-blur-sm overflow-hidden">
                        {/* Void Core Animation */}
                        <div className="w-2 h-2 rounded-full bg-cyan-200 shadow-[0_0_10px_2px_rgba(165,243,252,0.6)]" />
                    </div>
                </div>
            </motion.div>

            {/* Chat Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: 20, y: 20 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        exit={{ opacity: 0, x: 20, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed bottom-24 right-8 w-[350px] h-[500px] z-50 flex flex-col rounded-2xl overflow-hidden border border-white/10 shadow-2xl backdrop-blur-xl bg-black/60"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-black/40">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-cyan-200/70" />
                                <span className="text-sm font-light tracking-widest text-white/90">VOID_AI</span>
                            </div>
                            <button onClick={toggleOpen} className="text-white/50 hover:text-white transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                        ? 'bg-white/10 text-cyan-100 rounded-br-sm'
                                        : 'bg-black/40 border border-white/5 text-gray-300 rounded-bl-sm'
                                        }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-black/40 border border-white/5 p-3 rounded-2xl rounded-bl-sm flex gap-1">
                                        <span className="w-1.5 h-1.5 bg-white/30 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <span className="w-1.5 h-1.5 bg-white/30 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <span className="w-1.5 h-1.5 bg-white/30 rounded-full animate-bounce" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Actions */}
                        <div className="px-4 py-2 flex gap-2 overflow-x-auto scrollbar-none">
                            <button onClick={() => handleCommand('projects')} className="flex-shrink-0 px-3 py-1.5 text-xs border border-cyan-500/20 bg-cyan-500/5 text-cyan-300 rounded-full hover:bg-cyan-500/10 transition-colors flex items-center gap-1.5">
                                <Archive size={12} /> Archive
                            </button>
                            <button onClick={() => handleCommand('game')} className="flex-shrink-0 px-3 py-1.5 text-xs border border-purple-500/20 bg-purple-500/5 text-purple-300 rounded-full hover:bg-purple-500/10 transition-colors flex items-center gap-1.5">
                                <Gamepad2 size={12} /> Pursuit
                            </button>
                            <button onClick={() => handleCommand('lore')} className="flex-shrink-0 px-3 py-1.5 text-xs border border-white/10 bg-white/5 text-gray-400 rounded-full hover:bg-white/10 transition-colors flex items-center gap-1.5">
                                <Terminal size={12} /> Origin
                            </button>
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-black/40 border-t border-white/5">
                            <form
                                onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                                className="flex items-center gap-2"
                            >
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Query the void..."
                                    className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder-white/30 font-light"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || loading}
                                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
