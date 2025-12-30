'use client'

import { useState } from 'react'

// --- TYPY DANYCH ---
type ItemType = 'Ryba' | 'Roślina'

interface CatalogItem {
  id: number
  name: string
  type: ItemType
  price: number
}

interface Aquarium {
  id: number
  ownerId: number
  name: string
  capacity: number // w litrach
}

interface User {
  id: number
  name: string
  email: string
  friendsCount: number
  isBlocked: boolean
}

// --- DANE STARTOWE (MOCK DATA) ---
const initialUsers: User[] = [
  { id: 1, name: 'Jan Kowalski', email: 'jan@example.com', friendsCount: 15, isBlocked: false },
  { id: 2, name: 'Anna Nowak', email: 'anna@example.com', friendsCount: 42, isBlocked: false },
  { id: 3, name: 'Piotr Wiśniewski', email: 'piotr@example.com', friendsCount: 0, isBlocked: true },
]

const initialAquariums: Aquarium[] = [
  { id: 101, ownerId: 1, name: 'Morska Rafa', capacity: 200 },
  { id: 102, ownerId: 1, name: 'Krewetkarium', capacity: 30 },
  { id: 103, ownerId: 2, name: 'Amazonka', capacity: 120 },
]

const initialCatalog: CatalogItem[] = [
  { id: 1, name: 'Neon Innesa', type: 'Ryba', price: 5 },
  { id: 2, name: 'Gupik Pawie Oczko', type: 'Ryba', price: 3 },
  { id: 3, name: 'Moczarka Kanadyjska', type: 'Roślina', price: 8 },
  { id: 4, name: 'Anubias Nana', type: 'Roślina', price: 25 },
]

export default function AdminPanel() {
  // --- STANY ---
  const [activeTab, setActiveTab] = useState<'users' | 'aquariums' | 'catalog'>('users')

  const [users, setUsers] = useState(initialUsers)
  const [aquariums, setAquariums] = useState(initialAquariums)
  const [catalog, setCatalog] = useState(initialCatalog)

  // Formularz dodawania do katalogu
  const [newItemName, setNewItemName] = useState('')
  const [newItemType, setNewItemType] = useState<ItemType>('Ryba')


  // --- LOGIKA: UŻYTKOWNICY ---

  // Resetuje użytkownika: usuwa znajomych i jego akwaria
  const handleResetUser = (userId: number) => {
    if (!confirm('Czy na pewno chcesz wyczyścić konto tego użytkownika? To usunie jego akwaria i znajomych.')) return

    // 1. Resetujemy znajomych usera
    setUsers(users.map(u =>
        u.id === userId ? { ...u, friendsCount: 0 } : u
    ))

    // 2. Usuwamy jego akwaria z głównej listy akwariów
    setAquariums(aquariums.filter(aq => aq.ownerId !== userId))
  }

  // --- LOGIKA: KATALOG ---

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newItemName) return

    setCatalog([...catalog])
    setNewItemName('')

  }

  const handleDeleteItem = (id: number) => {
    setCatalog(catalog.filter(item => item.id !== id))
  }

  // --- POMOCNICZE ---
  // Oblicza ile akwariów ma dany user (na podstawie listy akwariów)
  const countUserAquariums = (userId: number) => {
    return aquariums.filter(aq => aq.ownerId === userId).length
  }

  const getOwnerName = (ownerId: number) => {
    const user = users.find(u => u.id === ownerId)
    return user ? user.name : 'Nieznany (Usunięty)'
  }

  return (
      <div className="min-h-screen bg-gray-50 font-sans text-gray-800">

        {/* HEADER */}
        <div className="bg-white border-b border-gray-200 px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Panel Administratora</h1>

          {/* ZAKŁADKI (TABS) */}
          <div className="flex space-x-6">
            <button
                onClick={() => setActiveTab('users')}
                className={`pb-2 text-sm font-medium border-b-2 transition ${activeTab === 'users' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              Użytkownicy
            </button>
            <button
                onClick={() => setActiveTab('aquariums')}
                className={`pb-2 text-sm font-medium border-b-2 transition ${activeTab === 'aquariums' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              Lista Akwariów
            </button>
            <button
                onClick={() => setActiveTab('catalog')}
                className={`pb-2 text-sm font-medium border-b-2 transition ${activeTab === 'catalog' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              Katalog Gatunków
            </button>
          </div>
        </div>

        <div className="p-8 max-w-7xl mx-auto">

          {/* --- WIDOK 1: UŻYTKOWNICY --- */}
          {activeTab === 'users' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                  <h2 className="font-semibold text-gray-700">Zarządzanie</h2>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Razem: {users.length}</span>
                </div>
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="p-4">Nazwa</th>
                    <th className="p-4">Znajomi</th>
                    <th className="p-4">Akwaria</th>
                    <th className="p-4 text-right">Akcje</th>
                  </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                  {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="p-4">
                          <div className="font-medium text-gray-900">{user.name}</div>
                          <div className="text-gray-400 text-xs">{user.email}</div>
                        </td>
                        <td className="p-4 text-gray-600">
                          {user.friendsCount}
                        </td>
                        <td className="p-4 text-gray-600">
                          {countUserAquariums(user.id)}
                        </td>
                        <td className="p-4 text-right">
                          <button
                              onClick={() => handleResetUser(user.id)}
                              className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded text-xs font-medium transition"
                              title="Usuwa znajomych i akwaria"
                          >
                            Zresetuj Konto
                          </button>
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>
          )}

          {/* --- WIDOK 2: LISTA AKWARIÓW --- */}
          {activeTab === 'aquariums' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-100">
                  <h2 className="font-semibold text-gray-700">Wszystkie Akwaria w Systemie</h2>
                </div>
                {aquariums.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">Brak akwariów w bazie.</div>
                ) : (
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 text-gray-500">
                      <tr>
                        <th className="p-4">ID</th>
                        <th className="p-4">Nazwa Akwarium</th>
                        <th className="p-4">Właściciel</th>
                      </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                      {aquariums.map((aq) => (
                          <tr key={aq.id} className="hover:bg-gray-50">
                            <td className="p-4 font-mono text-gray-400 text-xs">#{aq.id}</td>
                            <td className="p-4 font-medium text-gray-900">{aq.name}</td>
                            <td className="p-4 text-blue-600">{getOwnerName(aq.ownerId)}</td>

                          </tr>
                      ))}
                      </tbody>
                    </table>
                )}
              </div>
          )}

          {/* --- WIDOK 3: KATALOG RYB I ROŚLIN --- */}
          {activeTab === 'catalog' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Tabela Katalogu */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="font-semibold text-gray-700">Dostępne Gatunki (Sklep)</h2>
                  </div>
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500">
                    <tr>
                      <th className="p-4">Nazwa</th>
                      <th className="p-4">Typ</th>
                      <th className="p-4 text-right">Akcje</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {catalog.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="p-4 font-medium text-gray-900">{item.name}</td>
                          <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.type === 'Ryba' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {item.type}
                        </span>
                          </td>
                          <td className="p-4 text-right">
                            <button
                                onClick={() => handleDeleteItem(item.id)}
                                className="text-red-500 hover:text-red-700 text-xs font-medium px-2 py-1"
                            >
                              Usuń
                            </button>
                          </td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                </div>

                {/* Formularz dodawania */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit">
                  <h3 className="font-semibold text-gray-800 mb-4">Dodaj nowy gatunek</h3>
                  <form onSubmit={handleAddItem} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Nazwa</label>
                      <input
                          type="text"
                          value={newItemName}
                          onChange={e => setNewItemName(e.target.value)}
                          placeholder="np. Bojownik"
                          className="w-full border border-gray-200 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Typ</label>
                      <div className="flex gap-4">
                        <label className="flex items-center text-sm cursor-pointer">
                          <input
                              type="radio"
                              name="type"
                              checked={newItemType === 'Ryba'}
                              onChange={() => setNewItemType('Ryba')}
                              className="mr-2 text-blue-600 focus:ring-blue-500"
                          />
                          Ryba
                        </label>
                        <label className="flex items-center text-sm cursor-pointer">
                          <input
                              type="radio"
                              name="type"
                              checked={newItemType === 'Roślina'}
                              onChange={() => setNewItemType('Roślina')}
                              className="mr-2 text-green-600 focus:ring-green-500"
                          />
                          Roślina
                        </label>
                      </div>
                    </div>


                    <button className="w-full bg-gray-900 hover:bg-black text-white py-2 rounded text-sm font-medium transition">
                      Dodaj do Katalogu
                    </button>
                  </form>
                </div>

              </div>
          )}

        </div>
      </div>
  )
}