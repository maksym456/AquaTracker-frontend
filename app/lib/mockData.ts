export let mockAquariums = [
    {id: '1', name: 'Moje pierwsze akwarium', volume: 150, fishes: ['1'], plants:['1', '2'], description: 'Pierwsze domowe akwarium'},
    {id: '2', name: 'Drugie akwarium', volume: 200, fishes: ['2'], plants:['3'], description: 'Drugie domowe akwarium'}
];
export let mockFishes = [
  { id: '1', name: 'Gupik', species: 'Poecilia reticulata', aquariumId: '1' },
];

export let mockPlants = [
  { id: '1', name: 'Anubias', aquariumId: '1' },
  { id: '2', name: 'Moczarka', aquariumId: '2' }
];

export let mockHistory = [
  { id: '1', action: 'dodano rybę', target: 'Gupik', date: '2024-01-10', user: 'Jan' }
];

export function addAquarium(newAqua) {
  const newId = `${Date.now()}`;
  mockAquariums.push({ ...newAqua, id: newId, fishes: [], plants: [] });
}

export function addFishToAquarium(aquariumId, fish) {
  const newId = `${Date.now()}`;
  mockFishes.push({ ...fish, id: newId, aquariumId });
  const aquarium = mockAquariums.find(a => a.id === aquariumId);
  if (aquarium) {
    aquarium.fishes.push(newId);
  }
}

export function addPlantToAquarium(aquariumId, plant) {
  const newId = `${Date.now()}`;
  mockPlants.push({ ...plant, id: newId, aquariumId });
  const aquarium = mockAquariums.find(a => a.id === aquariumId);
  if (aquarium) {
    aquarium.plants.push(newId);
  }
}

export function addHistory(action, target, user) {
  mockHistory.push({ id: `${Date.now()}`, action, target, date: new Date().toISOString().slice(0,10), user });
}
