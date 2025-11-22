import React, { useState, useEffect, useContext, useRef } from 'react';
import { WalletContext } from '../context/WalletContext';
import { GAME_ITEMS } from '../data/gameItems';

const Play = () => {
    const { isConnected, setGlobalPoints } = useContext(WalletContext);

    // Game State
    const [gameState, setGameState] = useState('idle'); // idle, playing, paused, gameOver
    const [score, setScore] = useState(0);
    const [items, setItems] = useState([]);
    const [feedback, setFeedback] = useState(null); // { text, type, x, y }
    const [highScores, setHighScores] = useState([]);

    // Refs for game loop
    const requestRef = useRef();
    const lastTimeRef = useRef();
    const spawnTimerRef = useRef(0);

    // Load High Scores
    useEffect(() => {
        const saved = localStorage.getItem('cryptoCatcherHighScores');
        if (saved) setHighScores(JSON.parse(saved));
    }, []);

    // Game Loop
    const animate = (time) => {
        if (gameState !== 'playing') return;

        if (lastTimeRef.current != undefined) {
            const deltaTime = time - lastTimeRef.current;

            // Spawn Items
            spawnTimerRef.current += deltaTime;
            if (spawnTimerRef.current > 1000) { // Spawn every 1s
                spawnItem();
                spawnTimerRef.current = 0;
            }

            // Move Items
            setItems(prevItems => {
                return prevItems
                    .map(item => ({ ...item, y: item.y + (item.speed * deltaTime / 16) }))
                    .filter(item => item.y < 100); // Remove if off screen
            });
        }

        lastTimeRef.current = time;
        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        if (gameState === 'playing') {
            requestRef.current = requestAnimationFrame(animate);
        } else {
            cancelAnimationFrame(requestRef.current);
            lastTimeRef.current = undefined;
        }
        return () => cancelAnimationFrame(requestRef.current);
    }, [gameState]);

    const spawnItem = () => {
        const randomItem = GAME_ITEMS[Math.floor(Math.random() * GAME_ITEMS.length)];
        const newItem = {
            ...randomItem,
            instanceId: Math.random(),
            x: Math.random() * 90 + 5, // 5-95%
            y: -10,
            speed: Math.random() * 0.5 + 0.2
        };
        setItems(prev => [...prev, newItem]);
    };

    const handleCatch = (item, e) => {
        e.stopPropagation();
        if (gameState !== 'playing') return;

        // Update Score
        const newScore = score + item.points;
        setScore(newScore);
        setGlobalPoints(prev => Math.max(0, prev + item.points));

        // Show Feedback
        setFeedback({
            text: item.info,
            type: item.type,
            x: e.clientX,
            y: e.clientY
        });
        setTimeout(() => setFeedback(null), 2000);

        // Remove Item
        setItems(prev => prev.filter(i => i.instanceId !== item.instanceId));
    };

    const startGame = () => {
        setScore(0);
        setGlobalPoints(0);
        setItems([]);
        setGameState('playing');
    };

    const pauseGame = () => setGameState(prev => prev === 'paused' ? 'playing' : 'paused');

    const stopGame = () => {
        setGameState('idle');
        saveHighScore();
        setItems([]);
    };

    const saveHighScore = () => {
        if (score > 0) {
            const newScores = [...highScores, { score, date: new Date().toLocaleDateString() }]
                .sort((a, b) => b.score - a.score)
                .slice(0, 5);
            setHighScores(newScores);
            localStorage.setItem('cryptoCatcherHighScores', JSON.stringify(newScores));
        }
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
            {/* Game UI Overlay */}
            <div className="absolute top-4 left-4 z-20">
                <h2 className="text-3xl font-bold text-white drop-shadow-md">Score: <span className="text-[#627EEA]">{score}</span></h2>
            </div>

            {/* Controls */}
            <div className="absolute top-4 right-4 z-20 flex gap-2">
                {gameState === 'idle' && (
                    <button onClick={startGame} className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full font-bold shadow-lg transition-transform hover:scale-105">
                        START GAME
                    </button>
                )}
                {(gameState === 'playing' || gameState === 'paused') && (
                    <>
                        <button onClick={pauseGame} className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full font-bold shadow-lg">
                            {gameState === 'paused' ? 'RESUME' : 'PAUSE'}
                        </button>
                        <button onClick={stopGame} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full font-bold shadow-lg">
                            STOP
                        </button>
                    </>
                )}
            </div>

            {/* Feedback Toast */}
            {feedback && (
                <div
                    className={`absolute z-30 px-4 py-2 rounded-lg shadow-xl text-sm font-bold animate-float pointer-events-none
                        ${feedback.type === 'good' ? 'bg-slate-800 text-green-400 border border-green-500' : 'bg-slate-800 text-red-400 border border-red-500'}
                    `}
                    style={{ top: feedback.y - 60, left: feedback.x }}
                >
                    {feedback.text}
                </div>
            )}

            {/* Game Area */}
            {items.map(item => (
                <div
                    key={item.instanceId}
                    onClick={(e) => handleCatch(item, e)}
                    className="absolute cursor-pointer transform -translate-x-1/2 hover:scale-125 transition-transform"
                    style={{
                        left: `${item.x}%`,
                        top: `${item.y}%`,
                        fontSize: '2.5rem'
                    }}
                >
                    {item.symbol}
                </div>
            ))}

            {/* Ranking / Idle Screen */}
            {gameState === 'idle' && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm z-10">
                    <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-2xl max-w-md w-full">
                        <h3 className="text-2xl font-bold text-white mb-6 text-center">🏆 High Scores</h3>
                        <div className="space-y-3">
                            {highScores.length === 0 ? (
                                <p className="text-slate-500 text-center">No scores yet. Start playing!</p>
                            ) : (
                                highScores.map((entry, i) => (
                                    <div key={i} className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                                        <span className="text-slate-300">#{i + 1}</span>
                                        <span className="text-white font-mono font-bold">{entry.score}</span>
                                        <span className="text-slate-500 text-xs">{entry.date}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(98,126,234,0.1),transparent_70%)]"></div>
        </div>
    );
};

export default Play;
