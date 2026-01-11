'use client'

import React, { useState, useMemo } from 'react'

// --- 1. DANE MOCKOWE ---

const initialUsers = [
    { id: 1, name: 'Jan Kowalski', email: 'jan@example.com', friendsCount: 15, isBlocked: false, role: 'User' },
    { id: 2, name: 'Anna Nowak', email: 'anna@example.com', friendsCount: 42, isBlocked: false, role: 'Admin' },
    { id: 3, name: 'Piotr Wiśniewski', email: 'piotr@example.com', friendsCount: 0, isBlocked: true, role: 'User' },
    { id: 5, name: 'Marek Zegarek', email: 'marek@example.com', friendsCount: 120, isBlocked: false, role: 'User' },
]

const initialAquariums = [
    { id: 101, ownerId: 1, name: 'Morska Rafa', capacity: 200, status: 'Aktywne', temp: 25.5, ph: 8.1 },
    { id: 102, ownerId: 1, name: 'Krewetkarium', capacity: 30, status: 'Aktywne', temp: 22.0, ph: 6.8 },
    { id: 103, ownerId: 2, name: 'Amazonka', capacity: 120, status: 'Aktywne', temp: 29.5, ph: 6.5 },
    { id: 104, ownerId: 5, name: 'Holenderskie', capacity: 240, status: 'Konserwacja', temp: 24.0, ph: 7.0 },
]

const initialCatalog = [
    { id: 1, name: 'Neon Innesa', type: 'Ryba', lifespan: 5 },
    { id: 2, name: 'Gupik Pawie Oczko', type: 'Ryba', lifespan: 2 },
    { id: 3, name: 'Moczarka Kanadyjska', type: 'Roślina', lifespan: 100 },
    { id: 4, name: 'Anubias Nana', type: 'Roślina', lifespan: 100 },
    { id: 5, name: 'Skalar', type: 'Ryba', lifespan: 10 },
    { id: 6, name: 'Bojownik', type: 'Ryba', lifespan: 3 },
]

const initialInhabitants = [
    { id: 1, aquariumId: 101, catalogId: 5, quantity: 2 },
    { id: 2, aquariumId: 101, catalogId: 1, quantity: 15 },
    { id: 3, aquariumId: 102, catalogId: 2, quantity: 50 },
    { id: 4, aquariumId: 103, catalogId: 6, quantity: 1 },
    { id: 5, aquariumId: 103, catalogId: 4, quantity: 5 },
]

const initialHistory = [
    { id: 1, aquariumId: 101, action: 'ADDED', itemName: 'Neon Innesa', quantity: 10, date: '2023-10-01', user: 'Jan Kowalski' },
    { id: 2, aquariumId: 101, action: 'ADDED', itemName: 'Skalar', quantity: 2, date: '2023-10-05', user: 'Jan Kowalski' },
    { id: 3, aquariumId: 101, action: 'ADDED', itemName: 'Neon Innesa', quantity: 5, date: '2023-11-12', user: 'Jan Kowalski' },
    { id: 4, aquariumId: 101, action: 'REMOVED', itemName: 'Molinezja', quantity: 1, date: '2023-12-01', user: 'Jan Kowalski' },
    { id: 5, aquariumId: 102, action: 'ADDED', itemName: 'Gupik Pawie Oczko', quantity: 10, date: '2023-09-01', user: 'Jan Kowalski' },
]

const initialLogs = [
    { id: 1, timestamp: new Date(Date.now() - 100000).toLocaleTimeString(), level: 'INFO', action: 'SYSTEM_START', details: 'Uruchomiono panel Superadministratora v2.1' },
]

// --- 2. KOMPONENTY UI ---

const IconStats = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
const IconSearch = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
const IconCheck = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
const IconRefresh = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
const IconLock = ({ closed }) => closed ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" /></svg>;
const IconClose = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;
const IconClock = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

// --- 3. GŁÓWNY KOMPONENT ---

export default function SuperAdminPanel() {
    const [users, setUsers] = useState(initialUsers);
    const [aquariums, setAquariums] = useState(initialAquariums);
    const [catalog, setCatalog] = useState(initialCatalog);
    const [logs, setLogs] = useState(initialLogs);

    const [inhabitants, setInhabitants] = useState(initialInhabitants);
    const [history, setHistory] = useState(initialHistory);
    const [selectedAquariumId, setSelectedAquariumId] = useState(null);

    const [activeTab, setActiveTab] = useState('users');
    const [notifications, setNotifications] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    const [newItemName, setNewItemName] = useState('');
    const [newItemType, setNewItemType] = useState('Ryba');
    const [newItemLifespan, setNewItemLifespan] = useState('2');

    // --- LOGIKA POMOCNICZA ---

    const addLog = (level, action, details) => {
        setLogs(prev => [{ id: Date.now(), timestamp: new Date().toLocaleTimeString(), level, action, details }, ...prev]);
    };

    const processedUsers = useMemo(() => {
        let result = [...users];
        if (searchTerm) result = result.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()));
        if (sortConfig.key) {
            result.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
                if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return result;
    }, [users, searchTerm, sortConfig]);

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
        setSortConfig({ key, direction });
    };

    const handleRestartAquarium = (id) => {
        const aqName = aquariums.find(a => a.id === id)?.name;
        addLog('INFO', 'AQUA_RESTART', `Zlecono restart akwarium #${id} (${aqName})`);
        setAquariums(prev => prev.map(aq => aq.id === id ? { ...aq, status: 'Restartowanie...' } : aq));
        setTimeout(() => {
            setAquariums(prev => prev.map(aq => aq.id === id ? { ...aq, status: 'Aktywne' } : aq));
            addLog('SUCCESS', 'AQUA_RESTART_DONE', `Akwarium #${id} wróciło do pracy.`);
        }, 3000);
    };

    const toggleBlockUser = (id) => {
        setUsers(users.map(u => u.id === id ? { ...u, isBlocked: !u.isBlocked } : u));
        addLog('WARN', 'USER_BLOCK', `Zmiana blokady użytkownika ID:${id}`);
    };

    const handleAddItem = (e) => {
        e.preventDefault();
        if (!newItemName.trim()) return;
        const newItem = {
            id: Date.now(),
            name: newItemName,
            type: newItemType,
            lifespan: Number(newItemLifespan)
        };
        setCatalog([...catalog, newItem]);
        addLog('SUCCESS', 'CATALOG_ADD', `Dodano: ${newItemName} (${newItemType})`);
        setNewItemName('');
    };

    const getAquariumStats = (aqId) => {
        const myInhabitants = inhabitants.filter(i => i.aquariumId === aqId);

        const speciesCount = myInhabitants.length;

        const detailedList = myInhabitants.map(inh => {
            const species = catalog.find(c => c.id === inh.catalogId);
            return {
                ...inh,
                name: species?.name || 'Nieznany',
                type: species?.type || 'Inne',
                lifespan: species?.lifespan || 0
            };
        });

        const fish = detailedList.filter(d => d.type === 'Ryba');
        const totalLifespan = fish.reduce((acc, curr) => acc + curr.lifespan, 0);
        const avgLifespan = fish.length > 0 ? (totalLifespan / fish.length).toFixed(1) : 0;

        const myHistory = history.filter(h => h.aquariumId === aqId).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        return { speciesCount, detailedList, avgLifespan, myHistory };
    };

    const selectedAquariumData = selectedAquariumId ? aquariums.find(a => a.id === selectedAquariumId) : null;
    const stats = selectedAquariumId ? getAquariumStats(selectedAquariumId) : null;

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 font-sans pb-12 relative">

            {/* TOASTY */}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
                {notifications.map((note) => (
                    <div key={note.id} className="flex items-center gap-2 bg-gray-900 text-white px-4 py-3 rounded shadow-lg text-sm animate-slide-up">
                        <IconCheck /> {note.message}
                    </div>
                ))}
            </div>

            {/* --- MODAL STATYSTYK AKWARIUM --- */}
            {selectedAquariumId && selectedAquariumData && stats && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">

                        {/* Modal Header */}
                        <div className="bg-gray-900 text-white px-8 py-6 flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight">{selectedAquariumData.name}</h2>
                                <div className="text-blue-300 text-sm mt-1 font-mono">ID: #{selectedAquariumData.id} • Pojemność: {selectedAquariumData.capacity}L</div>
                            </div>
                            <button onClick={() => setSelectedAquariumId(null)} className="text-gray-400 hover:text-white transition">
                                <IconClose />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8 overflow-y-auto bg-gray-50 flex-1">

                            {/* KPIs */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-white p-5 rounded-xl border border-blue-100 shadow-sm">
                                    <div className="text-xs font-semibold uppercase text-gray-500 mb-1">Liczba Gatunków</div>
                                    <div className="text-3xl font-bold text-blue-600">{stats.speciesCount}</div>
                                </div>
                                <div className="bg-white p-5 rounded-xl border border-green-100 shadow-sm">
                                    <div className="text-xs font-semibold uppercase text-gray-500 mb-1">Całkowita Obsada</div>
                                    <div className="text-3xl font-bold text-green-600">
                                        {stats.detailedList.reduce((acc, curr) => acc + curr.quantity, 0)} <span className="text-sm font-normal text-gray-400">szt.</span>
                                    </div>
                                </div>
                                <div className="bg-white p-5 rounded-xl border border-purple-100 shadow-sm">
                                    <div className="text-xs font-semibold uppercase text-gray-500 mb-1">Śr. Długość Życia Ryb</div>
                                    <div className="text-3xl font-bold text-purple-600">{stats.avgLifespan} <span className="text-sm font-normal text-gray-400">lat</span></div>
                                    <div className="text-xs text-gray-400 mt-1">Obliczone na podstawie gatunków w zbiorniku</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* LISTA GATUNKÓW */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                                        <h3 className="font-bold text-gray-800">Obecna Obsada</h3>
                                    </div>
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-gray-50 text-gray-500">
                                        <tr>
                                            <th className="px-6 py-3 font-medium">Gatunek</th>
                                            <th className="px-6 py-3 font-medium text-center">Ilość</th>
                                            <th className="px-6 py-3 font-medium text-right">Śr. życie</th>
                                        </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                        {stats.detailedList.length > 0 ? stats.detailedList.map((item, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50">
                                                <td className="px-6 py-3">
                                                    <div className="font-medium text-gray-900">{item.name}</div>
                                                    <div className="text-xs text-gray-400">{item.type}</div>
                                                </td>
                                                <td className="px-6 py-3 text-center">
                                                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-bold">{item.quantity}</span>
                                                </td>
                                                <td className="px-6 py-3 text-right font-mono text-purple-600">
                                                    {item.type === 'Roślina' ? '∞' : `${item.lifespan} lat`}
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-400 italic">Zbiornik jest pusty.</td></tr>
                                        )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* HISTORIA ZMIAN */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
                                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                                        <h3 className="font-bold text-gray-800">Historia Zmian</h3>
                                    </div>
                                    <div className="p-6 overflow-y-auto max-h-[300px]">
                                        {stats.myHistory.length > 0 ? (
                                            <ol className="relative border-l border-gray-200 ml-2">
                                                {stats.myHistory.map((h) => (
                                                    <li key={h.id} className="mb-6 ml-6 last:mb-0">
                            <span className={`absolute flex items-center justify-center w-6 h-6 rounded-full -left-3 ring-4 ring-white ${h.action === 'ADDED' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                              {h.action === 'ADDED' ? '+' : '-'}
                            </span>
                                                        <div className="p-3 bg-gray-50 border border-gray-100 rounded-lg shadow-sm">
                                                            <div className="justify-between items-center mb-1 flex">
                                                                <time className="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0 flex items-center gap-1">
                                                                    <IconClock /> {h.date}
                                                                </time>
                                                                <div className={`text-xs font-bold uppercase tracking-wide ${h.action === 'ADDED' ? 'text-green-600' : 'text-red-600'}`}>
                                                                    {h.action === 'ADDED' ? 'Dodano gatunek' : 'Usunięto gatunek'}
                                                                </div>
                                                            </div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {h.action === 'ADDED' ? 'Dodano' : 'Odłowiono'} <span className="font-bold">{h.quantity} szt.</span> {h.itemName}
                                                            </div>
                                                            <div className="text-xs text-gray-500 mt-1">Operacja wykonana przez: <span className="font-medium text-gray-700">{h.user}</span></div>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ol>
                                        ) : (
                                            <div className="text-center text-gray-400 italic mt-10">Brak historii dla tego zbiornika.</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-gray-50 px-8 py-4 border-t border-gray-200 flex justify-end">
                            <button onClick={() => setSelectedAquariumId(null)} className="bg-white border border-gray-300 text-gray-700 font-medium py-2 px-6 rounded-lg hover:bg-gray-100 transition">
                                Zamknij
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- HEADER --- */}
            <div className="bg-gray-900 text-white border-b border-gray-800 sticky top-0 z-30 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-red-600 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">Super Admin</div>
                            <h1 className="text-xl font-bold tracking-tight">Aqua<span className="text-blue-400">Manager</span> System</h1>
                        </div>
                        <div className="text-xs text-gray-400 font-mono">System: ONLINE | Logi: {logs.length}</div>
                    </div>
                    <div className="flex space-x-1 mt-2 overflow-x-auto">
                        {[{ id: 'users', label: 'Użytkownicy' }, { id: 'aquariums', label: 'Monitoring Akwariów' }, { id: 'catalog', label: 'Baza Gatunków' }, { id: 'logs', label: 'Logi Systemowe' }].map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors duration-200 ${activeTab === tab.id ? 'border-blue-500 text-blue-400 bg-gray-800' : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'}`}>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* --- USERS TAB --- */}
                {activeTab === 'users' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
                            <h2 className="font-semibold text-gray-800">Użytkownicy</h2>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><IconSearch /></div>
                                <input type="text" placeholder="Szukaj..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-full sm:w-64 focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                        </div>
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
                            <tr>
                                <th onClick={() => requestSort('name')} className="px-6 py-3 cursor-pointer hover:bg-gray-100">Użytkownik</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Akcje</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                            {processedUsers.map((user) => (
                                <tr key={user.id} className={user.isBlocked ? 'bg-gray-100 opacity-75' : 'hover:bg-gray-50'}>
                                    <td className="px-6 py-4 flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">{user.name[0]}</div>
                                        <div>
                                            <div className="font-medium text-gray-900">{user.name}</div>
                                            <div className="text-gray-400 text-xs">{user.email}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${user.isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>{user.isBlocked ? 'Zablokowany' : 'Aktywny'}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => toggleBlockUser(user.id)} className="p-2 text-gray-400 hover:text-orange-500"><IconLock closed={user.isBlocked} /></button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* --- AQUARIUMS TAB --- */}
                {activeTab === 'aquariums' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                            <h2 className="font-semibold text-gray-800">Monitoring Parametrów Wody</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3">Nazwa</th>
                                    <th className="px-6 py-3">Temp.</th>
                                    <th className="px-6 py-3">pH</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-right">Panel Sterowania</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                {aquariums.map(aq => (
                                    <tr key={aq.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{aq.name}</div>
                                            <div className="text-xs text-gray-400">ID: #{aq.id}</div>
                                        </td>
                                        <td className={`px-6 py-4 font-mono font-bold ${aq.temp > 28 || aq.temp < 20 ? 'text-red-600 animate-pulse' : 'text-green-600'}`}>{aq.temp}°C</td>
                                        <td className="px-6 py-4 font-mono">{aq.ph}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${aq.status === 'Aktywne' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-gray-100 text-gray-700'}`}>{aq.status}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right flex justify-end gap-2">
                                            <button
                                                onClick={() => setSelectedAquariumId(aq.id)}
                                                className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-1"
                                            >
                                                <IconStats /> Szczegóły
                                            </button>

                                            <button onClick={() => handleRestartAquarium(aq.id)} disabled={aq.status !== 'Aktywne'} className="p-2 rounded-full text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition" title="Restart">
                                                <IconRefresh className={aq.status === 'Restartowanie...' ? 'animate-spin' : ''} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* --- CATALOG TAB --- */}
                {activeTab === 'catalog' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-5 border-b border-gray-100 bg-gray-50/50"><h2 className="font-semibold text-gray-800">Katalog</h2></div>
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
                                <tr><th className="px-6 py-3">Nazwa</th><th className="px-6 py-3">Typ</th><th className="px-6 py-3">Śr. życie</th></tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                {catalog.map(item => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium">{item.name}</td>
                                        <td className="px-6 py-4 text-xs">{item.type}</td>
                                        <td className="px-6 py-4 font-mono text-purple-600">{item.lifespan} lat</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit">
                            <h3 className="font-bold mb-4">Dodaj Gatunek</h3>
                            <form onSubmit={handleAddItem} className="space-y-4">
                                <input type="text" placeholder="Nazwa" value={newItemName} onChange={e => setNewItemName(e.target.value)} className="w-full border p-2 rounded text-sm bg-white" />

                                {/* SELECT DO WYBORU TYPU */}
                                <select
                                    value={newItemType}
                                    onChange={(e) => setNewItemType(e.target.value)}
                                    className="w-full border p-2 rounded text-sm bg-white"
                                >
                                    <option value="Ryba">Ryba</option>
                                    <option value="Roślina">Roślina</option>
                                </select>

                                <input type="number" placeholder="Śr. życie (lat)" value={newItemLifespan} onChange={e => setNewItemLifespan(e.target.value)} className="w-full border p-2 rounded text-sm bg-white" />
                                <button className="w-full bg-gray-900 text-white py-2 rounded text-sm font-bold">Dodaj</button>
                            </form>
                        </div>
                    </div>
                )}

                {/* --- LOGS TAB --- */}
                {activeTab === 'logs' && (
                    <div className="bg-[#1e1e1e] rounded-xl shadow-lg border border-gray-800 overflow-hidden text-gray-300 font-mono text-sm h-[600px] overflow-y-auto p-4 space-y-2">
                        {logs.map(log => (
                            <div key={log.id} className="flex gap-4 border-b border-gray-800 pb-2 mb-2">
                                <span className="text-gray-500">{log.timestamp}</span>
                                <span className={log.level === 'ERROR' ? 'text-red-500' : log.level === 'WARN' ? 'text-yellow-500' : 'text-blue-400'}>[{log.level}]</span>
                                <span className="text-purple-400">{log.action}</span>
                                <span>{log.details}</span>
                            </div>
                        ))}
                    </div>
                )}

            </div>
            <style jsx>{`
          @keyframes slide-up { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
          .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
          @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
          .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
        `}</style>
        </div>
    )
}