import React from 'react';

const GameControls = ({ gameState, onStart, onPause, onStop, onShowRules }) => {
    return (
        <div className="absolute top-4 right-4 z-20 flex gap-2">
            {gameState === 'idle' && (
                <button
                    onClick={onShowRules}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-full font-bold shadow-lg transition-transform hover:scale-105"
                >
                    ❓ Rules
                </button>
            )}
            {(gameState === 'playing' || gameState === 'paused') && (
                <>
                    <button
                        onClick={onPause}
                        className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full font-bold shadow-lg transition-transform hover:scale-105"
                    >
                        {gameState === 'paused' ? 'RESUME' : 'PAUSE'}
                    </button>
                    <button
                        onClick={onStop}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full font-bold shadow-lg transition-transform hover:scale-105"
                    >
                        STOP
                    </button>
                </>
            )}
        </div>
    );
};

export default GameControls;
