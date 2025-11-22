export const GAME_ITEMS = [
    {
        id: 'ether',
        type: 'good',
        name: 'Ether',
        symbol: '💎',
        points: 10,
        info: "Ether (ETH) is the native cryptocurrency of Ethereum.",
        color: '#627EEA'
    },
    {
        id: 'block',
        type: 'good',
        name: 'Block',
        symbol: '📦',
        points: 20,
        info: "Blocks contain batches of transactions added to the blockchain.",
        color: '#8c8c8c'
    },
    {
        id: 'gas',
        type: 'good',
        name: 'Gas',
        symbol: '⛽',
        points: 5,
        info: "Gas is the fee paid to process transactions.",
        color: '#e6b800'
    },
    {
        id: 'bug',
        type: 'bad',
        name: 'Bug',
        symbol: '🐛',
        points: -10,
        info: "Smart contract bugs can lead to hacks and lost funds!",
        color: '#ff4d4d'
    },
    {
        id: 'hacker',
        type: 'bad',
        name: 'Hacker',
        symbol: '👾',
        points: -20,
        info: "Malicious actors try to exploit vulnerabilities.",
        color: '#ff0000'
    }
];
