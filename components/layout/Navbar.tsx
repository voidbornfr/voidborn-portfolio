"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import MagneticButton from "@/components/ui/MagneticButton";
import DecryptText from "@/components/ui/DecryptText";

const navItems = [
    { name: "GATEWAY", path: "/" },
    { name: "ORIGIN", path: "/about" },
    { name: "ARCHIVE", path: "/projects" },
    { name: "TRANSMISSION", path: "/contact" },
];

export default function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed top-6 left-0 right-0 z-50 px-6 flex justify-center pointer-events-none">
            <div className="pointer-events-auto glass-panel rounded-full px-8 py-4 flex items-center gap-12 shadow-2xl shadow-black/50">
                {/* Logo */}
                <Link href="/" className="font-heading text-lg font-bold tracking-widest text-text-main group relative overflow-hidden flex items-center gap-2">
                    <DecryptText text="VOIDBORN" speed={70} maxIterations={20} className="relative z-10" />
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <MagneticButton key={item.path}>
                                <Link
                                    href={item.path}
                                    className={cn(
                                        "text-[10px] font-bold tracking-[0.2em] transition-all relative hover:text-white px-2 py-2 block",
                                        isActive ? "text-white" : "text-text-muted"
                                    )}
                                >
                                    {item.name}
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-dot"
                                            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white"
                                        />
                                    )}
                                </Link>
                            </MagneticButton>
                        );
                    })}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden text-text-main hover:opacity-50 transition-opacity"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Mobile Nav Overlay */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="pointer-events-auto absolute top-24 left-6 right-6 p-8 bg-void border border-border rounded-3xl z-40 flex flex-col items-center gap-6 shadow-2xl"
                >
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                                "text-sm font-bold tracking-widest uppercase",
                                pathname === item.path ? "text-white" : "text-text-muted"
                            )}
                        >
                            {item.name}
                        </Link>
                    ))}
                </motion.div>
            )}
        </nav>
    );
}
