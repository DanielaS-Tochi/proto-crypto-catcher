import React, { useContext } from 'react';
import { WalletContext } from '../context/WalletContext';

const ConnectWallet = () => {
    const { account, connectWallet, isConnected } = useContext(WalletContext);

    const formatAddress = (addr) => {
        return addr ? `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}` : '';
    };

    return (
        <button
            onClick={connectWallet}
            className={`
                flex items-center justify-center px-6 py-2 rounded-full font-medium transition-all duration-200
                ${isConnected
                    ? 'bg-slate-800 text-slate-300 cursor-default border border-slate-700'
                    : 'bg-[#627EEA] hover:bg-[#536bce] text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                }
            `}
            disabled={isConnected}
        >
            {isConnected ? (
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    {formatAddress(account)}
                </div>
            ) : (
                <div className="flex items-center gap-2">
                    <span>Connect Wallet</span>
                </div>
            )}
        </button>
    );
};

export default ConnectWallet;
