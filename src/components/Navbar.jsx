import React from 'react';
import { Link } from 'react-router-dom';
import ConnectWallet from './ConnectWallet';
import PointsDisplay from './PointsDisplay';

const Navbar = () => {
    return (
        <nav className="w-full flex items-center justify-between px-8 py-4 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 fixed top-0 z-50">
            <div className="flex items-center gap-8">
                <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
                    Crypto Catcher
                </Link>
                <div className="hidden md:flex items-center gap-6 text-slate-400 font-medium">
                    <Link to="/play" className="hover:text-white transition-colors">Play</Link>
                    <Link to="/rules" className="hover:text-white transition-colors">Rules</Link>
                    <Link to="/lessons" className="hover:text-white transition-colors">Lessons</Link>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <PointsDisplay />
                <ConnectWallet />
            </div>
        </nav>
    );
};

export default Navbar;
