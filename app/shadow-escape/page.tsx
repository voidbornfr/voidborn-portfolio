"use client";

import React, { useState, useEffect, useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Environment, PerspectiveCamera, Stars, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// --- Game Constants & Types ---
const LANES = [-2, 0, 2]; // 3 Lanes
// TRACK_LENGTH is now just for initial buffer or render distance
const VISIBLE_TRACK_LENGTH = 100;
const PLAYER_SPEED_START = 10;
const SHADOW_SPEED_START = 10;
const CATCH_SPEED_BOOST = 1.2;

type GamePhase = "idle" | "countdown" | "chasing" | "lost";
type CharacterType = "male" | "female";

// --- Models ---
// (No change to models)

function ModelLoader({ url, isShadow = false }: { url: string, isShadow?: boolean }) {
    const { scene } = useGLTF(url);
    const clone = useMemo(() => {
        const c = scene.clone();
        c.traverse((node) => {
            if ((node as THREE.Mesh).isMesh) {
                const mesh = node as THREE.Mesh;
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                if (isShadow) {
                    mesh.material = new THREE.MeshStandardMaterial({
                        color: "black",
                        transparent: true,
                        opacity: 0.8,
                        roughness: 1,
                        emissive: "black"
                    });
                }
            }
        });
        // Standardize GLB scale (often metric 1 unit = 1m, checks out)
        // If user models are huge/tiny, adjust here. Start with 0.5.
        c.scale.set(0.5, 0.5, 0.5);
        // Rotation: GLBs often face +Z. We need -Z? 
        // Let's try Math.PI to rotate 180 deg if they face back.
        c.rotation.y = Math.PI;
        return c;
    }, [scene, isShadow]);

    return <primitive object={clone} />;
}

function PlayerModel({
    position,
    character,
    onClick,
    isShadow = false
}: {
    position: THREE.Vector3;
    character: CharacterType;
    onClick?: () => void;
    isShadow?: boolean
}) {
    // Encoded paths for safety
    const url = character === 'female'
        ? "/game/female%20player/girl-player.glb"
        : "/game/male%20player/male-player.glb";

    return (
        <group position={position} onClick={onClick}>
            <Suspense fallback={
                <mesh>
                    <boxGeometry args={[1, 2, 1]} />
                    <meshStandardMaterial color="gray" wireframe />
                </mesh>
            }>
                <ModelLoader url={url} isShadow={isShadow} />
            </Suspense>
            {/* Hitbox light - kept for effect */}
            {!isShadow && <pointLight distance={3} intensity={1} color="#00ffff" position={[0, 1, 0]} />}
        </group>
    );
}

const OBSTACLE_URLS = [
    "/game/obstacle/cylinder_obstacle.glb",
    "/game/obstacle/spoetted_cylinder_obstacle.glb"
];

function ObstacleModel({ position, typeIdx }: { position: [number, number, number], typeIdx: number }) {
    const url = OBSTACLE_URLS[typeIdx % OBSTACLE_URLS.length];

    return (
        <group position={position}>
            <Suspense fallback={<mesh><boxGeometry /><meshStandardMaterial color="red" wireframe /></mesh>}>
                <ObstacleLoader url={url} />
            </Suspense>
        </group>
    )
}

function ObstacleLoader({ url }: { url: string }) {
    const { scene } = useGLTF(url);
    const clone = useMemo(() => {
        const c = scene.clone();
        // Obstacles are MASSIVE. Reducing to extreme small scale.
        c.scale.set(0.005, 0.005, 0.005);
        c.traverse((node) => {
            if ((node as THREE.Mesh).isMesh) {
                (node as THREE.Mesh).castShadow = true;
            }
        });
        return c;
    }, [scene]);
    return <primitive object={clone} />;
}


// --- Components ---

function Ground({ playerZ }: { playerZ: number }) {
    // Procedural Road Texture (High Res)
    const texture = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d')!;

        // 1. Base Asphalt (Darker, slightly blue-ish tint for realism)
        ctx.fillStyle = '#111111';
        ctx.fillRect(0, 0, 1024, 1024);

        // 2. Heavy Noise / Grain
        for (let i = 0; i < 40000; i++) {
            const gray = Math.floor(Math.random() * 60); // 0-60
            ctx.fillStyle = `rgba(${gray},${gray},${gray},0.1)`;
            ctx.fillRect(Math.random() * 1024, Math.random() * 1024, 2, 2);
        }

        // 3. Lane Logic
        // Plane width = 20 units. Texture width = 1024px.
        // 1 unit = 51.2px.
        // Lanes at -2, 0, 2.
        // Center of texture = 512.
        // Left Lane Center = 512 - (2 * 51.2) = 409.6
        // Right Lane Center = 512 + (2 * 51.2) = 614.4

        // Lane Dividers (Between lanes) -> at -1 and +1.
        // -1 = 512 - 51.2 = 460.8
        // +1 = 512 + 51.2 = 563.2
        const dividerX_L = 512 - 51.2;
        const dividerX_R = 512 + 51.2;

        // 4. White Side Lines (Solid)
        // At -3.5 and +3.5 roughly? 
        // 3.5 * 51.2 = 179.2 offset.
        const sideX_L = 512 - 179.2;
        const sideX_R = 512 + 179.2;

        // Draw Side Lines
        ctx.fillStyle = '#dddddd';
        ctx.fillRect(sideX_L, 0, 10, 1024); // 10px wide
        ctx.fillRect(sideX_R, 0, 10, 1024);

        // Draw Dashed Dividers
        ctx.fillStyle = '#FFC107'; // Amber
        for (let y = 0; y < 1024; y += 80) { // Larger dashes
            ctx.fillRect(dividerX_L, y, 6, 40);
            ctx.fillRect(dividerX_R, y, 6, 40);
        }

        // 5. Subtle Tire Tracks in lanes (Darker strips)
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        // Center Lane
        ctx.fillRect(512 - 15, 0, 30, 1024);
        // Left Lane
        ctx.fillRect(409.6 - 15, 0, 30, 1024);
        // Right Lane
        ctx.fillRect(614.4 - 15, 0, 30, 1024);

        const t = new THREE.CanvasTexture(canvas);
        t.wrapS = THREE.RepeatWrapping;
        t.wrapT = THREE.RepeatWrapping;
        t.repeat.set(1, 5); // Still repeat, but texture is cleaner
        // Anisotropy helps with oblique viewing
        t.anisotropy = 16;
        return t;
    }, []);

    useFrame(() => {
        // Textures offset 0..1. 
        // Speed adjust: match playerZ. 1024px height.
        texture.offset.y = -(playerZ * 0.05) % 1;
    });

    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, playerZ]} receiveShadow>
            {/* Slightly raised to avoid z-fighting with generic ground if any? No, -0.05 is fine. */}
            <planeGeometry args={[20, VISIBLE_TRACK_LENGTH]} />
            <meshStandardMaterial
                map={texture}
                color="#ffffff"
                roughness={0.9} // Rough asphalt
                metalness={0.1}
            />
        </mesh>
    );
}

// ... (imports)

// ... (Ground component same)

function GameScene({
    phase,
    setPhase,
    gameTimeRef,
    playerRef,
    shadowRef,
    playerLane,
    shadowLane,
    setScore,
    speedMultiplierRef
}: {
    phase: GamePhase;
    setPhase: (p: GamePhase) => void;
    gameTimeRef: React.MutableRefObject<number>;
    playerRef: React.MutableRefObject<THREE.Vector3>;
    shadowRef: React.MutableRefObject<THREE.Vector3>;
    playerLane: React.MutableRefObject<number>;
    shadowLane: React.MutableRefObject<number>;
    setScore: (s: number) => void;
    speedMultiplierRef: React.MutableRefObject<number>;
}) {

    // Infinite Obstacles State
    const [activeObstacles, setActiveObstacles] = useState<{ id: number, vec: THREE.Vector3, typeIdx: number }[]>([]);
    const lastSpawnZ = useRef(20);
    const obstacleIdCounter = useRef(0);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (phase !== "chasing") return;

            // Reversed Controls: Left moves visually Left (Lane +1 from perspective? No wait)
            // Original: 0 (Left), 1 (Mid), 2 (Right)
            // Camera looks down -Z? No +Z is forward? 
            // Let's stick to what we just fixed:
            // Left Key -> Lane Index + 1 (Visually Left in inverted cam or specific setup?)
            // User said: "reverse controls". We did: Left -> min(2, +1). 
            // Wait, if 0 is left and 2 is right. Left Key should go to 0 (-1). 
            // The user asked to REVERSE because "click right moves left". 
            // So if "Left Key -> Lane - 1" made it go Right, then "Left Key -> Lane + 1" makes it go Left.
            // We will keep the logic we JUST WROTE in the previous step, assuming it is correct now.

            if (e.key === "ArrowLeft" || e.key === "a") {
                playerLane.current = Math.min(2, playerLane.current + 1);
            } else if (e.key === "ArrowRight" || e.key === "d") {
                playerLane.current = Math.max(0, playerLane.current - 1);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [phase, playerLane]);

    // ... (rest of update loop same)

    const shadowChangeTimer = useRef(0);

    // Consolidate Game Loop
    useFrame((state, delta) => {
        if (phase === "idle" || phase === "lost") return;

        if (phase === "chasing") {
            speedMultiplierRef.current += (0.01 * delta) / 2;
        }

        const currentSpeed = PLAYER_SPEED_START * speedMultiplierRef.current;
        const currentShadowSpeed = SHADOW_SPEED_START * speedMultiplierRef.current;

        if (phase === "countdown") {
            shadowRef.current.z += currentShadowSpeed * delta;

            shadowChangeTimer.current += delta;
            if (shadowChangeTimer.current > 1.5) {
                const move = Math.random() > 0.5 ? 1 : -1;
                const newLane = Math.max(0, Math.min(2, shadowLane.current + move));
                shadowLane.current = newLane;
                shadowChangeTimer.current = 0;
            }
        } else if (phase === "chasing") {
            shadowRef.current.z += currentShadowSpeed * delta;

            playerRef.current.z += currentSpeed * delta;

            const dist = Math.floor(playerRef.current.z);
            if (dist > 0) setScore(dist);

            if (lastSpawnZ.current < playerRef.current.z + VISIBLE_TRACK_LENGTH) {
                const spawnZ = lastSpawnZ.current + 6 + Math.random() * 8;
                lastSpawnZ.current = spawnZ;

                const laneIdx = Math.floor(Math.random() * 3);
                const x = LANES[laneIdx];
                const typeIdx = Math.floor(Math.random() * OBSTACLE_URLS.length);

                const newObs = {
                    id: obstacleIdCounter.current++,
                    vec: new THREE.Vector3(x, 0, spawnZ),
                    typeIdx
                };

                setActiveObstacles(prev => [...prev, newObs]);
            }
            setActiveObstacles(prev => prev.filter(o => o.vec.z > playerRef.current.z - 20));


            const playerPos = playerRef.current;
            const playerXTarget = LANES[playerLane.current];

            for (const obs of activeObstacles) {
                if (Math.abs(obs.vec.z - playerPos.z) < 1.0 && Math.abs(obs.vec.x - playerXTarget) < 0.5) {
                    setPhase("lost");
                }
            }
        }

        if (playerMesh.current) {
            const targetX = LANES[playerLane.current];
            playerMesh.current.position.x = THREE.MathUtils.lerp(playerMesh.current.position.x, targetX, delta * 15);
            playerMesh.current.position.z = playerRef.current.z;
        }

        if (shadowMesh.current) {
            const targetX = LANES[shadowLane.current];
            shadowMesh.current.position.x = THREE.MathUtils.lerp(shadowMesh.current.position.x, targetX, delta * 15);
            shadowMesh.current.position.z = shadowRef.current.z;
        }

        state.camera.position.z = playerRef.current.z - 8;
        state.camera.position.y = 4;
        state.camera.lookAt(0, 0, playerRef.current.z + 10);
    });

    const playerMesh = useRef<THREE.Group>(null);
    const shadowMesh = useRef<THREE.Group>(null);

    useFrame(() => {
        if (playerMesh.current && phase === 'chasing') {
        }
    })

    return (
        <>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 20, 10]} intensity={1} castShadow />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

            <Ground playerZ={playerRef.current.z} />

            <group ref={playerMesh}>
                {/* Ring - Always Cyan */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
                    <ringGeometry args={[0.3, 0.4, 32]} />
                    <meshBasicMaterial color="cyan" />
                </mesh>
                <pointLight distance={5} intensity={2} color="cyan" position={[0, 1, 0]} />
            </group>

            <group ref={shadowMesh} position={[0, 0, 5]}>
                <PlayerModel
                    position={new THREE.Vector3(0, 0, 0)}
                    character="male"
                    isShadow={true}
                />
            </group>

            {activeObstacles.map((obs) => (
                <ObstacleModel key={obs.id} position={[obs.vec.x, 0, obs.vec.z]} typeIdx={obs.typeIdx} />
            ))}
        </>
    );
}

export default function ShadowEscapePage() {
    const [phase, setPhase] = useState<GamePhase>("idle");
    const [countdown, setCountdown] = useState(5);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [gameKey, setGameKey] = useState(0);

    const gameTimeRef = useRef(0);
    const speedMultiplierRef = useRef(1.0);

    const playerRef = useRef(new THREE.Vector3(0, 0, 0));
    const shadowRef = useRef(new THREE.Vector3(0, 0, 10));
    const playerLane = useRef(1);
    const shadowLane = useRef(1);

    useEffect(() => {
        const stored = localStorage.getItem("void_shadow_highscore");
        if (stored) setHighScore(parseInt(stored));
    }, []);

    useEffect(() => {
        if (score > highScore) {
            setHighScore(score);
            localStorage.setItem("void_shadow_highscore", score.toString());
        }
    }, [score]);

    const resetGame = () => {
        setPhase("idle");
        playerRef.current.set(0, 0, 0);
        shadowRef.current.set(0, 0, 10);
        playerLane.current = 1;
        shadowLane.current = 1;
        setScore(0);
        speedMultiplierRef.current = 1.0;
        setCountdown(5);
        setGameKey(prev => prev + 1);
    };

    useEffect(() => {
        if (phase === "countdown") {
            const interval = setInterval(() => {
                setCountdown((c) => {
                    if (c <= 1) {
                        clearInterval(interval);
                        setPhase("chasing");
                        return 0;
                    }
                    return c - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        } else if (phase === 'idle') {
            setCountdown(5);
        }
    }, [phase]);

    return (
        <div className="w-full h-screen bg-black relative overflow-hidden font-sans text-white select-none touch-none">
            {/* UI HUD */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none">
                <div className="text-4xl font-black text-white glow">{score}m</div>
                <div className="text-sm text-gray-500">HI: {highScore}m</div>
            </div>

            {/* Mobile Touch Controls */}
            {phase === 'chasing' && (
                <>
                    <div
                        className="absolute top-0 left-0 w-1/2 h-full z-10"
                        onPointerDown={() => {
                            playerLane.current = Math.min(2, playerLane.current + 1);
                        }}
                    />
                    <div
                        className="absolute top-0 right-0 w-1/2 h-full z-10"
                        onPointerDown={() => {
                            playerLane.current = Math.max(0, playerLane.current - 1);
                        }}
                    />
                </>
            )}

            <Canvas shadows>
                <Suspense fallback={<Text position={[0, 0, -5]} color="white">Loading...</Text>}>
                    <PerspectiveCamera makeDefault position={[0, 4, -8]} fov={50} />
                    <GameScene
                        key={gameKey}
                        phase={phase}
                        setPhase={setPhase}
                        gameTimeRef={gameTimeRef}
                        playerRef={playerRef}
                        shadowRef={shadowRef}
                        playerLane={playerLane}
                        shadowLane={shadowLane}
                        setScore={setScore}
                        speedMultiplierRef={speedMultiplierRef}
                    />
                    <fog attach="fog" args={['#000000', 10, 80]} />
                </Suspense>
            </Canvas>

            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center z-10">
                <Link href="/" className="absolute top-8 left-8 pointer-events-auto flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    <span>Exit Void</span>
                </Link>

                <AnimatePresence mode="wait">
                    {phase === "idle" && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="text-center bg-black/50 backdrop-blur-md p-12 border border-white/10 rounded-2xl pointer-events-auto"
                        >
                            <h1 className="text-6xl font-black mb-4 tracking-tighter" style={{ textShadow: "0 0 30px rgba(0,255,255,0.5)" }}>
                                ENDLESS ESCAPE
                            </h1>
                            <button
                                onClick={() => setPhase('countdown')}
                                className="px-8 py-4 bg-white text-black font-bold text-xl rounded-full hover:bg-cyan-400 transition-all hover:scale-105 active:scale-95"
                            >
                                START RUN
                            </button>
                        </motion.div>
                    )}

                    {phase === "countdown" && (
                        <motion.div
                            key="countdown"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 1.5, opacity: 0 }}
                            className="text-center"
                        >
                            <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">
                                {countdown}
                            </div>
                        </motion.div>
                    )}

                    {phase === "chasing" && (
                        <div className="absolute top-10 right-10 text-right">
                            <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Status</div>
                            <div className="text-2xl font-bold text-cyan-400 glow">PURSUIT</div>
                        </div>
                    )}

                    {phase === "lost" && (
                        <motion.div
                            key="lost"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-center bg-red-900/20 backdrop-blur-xl p-12 border border-red-500/30 rounded-2xl pointer-events-auto"
                        >
                            <h2 className="text-5xl font-black text-red-500 mb-4">CRASHED</h2>
                            <div className="text-4xl text-white font-bold mb-4">{score}m</div>
                            <button
                                onClick={resetGame}
                                className="px-8 py-3 bg-white/10 border border-white/20 hover:bg-white hover:text-black transition-all rounded-full"
                            >
                                Retry
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
