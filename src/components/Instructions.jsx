import React from 'react';
import { GAME_ITEMS } from '../data/gameItems';

const Instructions = ({ onClose }) => {
    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative animate-float">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl font-bold"
                >
                    ✕
                </button>

                <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    How to Play
                </h2>

                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-xl font-semibold text-white mb-4">Mission</h3>
                        <p className="text-slate-300 mb-4">
                            Catch valuable Ethereum assets to build your score. Avoid bugs and hackers that drain your points!
                        </p>
                        <ul className="space-y-2 text-slate-400 text-sm">
                            <li>• Click items to catch them.</li>
                            <li>• Chain catches for <span className="text-yellow-400">Combo Multipliers</span>!</li>
                            <li>• Speed increases as you score higher.</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-white mb-4">Legend</h3>
                        <div className="space-y-3">
                            {GAME_ITEMS.map(item => (
                                <div key={item.id} className="flex items-center gap-3">
                                    <span className="text-2xl w-8 text-center">{item.symbol}</span>
                                    <div>
                                        <div className={`font-bold text-sm ${item.type === 'good' ? 'text-green-400' : 'text-red-400'}`}>
                                            {item.name} ({item.points > 0 ? '+' : ''}{item.points})
                                        </div>
                                        <div className="text-xs text-slate-500">{item.info}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-gradient-to-r from-[#627EEA] to-[#3747e9] hover:from-[#536bce] hover:to-[#2a36b1] text-white rounded-full font-bold shadow-lg transform hover:scale-105 transition-all"
                    >
                        Got it! Let's Play
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Instructions;
