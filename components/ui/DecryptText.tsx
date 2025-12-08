"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const CHARS = "-_~=+*!@#%^&()[]{}|;:,.<>?/";

export default function DecryptText({
    text,
    speed = 50,
    maxIterations = 10,
    className = "",
    parentClassName = "",
    animateOnHover = true,
}: {
    text: string;
    speed?: number;
    maxIterations?: number;
    className?: string;
    parentClassName?: string;
    animateOnHover?: boolean;
}) {
    const [displayText, setDisplayText] = useState(text);
    const [isScrambling, setIsScrambling] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const scramble = () => {
        if (isScrambling) return;
        setIsScrambling(true);

        let iteration = 0;

        intervalRef.current = setInterval(() => {
            setDisplayText(
                text
                    .split("")
                    .map((char, index) => {
                        if (index < iteration) {
                            return text[index];
                        }
                        return CHARS[Math.floor(Math.random() * CHARS.length)];
                    })
                    .join("")
            );

            if (iteration >= text.length) {
                clearInterval(intervalRef.current!);
                setIsScrambling(false);
            }

            iteration += 1 / (maxIterations / 5);
        }, speed as number);
    };

    useEffect(() => {
        // Initial scramble on mount
        scramble();
        return () => clearInterval(intervalRef.current!);
    }, []);

    return (
        <motion.div
            className={parentClassName}
            onHoverStart={() => {
                if (animateOnHover) scramble();
            }}
        >
            <span className={className}>{displayText}</span>
        </motion.div>
    );
}
