import React, { createContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
    const [account, setAccount] = useState(null);
    const [provider, setProvider] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [globalPoints, setGlobalPoints] = useState(0);

    useEffect(() => {
        // Silent check on load - only connects if already authorized
        checkConnection();
    }, []);

    const checkConnection = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                if (accounts.length > 0) {
                    handleAccountChanged(accounts[0]);
                }
            } catch (error) {
                console.error("Error checking connection:", error);
            }
        }
    };

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                handleAccountChanged(accounts[0]);
            } catch (error) {
                console.error("Error connecting wallet:", error);
            }
        } else {
            alert("Please install MetaMask!");
        }
    };

    const changeAccount = async () => {
        if (window.ethereum) {
            try {
                await window.ethereum.request({
                    method: "wallet_requestPermissions",
                    params: [{ eth_accounts: {} }]
                });
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                handleAccountChanged(accounts[0]);
            } catch (error) {
                console.error("Error changing account:", error);
            }
        }
    };

    const handleAccountChanged = (newAccount) => {
        setAccount(newAccount);
        setIsConnected(true);
        const newProvider = new ethers.BrowserProvider(window.ethereum);
        setProvider(newProvider);
    };

    const disconnectWallet = () => {
        setAccount(null);
        setProvider(null);
        setIsConnected(false);
        setGlobalPoints(0);
    };

    return (
        <WalletContext.Provider value={{
            account,
            provider,
            isConnected,
            connectWallet,
            disconnectWallet,
            changeAccount,
            globalPoints,
            setGlobalPoints
        }}>
            {children}
        </WalletContext.Provider>
    );
};
