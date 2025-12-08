"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Svg, Float } from "@react-three/drei";
import * as THREE from "three";

// Tech Stack Data with SimpleIcons Slugs
const techRings = [
    {
        radius: 10.0,
        speed: 0.6,
        items: [
            { name: "JS", slug: "javascript" },
            { name: "TS", slug: "typescript" },
            { name: "Python", slug: "python" },
            { name: "Rust", slug: "rust" },
            { name: "Dart", slug: "dart" },
            { name: "Flutter", slug: "flutter" }
        ]
    },
    {
        radius: 17.0,
        speed: 0.4,
        items: [
            { name: "React", slug: "react" },
            { name: "Next.js", slug: "nextdotjs" },
            { name: "Tailwind", slug: "tailwindcss" },
            { name: "Framer", slug: "framer" },
            { name: "Three.js", slug: "threedotjs" },
            { name: "GSAP", slug: "greensock" }
        ]
    },
    {
        radius: 24.0,
        speed: 0.25,
        items: [
            { name: "Node", slug: "nodedotjs" },
            { name: "Express", slug: "express" },
            { name: "Postgres", slug: "postgresql" },
            { name: "Mongo", slug: "mongodb" },
            { name: "Git", slug: "git" },
            { name: "Postman", slug: "postman" }, // representing APIs
            { name: "Discord", slug: "discord" }   // representing Bots
        ]
    },
];

function TechIcon({ slug, angle, radius }: { slug: string; angle: number; radius: number }) {
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const ref = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (ref.current) {
            ref.current.lookAt(state.camera.position);
        }
    });

    return (
        <group position={[x, 0, z]} ref={ref}>
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
                <Svg
                    src={`https://cdn.simpleicons.org/${slug}/FFFFFF`}
                    scale={[0.04, 0.04, 0.04]}
                    fillMaterial={{
                        wireframe: false,
                        color: "#FFFFFF",
                        opacity: 0.9,
                        transparent: true,
                        side: THREE.DoubleSide
                    }}
                />
            </Float>
        </group>
    );
}

function TechRing({ items, radius, baseSpeed, yOffset, index }: { items: { name: string; slug: string }[]; radius: number; baseSpeed: number; yOffset: number; index: number }) {
    const ref = useRef<THREE.Group>(null);

    // Living System Logic: Random speed variations and pauses
    // We use a ref to store current speed multiplier to avoid re-renders
    const speedMult = useRef(1);
    const timeToNextChange = useRef(Math.random() * 5 + 5); // 5-10 seconds initial delay
    const isPaused = useRef(false);

    useFrame((state, delta) => {
        if (ref.current) {
            // Update rotation
            if (!isPaused.current) {
                ref.current.rotation.y += delta * baseSpeed * 0.15 * speedMult.current * (index % 2 === 0 ? 1 : -1);
            }

            // Handle random behavior changes
            timeToNextChange.current -= delta;
            if (timeToNextChange.current <= 0) {
                const randomAction = Math.random();

                if (randomAction > 0.7) {
                    // Pause for a bit (30% chance)
                    isPaused.current = true;
                    timeToNextChange.current = Math.random() * 5 + 2; // Pause for 2-7s
                } else {
                    // Resume / Change Speed
                    isPaused.current = false;
                    // Random speed between 0.5x and 1.5x
                    speedMult.current = 0.5 + Math.random();
                    timeToNextChange.current = Math.random() * 8 + 4; // Maintain for 4-12s
                }
            }
        }
    });

    return (
        <group ref={ref} position={[0, yOffset, 0]}>
            {items.map((item, idx) => {
                const angle = (idx / items.length) * Math.PI * 2;
                return <TechIcon key={item.slug} slug={item.slug} angle={angle} radius={radius} />;
            })}
            {/* Orbit Ring Line */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[radius - 0.03, radius + 0.03, 128]} />
                <meshBasicMaterial color="#FFFFFF" opacity={0.05} transparent side={THREE.DoubleSide} />
            </mesh>
        </group>
    );
}

export default function PortalScene() {
    return (
        <group rotation={[Math.PI / 8, 0, 0]}>
            <ambientLight intensity={0.5} />
            <pointLight position={[0, 0, 0]} intensity={4} color="#FFFFFF" />

            {/* Tech Rings */}
            {techRings.map((ring, index) => (
                <TechRing
                    key={index}
                    index={index}
                    radius={ring.radius}
                    baseSpeed={ring.speed}
                    items={ring.items}
                    yOffset={(index - 1) * 0.8}
                />
            ))}

            {/* Background Particles */}
            <points>
                <sphereGeometry args={[30, 64, 64]} />
                <pointsMaterial color="#444444" size={0.02} transparent opacity={0.4} sizeAttenuation />
            </points>
        </group>
    );
}
