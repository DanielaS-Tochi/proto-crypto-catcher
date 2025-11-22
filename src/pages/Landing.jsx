import React from 'react';
import { Link } from 'react-router-dom';
import EthereumLogo from '../components/EthereumLogo';

const Landing = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex flex-col items-center justify-center text-white p-4">
            <div className="animate-float mb-8">
                <EthereumLogo className="w-48 h-48 drop-shadow-[0_0_15px_rgba(98,126,234,0.5)]" />
            </div>

            <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                Proto Crypto Catcher
            </h1>

            <p className="text-xl text-gray-300 mb-12 max-w-md text-center">
                Master Solidity through interactive challenges.
                Build your own web3 future, one block at a time.
            </p>

            <Link
                to="/play"
                className="group relative px-8 py-4 bg-blue-600 rounded-full font-bold text-lg transition-all hover:bg-blue-500 hover:scale-105 hover:shadow-[0_0_20px_rgba(98,126,234,0.6)]"
            >
                Start Learning Ethereum
                <span className="absolute inset-0 rounded-full ring-2 ring-white/20 group-hover:ring-white/40 transition-all"></span>
            </Link>

            <div className="mt-16 grid grid-cols-3 gap-8 text-center text-sm text-gray-400">
                <div>
                    <div className="font-bold text-white mb-1">Learn</div>
                    Solidity Basics
                </div>
                <div>
                    <div className="font-bold text-white mb-1">Build</div>
                    Smart Contracts
                </div>
                <div>
                    <div className="font-bold text-white mb-1">Earn</div>
                    Crypto Knowledge
                </div>
            </div>
        </div>
    );
};

export default Landing;
