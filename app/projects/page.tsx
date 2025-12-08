"use client";

import { motion } from "framer-motion";
import ProjectCard from "@/components/projects/ProjectCard";
import SmoothScroll from "@/components/layout/SmoothScroll";
import Navbar from "@/components/layout/Navbar";

// Project Data - Images mapped from public/projects folder structure
const PROJECTS = [
    {
        id: "01",
        title: "VOID_STREAM",
        category: "STREAMING PLATFORM",
        description: "World's best ads-free movies, series, anime, kdrama, and manga streaming website.",
        link: "https://voidstream.space",
        images: [
            "/projects/voidstream/Screenshot 2025-12-08 151821.png",
            "/projects/voidstream/Screenshot 2025-12-08 152432.png",
            "/projects/voidstream/Screenshot 2025-12-08 152451.png",
            "/projects/voidstream/Screenshot 2025-12-08 152516.png",
            "/projects/voidstream/Screenshot 2025-12-08 152604.png"
        ]
    },
    {
        id: "02",
        title: "VOID_ANIME",
        category: "OPEN SOURCE",
        description: "World's best anime & manga streaming website. Open source architecture.",
        link: "https://github.com/voidbornfr/voidanime",
        images: [
            "/projects/voidanime/Screenshot 2025-11-16 155613.png",
            "/projects/voidanime/Screenshot 2025-11-16 161845.png",
            "/projects/voidanime/Screenshot 2025-11-16 161853.png",
            "/projects/voidanime/Screenshot 2025-11-16 161909.png"
        ]
    },
    {
        id: "03",
        title: "VOID_LOOP",
        category: "APP DEVELOPMENT",
        description: "Ads-free music streaming app for both Windows and Android.",
        link: "https://github.com/voidbornfr/voidloop",
        images: [
            "/projects/voidloop/Screenshot 2025-12-08 151947.png",
            "/projects/voidloop/Screenshot 2025-12-08 152112.png",
            "/projects/voidloop/Screenshot 2025-12-08 152129.png"
        ]
    },
    {
        id: "04",
        title: "VOID_WEAR",
        category: "E-COMMERCE",
        description: "Premium print-on-demand clothing website with custom design tools.",
        link: "#", // No link provided
        images: [
            "/projects/voidwear/Screenshot 2025-12-08 151918.png",
            "/projects/voidwear/Screenshot 2025-12-08 153100.png"
        ]
    },
    {
        id: "05",
        title: "VOID_LEARN",
        category: "ED-TECH",
        description: "World's best notes, test, and exam generator website using AI.",
        link: "https://voidlearn.space",
        images: [
            "/projects/voidlearn/Screenshot 2025-12-08 151842.png",
            "/projects/voidlearn/Screenshot 2025-12-08 153638.png",
            "/projects/voidlearn/Screenshot 2025-12-08 153730.png"
        ]
    },
    {
        id: "06",
        title: "VOID_CRAFTS",
        category: "NO-CODE BUILDER",
        description: "One of the best no-coding portfolio builders with 24/7 chat and notes features.",
        link: "#", // No link provided
        images: [
            "/projects/voidcrafts/Screenshot 2025-12-08 151857.png",
            "/projects/voidcrafts/Screenshot 2025-12-08 153316.png",
            "/projects/voidcrafts/Screenshot 2025-12-08 153408.png"
        ]
    },
    {
        id: "07",
        title: "KOKU NO KO",
        category: "CONTENT CREATION",
        description: "YouTube channel with a family of 165k+ subscribers.",
        link: "https://www.youtube.com/channel/UCoLp4ibUQB_Xz-sSMTzLQxA",
        images: [
            "/projects/koku no ko/Screenshot 2025-12-08 152948.png"
        ]
    }
];

export default function ProjectsPage() {
    return (
        <>
            <SmoothScroll />
            <Navbar />

            <main className="min-h-screen bg-void-black text-white px-6 py-32 relative overflow-hidden">
                {/* Background Noise */}
                <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="mb-20 text-center"
                    >
                        <p className="text-sm font-mono text-text-muted mb-4 tracking-[0.4em] uppercase">The Archive</p>
                        <h1 className="text-6xl md:text-8xl font-bold font-heading tracking-tighter text-white mb-6">
                            VOID WORKS
                        </h1>
                    </motion.div>

                    {/* Projects Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {PROJECTS.map((project, index) => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className={`${index === 0 || index === 3 ? "md:col-span-2" : "md:col-span-1"}`} // Dynamic grid sizing
                            >
                                <ProjectCard project={project} index={index + 1} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>
        </>
    );
}
