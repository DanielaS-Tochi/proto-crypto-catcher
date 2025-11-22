import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './context/WalletContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';

const Placeholder = ({ title }) => (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <h1 className="text-3xl font-bold">{title}</h1>
    </div>
);

function App() {
    return (
        <WalletProvider>
            <Router>
                <div className="min-h-screen bg-slate-900 text-white">
                    <Navbar />
                    <div className="pt-20"> {/* Add padding for fixed navbar */}
                        <Routes>
                            <Route path="/" element={<Landing />} />
                            <Route path="/play" element={<Placeholder title="Game Area (Coming Soon)" />} />
                            <Route path="/wallet" element={<Placeholder title="Wallet Connection (Coming Soon)" />} />
                            <Route path="/lessons" element={<Placeholder title="Lessons (Coming Soon)" />} />
                        </Routes>
                    </div>
                </div>
            </Router>
        </WalletProvider>
    );
}

export default App;
