import React, { useState, useEffect, useContext, useRef } from 'react';
import { WalletContext } from '../context/WalletContext';
import { GAME_ITEMS } from '../data/gameItems';
import Instructions from '../components/Instructions';
import HighScores from '../components/HighScores';
import GameControls from '../components/GameControls';
import { soundManager } from '../utils/SoundManager';

const Play = () => {
    const { isConnected, setGlobalPoints, account } = useContext(WalletContext);

    // Game State
    const [gameState, setGameState] = useState('idle');
    const [score, setScore] = useState(0);
    const [items, setItems] = useState([]);
    const [feedback, setFeedback] = useState(null);
    const [highScores, setHighScores] = useState([]);
    const [showInstructions, setShowInstructions] = useState(false);

    // V3 Features
    const [username, setUsername] = useState('');
    const [combo, setCombo] = useState(0);
    const [difficulty, setDifficulty] = useState(1);

    // V4 Features
    const [timeLeft, setTimeLeft] = useState(60);
    const [discoveredItems, setDiscoveredItems] = useState([]);
    const [firstCatchItem, setFirstCatchItem] = useState(null);
    const [levelUp, setLevelUp] = useState(false);
    const [isMuted, setIsMuted] = useState(soundManager.muted);

    // Refs
    const requestRef = useRef();
    const lastTimeRef = useRef();
    const spawnTimerRef = useRef(0);

    // Load High Scores & Username
    useEffect(() => {
        const savedScores = localStorage.getItem('cryptoCatcherHighScores');
        if (savedScores) setHighScores(JSON.parse(savedScores));

        const savedDiscovered = localStorage.getItem('cryptoCatcherDiscovered');
        if (savedDiscovered) setDiscoveredItems(JSON.parse(savedDiscovered));
    }, []);

    // Keyboard Controls
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === 'Space') {
                if (gameState === 'playing' || gameState === 'paused') {
                    pauseGame();
                }
            } else if (e.code === 'Enter') {
                if (gameState === 'idle' || gameState === 'gameOver') {
                    startGame();
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameState, username]);

    // Timer Logic
    useEffect(() => {
        let timer;
        if (gameState === 'playing' && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        endGame();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [gameState, timeLeft]);

    // Dynamic Difficulty & Level Up
    useEffect(() => {
        const newDifficulty = 1 + Math.floor(score / 100) * 0.1;
        if (newDifficulty > difficulty) {
            setDifficulty(Math.min(newDifficulty, 3));
            setLevelUp(true);
            soundManager.playLevelUp();
            setTimeout(() => setLevelUp(false), 2000);
        }
    }, [score]);

    // Game Loop
    const animate = (time) => {
        if (gameState !== 'playing') return;

        if (lastTimeRef.current != undefined) {
            const deltaTime = time - lastTimeRef.current;

            spawnTimerRef.current += deltaTime * difficulty;
            if (spawnTimerRef.current > 1000) {
                spawnItem();
                spawnTimerRef.current = 0;
            }

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

        // First Catch Logic
        if (!discoveredItems.includes(item.id)) {
            setGameState('firstCatch');
            setFirstCatchItem(item);
            const newDiscovered = [...discoveredItems, item.id];
            setDiscoveredItems(newDiscovered);
            localStorage.setItem('cryptoCatcherDiscovered', JSON.stringify(newDiscovered));
            return;
        }

        processCatch(item, e.clientX, e.clientY);
    };

    const processCatch = (item, x, y) => {
        let points = item.points;
        let feedbackText = item.info;
        let feedbackType = item.type;

        if (item.type === 'good') {
            soundManager.playCatchGood();
            const newCombo = combo + 1;
            setCombo(newCombo);
            const multiplier = 1 + (Math.floor(newCombo / 5) * 0.1);
            points = Math.ceil(points * multiplier);
            if (multiplier > 1) feedbackText += ` (x${multiplier.toFixed(1)})`;
        } else {
            soundManager.playCatchBad();
            setCombo(0);
        }

        const newScore = score + points;
        setScore(newScore);
        setGlobalPoints(prev => Math.max(0, prev + points));

        setFeedback({ text: feedbackText, type: feedbackType, x, y });
        setTimeout(() => setFeedback(null), 4000);

        setItems(prev => prev.filter(i => i.instanceId !== item.instanceId));
    };

    const resumeFromFirstCatch = () => {
        if (firstCatchItem) {
            processCatch(firstCatchItem, window.innerWidth / 2, window.innerHeight / 2);
            setFirstCatchItem(null);
            setGameState('playing');
        }
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
        setTimeLeft(60);
        setItems([]);
        setGameState('playing');
    };

    const endGame = () => {
        setGameState('gameOver');
        soundManager.playGameOver();
        saveHighScore();
        setItems([]);
    };

    const pauseGame = () => {
        setGameState(prev => {
            if (prev === 'paused') {
                return 'playing';
            } else {
                return 'paused';
            }
        });
    };

    const stopGame = () => {
        setGameState('idle');
        saveHighScore();
        setItems([]);
        setUsername(''); // Clear username for next game
    };

    const toggleMute = () => {
        const muted = soundManager.toggleMute();
        setIsMuted(muted);
    };

    const saveHighScore = () => {
        if (score > 0) {
            const newEntry = {
                name: username || (account ? account.substring(0, 6) : "Guest"),
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

    return (
        <div className="relative w-full h-[calc(100vh-80px)] overflow-hidden bg-slate-900">
            {/* UI Overlay */}
            <div className="absolute top-4 left-4 z-20 pointer-events-none">
                <h2 className="text-3xl font-bold text-white drop-shadow-md">Score: <span className="text-[#627EEA]">{score}</span></h2>
                {combo > 1 && (
                    <div className="text-yellow-400 font-bold text-xl animate-pulse">
                        Combo x{combo}!
                    </div>
                )}
                {levelUp && (
                    <div className="text-green-400 font-bold text-2xl animate-bounce mt-2">
                        LEVEL UP! 🚀
                    </div>
                )}
            </div>

            {/* Impressive Timer - Only During Gameplay */}
            {(gameState === 'playing' || gameState === 'paused') && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none">
                    <div className={`px-8 py-4 rounded-2xl backdrop-blur-xl border-2 transition-all duration-300 shadow-2xl ${timeLeft < 10
                        ? 'bg-gradient-to-r from-red-500/30 to-orange-500/30 border-red-400 shadow-red-500/50 animate-pulse'
                        : 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-400/50 shadow-blue-500/30'
                        }`}>
                        <div className="flex items-center gap-3">
                            <svg className={`w-7 h-7 ${timeLeft < 10 ? 'text-red-300' : 'text-blue-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="flex flex-col">
                                <span className="text-xs text-slate-300 font-medium uppercase tracking-wider">Time Left</span>
                                <span className={`text-3xl font-black font-mono ${timeLeft < 10 ? 'text-red-200' : 'text-white'
                                    }`}>
                                    {timeLeft}s
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Controls */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-12">
                <button
                    onClick={toggleMute}
                    className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-full font-bold shadow-lg transition-transform hover:scale-105"
                >
                    {isMuted ? '🔇' : '🔊'}
                </button>
                <GameControls
                    gameState={gameState}
                    onStart={startGame}
                    onPause={pauseGame}
                    onStop={stopGame}
                    onShowRules={() => setShowInstructions(true)}
                />
            </div>

            {/* Feedback Toast */}
            {feedback && (
                <div
                    className={`absolute z-30 px-6 py-3 rounded-xl shadow-2xl text-base font-bold animate-float pointer-events-none
                        ${feedback.type === 'good' ? 'bg-slate-800 text-green-400 border-2 border-green-500' : 'bg-slate-800 text-red-400 border-2 border-red-500'}
                    `}
                    style={{ top: feedback.y - 80, left: feedback.x }}
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

            {/* First Catch Overlay */}
            {gameState === 'firstCatch' && firstCatchItem && (
                <div className="fixed inset-0 flex items-center justify-center bg-slate-900/90 backdrop-blur-md z-[200] p-4">
                    <div className="bg-slate-800 p-8 rounded-2xl border-2 border-[#627EEA] shadow-2xl max-w-md text-center animate-bounce-in">
                        <div className="text-6xl mb-4">{firstCatchItem.symbol}</div>
                        <h2 className="text-3xl font-bold text-white mb-2">New Discovery!</h2>
                        <h3 className={`text-xl font-bold mb-4 ${firstCatchItem.type === 'good' ? 'text-green-400' : 'text-red-400'}`}>
                            {firstCatchItem.name}
                        </h3>
                        <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                            {firstCatchItem.info}
                        </p>
                        <button
                            onClick={resumeFromFirstCatch}
                            className="px-8 py-3 bg-[#627EEA] hover:bg-[#536bce] text-white rounded-full font-bold shadow-lg transform hover:scale-105 transition-all"
                        >
                            Got it! (+{firstCatchItem.points} pts)
                        </button>
                    </div>
                </div>
            )}

            {/* Game Over Screen */}
            {gameState === 'gameOver' && (
                <div className="fixed inset-0 flex items-center justify-center bg-slate-900/90 backdrop-blur-md z-40 p-4">
                    <div className="text-center">
                        <h2 className="text-5xl font-bold text-white mb-4">Time's Up!</h2>
                        <p className="text-2xl text-slate-300 mb-8">Final Score: <span className="text-[#627EEA] font-bold">{score}</span></p>
                        <div className="flex gap-4 justify-center">
                            <button onClick={startGame} className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full font-bold shadow-lg transform hover:scale-105 transition-all">
                                Play Again
                            </button>
                            <button onClick={() => setGameState('idle')} className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-full font-bold shadow-lg">
                                Menu
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Idle / Ranking Screen (Compact & Fixed) */}
            {gameState === 'idle' && (
                <div className="fixed inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm z-10 p-4 pt-20 overflow-y-auto">
                    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-2xl max-w-sm w-full text-center my-auto">
                        <h3 className="text-xl font-bold text-white mb-4">Ready to Catch?</h3>

                        <div className="mb-4">

                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username"
                                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#627EEA]"
                            />
                        </div>

                        <button onClick={startGame} className="w-full px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full font-bold shadow-lg transition-transform hover:scale-105 mb-4">
                            START GAME
                        </button>

                        <button
                            onClick={() => {
                                localStorage.removeItem('cryptoCatcherDiscovered');
                                setDiscoveredItems([]);
                                alert("Learning progress reset!");
                            }}
                            className="text-slate-500 hover:text-slate-300 text-xs underline mb-4 block"
                        >
                            Reset Learning
                        </button>

                        <HighScores scores={highScores} />
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
