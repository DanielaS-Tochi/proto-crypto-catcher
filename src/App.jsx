import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './context/WalletContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Play from './pages/Play';
import Rules from './pages/Rules';
import Lessons from './pages/Lessons';

const Placeholder = ({ title }) => (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <h1 className="text-3xl font-bold">{title}</h1>
    </div>
);

function App() {
    return (
        <WalletProvider>
            <Router>
                <div className="min-h-screen bg-slate-900 text-white flex flex-col">
                    <Navbar />
                    <div className="pt-20 flex-grow"> {/* Add padding for fixed navbar */}
                        <Routes>
                            <Route path="/" element={<Landing />} />
                            <Route path="/play" element={<Play />} />
                            <Route path="/rules" element={<Rules />} />
                            <Route path="/wallet" element={<Placeholder title="Wallet Connection (Coming Soon)" />} />
                            <Route path="/lessons" element={<Lessons />} />
                        </Routes>
                    </div>
                    <Footer />
                </div>
            </Router>
        </WalletProvider>
    );
}

export default App;
