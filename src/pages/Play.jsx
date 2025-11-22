import React, { useState, useEffect, useContext, useRef } from 'react';
import { WalletContext } from '../context/WalletContext';
import { GAME_ITEMS } from '../data/gameItems';
import Instructions from '../components/Instructions';

const Play = () => {
    const { isConnected, setGlobalPoints, account } = useContext(WalletContext);

    // Game State
    const [gameState, setGameState] = useState('idle'); // idle, playing, paused, gameOver
    const [score, setScore] = useState(0);
    const [items, setItems] = useState([]);
    const [feedback, setFeedback] = useState(null);
    const [highScores, setHighScores] = useState([]);
    const [showInstructions, setShowInstructions] = useState(false);

    // V3 Features
    const [username, setUsername] = useState('');
    const [combo, setCombo] = useState(0);
    const [difficulty, setDifficulty] = useState(1); // Multiplier for speed/spawn

    // Refs
    const requestRef = useRef();
    const lastTimeRef = useRef();
    const spawnTimerRef = useRef(0);

    // Load High Scores & Username
    useEffect(() => {
        const savedScores = localStorage.getItem('cryptoCatcherHighScores');
        if (savedScores) setHighScores(JSON.parse(savedScores));

        const savedName = localStorage.getItem('cryptoCatcherUsername');
        if (savedName) setUsername(savedName);
    }, []);

    // Dynamic Difficulty & Combo Logic
    useEffect(() => {
        // Increase difficulty every 100 points
        const newDifficulty = 1 + Math.floor(score / 100) * 0.1;
        setDifficulty(Math.min(newDifficulty, 3)); // Cap at 3x speed
    }, [score]);

    // Game Loop
    const animate = (time) => {
        if (gameState !== 'playing') return;

        if (lastTimeRef.current != undefined) {
            const deltaTime = time - lastTimeRef.current;

            // Spawn Items (Rate increases with difficulty)
            spawnTimerRef.current += deltaTime * difficulty;
            if (spawnTimerRef.current > 1000) {
                spawnItem();
                spawnTimerRef.current = 0;
            }

            // Move Items (Speed increases with difficulty)
            setItems(prevItems => {
                return prevItems
                    .map(item => ({ ...item, y: item.y + (item.speed * difficulty * deltaTime / 16) }))
                    .filter(item => item.y < 100);
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
            x: Math.random() * 90 + 5,
            y: -10,
            speed: Math.random() * 0.5 + 0.2
        };
        setItems(prev => [...prev, newItem]);
    };

    const handleCatch = (item, e) => {
        e.stopPropagation();
        if (gameState !== 'playing') return;

        let points = item.points;

        if (item.type === 'good') {
            // Combo Logic
            const newCombo = combo + 1;
            setCombo(newCombo);

            // Apply Combo Multiplier (e.g., 5x combo = 1.5x points)
            const multiplier = 1 + (Math.floor(newCombo / 5) * 0.1);
            points = Math.ceil(points * multiplier);

            setFeedback({
                text: `${item.info} ${multiplier > 1 ? `(x${multiplier.toFixed(1)})` : ''}`,
                type: 'good',
                x: e.clientX,
                y: e.clientY
            });
        } else {
            // Reset Combo on bad item
            setCombo(0);
            setFeedback({
                text: item.info,
                type: 'bad',
                x: e.clientX,
                y: e.clientY
            });
        }

        // Update Score
        const newScore = score + points;
        setScore(newScore);
        setGlobalPoints(prev => Math.max(0, prev + points));

        setTimeout(() => setFeedback(null), 2000);
        setItems(prev => prev.filter(i => i.instanceId !== item.instanceId));
    };

    const startGame = () => {
        if (!username.trim()) {
            alert("Please enter a username!");
            return;
        }
        localStorage.setItem('cryptoCatcherUsername', username);
        setScore(0);
        setGlobalPoints(0);
        setCombo(0);
        setDifficulty(1);
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
            const newEntry = {
                name: username || account.substring(0, 6),
                score,
                date: new Date().toLocaleDateString()
            };
            const newScores = [...highScores, newEntry]
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
            {/* UI Overlay */}
            <div className="absolute top-4 left-4 z-20">
                <h2 className="text-3xl font-bold text-white drop-shadow-md">Score: <span className="text-[#627EEA]">{score}</span></h2>
                {combo > 1 && (
                    <div className="text-yellow-400 font-bold text-xl animate-pulse">
                        Combo x{combo}!
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="absolute top-4 right-4 z-20 flex gap-2">
                {gameState === 'idle' && (
                    <button onClick={() => setShowInstructions(true)} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-full font-bold shadow-lg">
                        ❓ Rules
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

            {/* Idle / Ranking Screen */}
            {gameState === 'idle' && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm z-10">
                    <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-2xl max-w-md w-full text-center">
                        <h3 className="text-2xl font-bold text-white mb-6">Ready to Catch?</h3>

                        <div className="mb-6">
                            <label className="block text-slate-400 text-sm mb-2">Enter your Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="CryptoMaster"
                                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#627EEA]"
                            />
                        </div>

                        <button onClick={startGame} className="w-full px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full font-bold shadow-lg transition-transform hover:scale-105 mb-8">
                            START GAME
                        </button>

                        <div className="border-t border-slate-700 pt-6">
                            <h4 className="text-lg font-bold text-slate-300 mb-4">🏆 High Scores</h4>
                            <div className="space-y-2">
                                {highScores.length === 0 ? (
                                    <p className="text-slate-500 text-sm">No scores yet.</p>
                                ) : (
                                    highScores.map((entry, i) => (
                                        <div key={i} className="flex justify-between items-center p-2 bg-slate-700/30 rounded">
                                            <div className="flex items-center gap-2">
                                                <span className="text-slate-400 text-sm">#{i + 1}</span>
                                                <span className="text-white font-bold text-sm">{entry.name}</span>
                                            </div>
                                            <span className="text-[#627EEA] font-mono font-bold">{entry.score}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Instructions Modal */}
            {showInstructions && <Instructions onClose={() => setShowInstructions(false)} />}

            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(98,126,234,0.1),transparent_70%)]"></div>
        </div>
    );
};

export default Play;
