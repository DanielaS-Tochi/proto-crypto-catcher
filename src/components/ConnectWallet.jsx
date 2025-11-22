import React, { useContext, useState, useRef, useEffect } from 'react';
import { WalletContext } from '../context/WalletContext';

const ConnectWallet = () => {
    const { account, connectWallet, disconnectWallet, changeAccount, isConnected } = useContext(WalletContext);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const formatAddress = (addr) => {
        return addr ? `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}` : '';
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (isConnected) {
        return (
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 border border-slate-700 text-slate-300 hover:border-[#627EEA] hover:text-white transition-all duration-200"
                >
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="font-mono text-sm">{formatAddress(account)}</span>
                </button>

                {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-50">
                        <div className="px-4 py-3 border-b border-slate-700">
                            <p className="text-xs text-slate-400">Connected as</p>
                            <p className="text-sm font-mono text-white truncate">{account}</p>
                        </div>
                        <button
                            onClick={() => {
                                changeAccount();
                                setShowDropdown(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 transition-colors border-b border-slate-700"
                        >
                            Change Account
                        </button>
                        <button
                            onClick={() => {
                                disconnectWallet();
                                setShowDropdown(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700 transition-colors"
                        >
                            Disconnect
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <button
            onClick={connectWallet}
            className="flex items-center justify-center px-6 py-2 rounded-full font-medium transition-all duration-200 bg-gradient-to-r from-[#627EEA] to-[#3747e9] hover:from-[#536bce] hover:to-[#2a36b1] text-white shadow-lg hover:shadow-[#627EEA]/50 transform hover:-translate-y-0.5"
        >
            <span>Connect Wallet</span>
        </button>
    );
};

export default ConnectWallet;
