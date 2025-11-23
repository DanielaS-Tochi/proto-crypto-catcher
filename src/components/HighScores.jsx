import React from 'react';

const HighScores = ({ scores }) => {
    return (
        <div className="border-t border-slate-700 pt-6 w-full">
            <h4 className="text-lg font-bold text-slate-300 mb-4">🏆 High Scores</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                {scores.length === 0 ? (
                    <p className="text-slate-500 text-sm">No scores yet.</p>
                ) : (
                    scores.map((entry, i) => (
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
    );
};

export default HighScores;
