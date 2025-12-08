"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import TiltCard from "@/components/ui/TiltCard";

interface ProjectProps {
    id: string;
    title: string;
    category: string;
    description: string;
    link: string;
    images: string[];
}

export default function ProjectCard({ project, index }: { project: ProjectProps; index: number }) {
    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
        if (project.images.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % project.images.length);
        }, 4000); // Change image every 4 seconds

        return () => clearInterval(interval);
    }, [project.images.length]);

    return (
        <div className="h-full">
            <Link href={project.link} target="_blank" className="block h-full group">
                <div className="relative overflow-hidden min-h-[400px] h-full border border-white/10 rounded-3xl bg-white/5 backdrop-blur-sm p-8 flex flex-col justify-between hover:border-white/20 transition-colors">

                    {/* Slideshow Background */}
                    <div className="absolute inset-0 z-0 opacity-40 group-hover:opacity-60 transition-opacity duration-500">
                        <AnimatePresence mode="popLayout">
                            <motion.img
                                key={currentImage}
                                src={project.images[currentImage]}
                                alt={project.title}
                                initial={{ opacity: 0, scale: 1.1 }}
                                animate={{ opacity: 1, scale: 1.0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1.5, ease: "easeInOut" }}
                                className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                            />
                        </AnimatePresence>
                        <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors duration-500" />
                    </div>

                    {/* Hover Gradient Overlay from User Snippet */}
                    <div
                        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-10"
                        style={{ background: "radial-gradient(650px at 50% 50%, rgba(255, 255, 255, 0.1), transparent 80%)" }}
                    />

                    {/* Content Container */}
                    <div className="relative z-20 h-full flex flex-col justify-between">
                        {/* Arrow Icon */}
                        <div className="absolute top-0 right-0 p-0 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                            <ArrowUpRight className="w-8 h-8 text-white" />
                        </div>

                        {/* Header */}
                        <div>
                            <span className="text-5xl font-mono text-white/20 font-bold">
                                {index.toString().padStart(2, '0')}
                            </span>
                            <h2 className="text-4xl font-bold mt-4 tracking-wide text-white uppercase mix-blend-difference">
                                {project.title}
                            </h2>
                        </div>

                        {/* Footer */}
                        <div>
                            <span className="text-xs font-mono border border-white/20 rounded-full px-3 py-1 text-white/80 bg-black/40 backdrop-blur-md">
                                {project.category}
                            </span>
                            <p className="mt-4 text-gray-300 text-sm font-light max-w-[90%] leading-relaxed drop-shadow-md">
                                {project.description}
                            </p>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}
