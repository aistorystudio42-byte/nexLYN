'use client'

export default function Background() {
    return (
        <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-background">
            {/* Base Vignette */}
            <div className="vignette-overlay" />

            {/* Animated Mesh Gradient - Optimized */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] rounded-full bg-crimson/10 blur-[60px] animate-mesh-1" />
                <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] rounded-full bg-bronze/10 blur-[80px] animate-mesh-2" />
            </div>

            {/* Amber Fog */}
            <div className="amber-fog" />

            <style jsx>{`
                @keyframes mesh-1 {
                    0% { transform: translate(0, 0); }
                    50% { transform: translate(5%, 5%); }
                    100% { transform: translate(0, 0); }
                }
                @keyframes mesh-2 {
                    0% { transform: translate(0, 0); }
                    50% { transform: translate(-5%, -5%); }
                    100% { transform: translate(0, 0); }
                }
                .animate-mesh-1 { animation: mesh-1 20s ease-in-out infinite; }
                .animate-mesh-2 { animation: mesh-2 25s ease-in-out infinite; }
            `}</style>

        </div>
    )
}

