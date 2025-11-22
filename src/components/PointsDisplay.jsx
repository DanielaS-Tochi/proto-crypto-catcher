import React, { useState, useEffect, useContext } from 'react';
import { WalletContext } from '../context/WalletContext';
import { ethers } from 'ethers';

// Placeholder ABI - will be replaced with real ABI import later
const LESSON_MANAGER_ABI = [
    "function points(address) view returns (uint256)"
];
// Placeholder Address - needs to be updated after deployment
const LESSON_MANAGER_ADDRESS = "0x0000000000000000000000000000000000000000";

const PointsDisplay = () => {
    const { globalPoints, isConnected } = useContext(WalletContext);

    if (!isConnected) return null;

    return (
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700">
            <span className="text-slate-400 text-sm uppercase tracking-wider font-semibold">Points</span>
            <span className="text-[#627EEA] font-bold text-lg">{globalPoints}</span>
        </div>
    );
};

export default PointsDisplay;
