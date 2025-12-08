import BackgroundFX from "@/components/layout/BackgroundFX";
import Navbar from "@/components/layout/Navbar";
import HeroGateway from "@/components/home/HeroGateway";

export default function Home() {
  return (
    <main className="min-h-screen relative font-sans selection:bg-neon-violet selection:text-white overflow-x-hidden">
      <BackgroundFX />
      <Navbar />

      <div className="relative z-10">
        <HeroGateway />
      </div>
    </main>
  );
}
