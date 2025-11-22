import React, { useState, useEffect, useContext } from 'react';
import { WalletContext } from '../context/WalletContext';

const Play = () => {
    const { isConnected } = useContext(WalletContext);
    const [score, setScore] = useState(0);
    const [target, setTarget] = useState({ x: 50, y: 50, visible: false });

    useEffect(() => {
        if (!isConnected) return;

        const interval = setInterval(() => {
            spawnTarget();
        }, 2000); // Spawn every 2 seconds

        return () => clearInterval(interval);
    }, [isConnected]);

    const spawnTarget = () => {
        const x = Math.random() * 80 + 10; // Keep within 10-90%
        const y = Math.random() * 80 + 10;
        setTarget({ x, y, visible: true });
    };

    const handleCatch = () => {
        if (!target.visible) return;
        setScore(s => s + 10);
        setTarget(prev => ({ ...prev, visible: false }));
        // In a real app, we would call the contract here or batch updates
        console.log("Caught! +10 points");
    };

    if (!isConnected) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Connect Wallet to Play
                </h1>
                <p className="text-slate-400 max-w-md">
                    You need an Ethereum wallet to access the Crypto Catcher game and earn on-chain points.
                </p>
            </div>
        );
    }

    return (
        <div className="relative w-full h-[calc(100vh-80px)] overflow-hidden bg-slate-900">
            <div className="absolute top-4 left-4 z-10">
                <h2 className="text-2xl font-bold text-white">Session Score: <span className="text-[#627EEA]">{score}</span></h2>
                <p className="text-slate-500 text-sm">Catch the floating ether!</p>
            </div>

            {target.visible && (
                <button
                    onClick={handleCatch}
                    style={{ top: `${target.y}%`, left: `${target.x}%` }}
                    className="absolute w-16 h-16 transform -translate-x-1/2 -translate-y-1/2 
                             bg-gradient-to-br from-[#627EEA] to-[#3747e9] rounded-full shadow-lg shadow-blue-500/50
                             animate-bounce hover:scale-110 transition-transform cursor-pointer flex items-center justify-center"
                >
                    <span className="text-2xl">💎</span>
                </button>
            )}

            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(98,126,234,0.1),transparent_70%)]"></div>
        </div>
    );
};

export default Play;
