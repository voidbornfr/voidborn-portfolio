"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { useRef } from "react";

export default function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    const ref = useRef<HTMLDivElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

    function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        x.set(clientX - left);
        y.set(clientY - top);
    }

    return (
        <motion.div
            ref={ref}
            onMouseMove={onMouseMove}
            className={`group relative overflow-hidden ${className}`}
        >
            <motion.div
                style={{
                    background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(255,255,255,0.1),
              transparent 80%
            )
          `,
                }}
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
            />
            {children}
        </motion.div>
    );
}
