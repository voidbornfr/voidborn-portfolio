"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Sparkles } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function AnimatedStars() {
    const starsRef = useRef<THREE.Group>(null);

    useFrame((state, delta) => {
        if (starsRef.current) {
            starsRef.current.rotation.y += delta * 0.02;
        }
    });

    return (
        <group ref={starsRef}>
            <Stars radius={100} depth={50} count={7000} factor={4} saturation={0} fade speed={1} />
        </group>
    );
}

export default function BackgroundFX() {
    return (
        <div className="fixed inset-0 -z-10 bg-void pointer-events-none">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <AnimatedStars />
                <Sparkles count={300} size={1} color="#FFFFFF" opacity={0.3} scale={15} speed={0.2} />
            </Canvas>
            {/* Gradient overlay for depth */}
            <div className="absolute inset-0 bg-void/20 pointer-events-none" />
        </div>
    );
}
