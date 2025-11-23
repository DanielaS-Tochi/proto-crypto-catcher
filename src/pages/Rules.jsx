import React, { useState } from 'react';
import { GAME_ITEMS } from '../data/gameItems';

const Rules = () => {
    const [activeTab, setActiveTab] = useState('rules'); // 'rules' or 'glossary'

    return (
        <div className="min-h-[calc(100vh-80px)] bg-slate-900 flex flex-col items-center px-4 py-8">
            <div className="max-w-4xl w-full">
                <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Game Guide
                </h1>

                <div className="flex justify-center mb-8 border-b border-slate-700">
                    <button
                        onClick={() => setActiveTab('rules')}
                        className={`px-6 py-3 font-bold text-lg transition-colors border-b-2 ${activeTab === 'rules'
                            ? 'text-blue-400 border-blue-400'
                            : 'text-slate-400 border-transparent hover:text-white'
                            }`}
                    >
                        How to Play
                    </button>
                    <button
                        onClick={() => setActiveTab('glossary')}
                        className={`px-6 py-3 font-bold text-lg transition-colors border-b-2 ${activeTab === 'glossary'
                            ? 'text-blue-400 border-blue-400'
                            : 'text-slate-400 border-transparent hover:text-white'
                            }`}
                    >
                        Item Glossary
                    </button>
                </div>

                {activeTab === 'rules' && (
                    <div className="grid md:grid-cols-2 gap-8 animate-fade-in">
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-4">Mission</h3>
                            <p className="text-slate-300 mb-6 leading-relaxed">
                                Catch valuable Ethereum assets to build your score. Avoid bugs and hackers that drain your points!
                            </p>
                            <div className="space-y-4 bg-slate-800 p-6 rounded-xl border border-slate-700">
                                <div className="flex items-center gap-3 text-slate-200">
                                    <span className="text-2xl">⏱️</span>
                                    <span>You have <strong>60 seconds</strong> to score high.</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-200">
                                    <span className="text-2xl">🔥</span>
                                    <span>Chain catches for <strong>Combo Multipliers</strong>!</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-200">
                                    <span className="text-2xl">🚀</span>
                                    <span>Speed increases as your score rises.</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col justify-center items-center text-center bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl border border-slate-700">
                            <div className="text-6xl mb-4">🎓</div>
                            <h3 className="text-xl font-bold text-white mb-2">Learn as you Play</h3>
                            <p className="text-slate-400 text-sm">
                                The first time you catch a new item, the game will pause to explain what it is.
                                <br /><br />
                                Check the <strong>Glossary</strong> tab to review everything you've discovered!
                            </p>
                        </div>
                    </div>
                )}

                {activeTab === 'glossary' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
                        {GAME_ITEMS.map(item => (
                            <div
                                key={item.id}
                                className={`p-4 rounded-xl border transition-transform hover:scale-105 ${item.type === 'good'
                                    ? 'bg-slate-800 border-slate-600 hover:border-green-500/50'
                                    : 'bg-red-900/10 border-red-900/30 hover:border-red-500/50'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-4xl">{item.symbol}</span>
                                    <span className={`font-bold ${item.type === 'good' ? 'text-green-400' : 'text-red-400'}`}>
                                        {item.points > 0 ? '+' : ''}{item.points}
                                    </span>
                                </div>
                                <h4 className="text-lg font-bold text-white mb-1">{item.name}</h4>
                                <p className="text-slate-400 text-sm leading-snug">{item.info}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Rules;
