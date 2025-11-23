import React from 'react';

const Lessons = () => {
    const resources = [
        {
            title: "ETH Kipu",
            description: "Latin America's Ethereum Education Ecosystem. Join a vibrant community of learners and builders.",
            link: "https://ethkipu.org",
            color: "from-green-400 to-emerald-600",
            icon: "🌱"
        },
        {
            title: "Cyfrin Updraft",
            description: "The best place to learn smart contract security & development. Structured courses from zero to hero.",
            link: "https://updraft.cyfrin.io",
            color: "from-blue-400 to-cyan-600",
            icon: "🚀"
        },
        {
            title: "Ethereum.org",
            description: "The official documentation and resource hub for everything Ethereum.",
            link: "https://ethereum.org",
            color: "from-purple-400 to-indigo-600",
            icon: "💎"
        },
        {
            title: "Solidity by Example",
            description: "Learn Solidity with simple examples. A great reference for syntax and patterns.",
            link: "https://solidity-by-example.org",
            color: "from-slate-400 to-slate-600",
            icon: "💻"
        }
    ];

    return (
        <div className="h-[calc(100vh-80px)] bg-slate-900 flex flex-col items-center justify-center px-4 overflow-hidden">
            <div className="max-w-6xl w-full">
                <h1 className="text-3xl font-bold text-center mb-3 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Start Learning
                </h1>
                <p className="text-slate-400 text-center mb-8 max-w-2xl mx-auto text-sm">
                    Ready to go deeper? Explore these top-tier resources to master Solidity, Smart Contracts, and Web3 development.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {resources.map((res, index) => (
                        <a
                            key={index}
                            href={res.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative overflow-hidden bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-slate-500 transition-all hover:-translate-y-1 hover:shadow-xl"
                        >
                            <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${res.color} opacity-10 rounded-bl-full group-hover:opacity-20 transition-opacity`}></div>

                            <div className="flex items-start justify-between mb-2">
                                <div className="text-2xl">{res.icon}</div>
                                <div className="text-slate-500 group-hover:text-white transition-colors text-sm">↗</div>
                            </div>

                            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                                {res.title}
                            </h3>
                            <p className="text-slate-400 text-xs leading-relaxed">
                                {res.description}
                            </p>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Lessons;
