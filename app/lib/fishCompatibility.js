/**
 * Funkcje pomocnicze do sprawdzania kompatybilności ryb
 */

/**
 * Normalizuje nazwę temperamentu do standardowej formy
 */
export function normalizeTemperament(temperament) {
  if (!temperament) {
    return "spokojne";
  }
  const normalized = temperament.toLowerCase().trim();
  if (normalized.includes("pół") || normalized.includes("pol") || normalized.includes("semi")) {
    return "pół-agresywne";
  }
  if (normalized.includes("agresywne") || normalized.includes("aggressive")) {
    return "agresywne";
  }
  return "spokojne";
}

/**
 * Sprawdza zgodność temperamentów między dwoma gatunkami ryb
 * Zwraca obiekt z informacją o kompatybilności
 */
export function checkTemperamentCompatibility(fish1, fish2) {
  const temp1 = normalizeTemperament(fish1.temperament);
  const temp2 = normalizeTemperament(fish2.temperament);
  const name1 = fish1.name;
  const name2 = fish2.name;
  const id1 = fish1.id;
  const id2 = fish2.id;

  // Wszystkie spokojne mogą ze sobą nawzajem być
  if (temp1 === "spokojne" && temp2 === "spokojne") {
    return { compatible: true, severity: null, message: null };
  }

  // Agresywne nie mogą być ani ze spokojnymi ani z półagresywnymi
  if (temp1 === "agresywne" || temp2 === "agresywne") {
    if (temp1 === "spokojne" || temp2 === "spokojne") {
      return {
        compatible: false,
        severity: "ERROR",
        message: `${temp1 === "agresywne" ? name1 : name2} (agresywne) nie może być z ${temp1 === "spokojne" ? name1 : name2} (spokojne). Ryba spokojna może zostać pożarta.`
      };
    }
    if (temp1 === "pół-agresywne" || temp2 === "pół-agresywne") {
      return {
        compatible: false,
        severity: "ERROR",
        message: `${temp1 === "agresywne" ? name1 : name2} (agresywne) nie może być z ${temp1 === "pół-agresywne" ? name1 : name2} (pół-agresywne).`
      };
    }
    // Agresywne z agresywnymi spoza swojego gatunku - konflikt może spowodować pożarcie łagodnego osobnika
    if (temp1 === "agresywne" && temp2 === "agresywne" && id1 !== id2) {
      return {
        compatible: true,
        severity: "WARNING",
        message: `${name1} i ${name2} (oba agresywne, różne gatunki) - konflikt może spowodować pożarcie łagodnego osobnika.`
      };
    }
  }

  // Półagresywne ze spokojnymi - konflikt może spowodować pożarcie łagodnego osobnika
  if ((temp1 === "pół-agresywne" && temp2 === "spokojne") || 
      (temp1 === "spokojne" && temp2 === "pół-agresywne")) {
    return {
      compatible: true,
      severity: "WARNING",
      message: `${temp1 === "pół-agresywne" ? name1 : name2} (pół-agresywne) z ${temp1 === "spokojne" ? name1 : name2} (spokojne) - konflikt może spowodować pożarcie łagodnego osobnika.`
    };
  }

  // Półagresywne ze półagresywnymi spoza swojego gatunku - konflikt może spowodować pożarcie łagodnego osobnika
  if (temp1 === "pół-agresywne" && temp2 === "pół-agresywne" && id1 !== id2) {
    return {
      compatible: true,
      severity: "WARNING",
      message: `${name1} i ${name2} (oba pół-agresywne, różne gatunki) - konflikt może spowodować pożarcie łagodnego osobnika.`
    };
  }

  return { compatible: true, severity: null, message: null };
}

/**
 * Sprawdza kompatybilność nowej ryby z wszystkimi rybami w akwarium
 * Zwraca listę problemów kompatybilności
 */
export function checkFishCompatibilityWithAquarium(newFish, aquariumFishes, availableFishes = []) {
  const issues = [];
  
  if (!aquariumFishes || aquariumFishes.length === 0) {
    return issues;
  }

  for (const aquariumFish of aquariumFishes) {
    // aquariumFish może mieć strukturę { fishId, count } lub { fishSpecies: {...} }
    let existingFish = null;
    
    if (aquariumFish.fishSpecies) {
      existingFish = aquariumFish.fishSpecies;
    } else if (aquariumFish.fishId) {
      // Jeśli mamy tylko fishId, znajdź szczegóły w dostępnych rybach
      existingFish = availableFishes.find(f => f.id === aquariumFish.fishId);
    } else if (aquariumFish.id) {
      existingFish = aquariumFish;
    }
    
    if (!existingFish || !existingFish.id) continue;

    const compatibility = checkTemperamentCompatibility(newFish, existingFish);
    
    if (!compatibility.compatible || compatibility.severity) {
      issues.push({
        type: "TEMPERAMENT_INCOMPATIBILITY",
        severity: compatibility.severity || "WARNING",
        message: compatibility.message,
        existingFish: existingFish.name || existingFish,
        newFish: newFish.name
      });
    }
  }

  return issues;
}

/**
 * Filtruje dostępne ryby, pokazując tylko te kompatybilne z akwarium
 * Zwraca obiekt z kompatybilnymi i niekompatybilnymi rybami
 */
export function filterCompatibleFishes(availableFishes, aquariumFishes) {
  const compatible = [];
  const incompatible = [];
  const warnings = [];

  if (!aquariumFishes || aquariumFishes.length === 0) {
    // Jeśli akwarium jest puste, wszystkie ryby są kompatybilne
    return {
      compatible: (availableFishes || []).map(fish => ({ fish, issues: [] })),
      incompatible: [],
      warnings: []
    };
  }

  for (const fish of availableFishes || []) {
    const issues = checkFishCompatibilityWithAquarium(fish, aquariumFishes, availableFishes);
    
    const hasErrors = issues.some(issue => issue.severity === "ERROR");
    const hasWarnings = issues.some(issue => issue.severity === "WARNING");

    if (hasErrors) {
      incompatible.push({ fish, issues });
    } else if (hasWarnings) {
      // Ryby z ostrzeżeniami są tylko w warnings, nie w compatible (żeby uniknąć duplikatów)
      warnings.push({ fish, issues });
    } else {
      compatible.push({ fish, issues: [] });
    }
  }

  return { compatible, incompatible, warnings };
}

/**
 * Parsuje zakres z stringa (np. "22-26" -> [22, 26])
 */
function parseRange(rangeString, defaultValue = [0, 100]) {
  if (!rangeString) return defaultValue;
  if (typeof rangeString === 'string' && rangeString.includes('-')) {
    const parts = rangeString.split('-').map(p => parseFloat(p.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return parts;
    }
  }
  return defaultValue;
}

/**
 * Mapuje typ wody z formatu akwarium na format ryby
 */
function normalizeWaterType(aquariumWaterType, fishWaterType) {
  const aquariumMap = {
    'freshwater': 'Słodkowodna',
    'saltwater': 'Słonowodna',
    'brackish': 'Słonawowodna'
  };
  
  const normalizedAquarium = aquariumMap[aquariumWaterType] || aquariumWaterType;
  return normalizedAquarium === fishWaterType;
}

/**
 * Oblicza procent dopasowania zakresu (np. temperatura akwarium vs zakres ryby)
 * Zwraca wartość 0-1, gdzie 1 = idealne dopasowanie
 */
function calculateRangeMatch(aquariumValue, fishMin, fishMax) {
  if (fishMin === undefined || fishMax === undefined) return 0.5;
  
  if (aquariumValue >= fishMin && aquariumValue <= fishMax) {
    return 1.0;
  }
  
  const range = fishMax - fishMin;
  if (range === 0) return aquariumValue === fishMin ? 1.0 : 0;
  
  const distance = aquariumValue < fishMin 
    ? (fishMin - aquariumValue) / range
    : (aquariumValue - fishMax) / range;
  
  return Math.max(0, 1 - distance * 2);
}

/**
 * Oblicza match score dla ryby na podstawie parametrów akwarium
 * Zwraca obiekt z score (0-100) i szczegółami dopasowania
 */
export function calculateMatchScore(fish, aquarium) {
  if (!fish || !aquarium) {
    return { score: 0, details: {} };
  }

  let score = 0;
  const maxScore = 100;
  const details = {};

  const waterTypeWeight = 30;
  const temperatureWeight = 25;
  const phWeight = 20;
  const hardnessWeight = 10;
  const biotopeWeight = 5;
  const temperamentWeight = 10;

  const fishTempRange = parseRange(fish.temperature, [20, 26]);
  const fishPhRange = parseRange(fish.ph, [6.5, 7.5]);
  const fishHardnessRange = parseRange(fish.hardnessDGH, [5, 15]);

  const aquariumTemp = parseFloat(aquarium.temperature) || 24;
  const aquariumPh = parseFloat(aquarium.ph) || 7.0;
  const aquariumHardness = parseFloat(aquarium.hardness) || 10;

  const waterTypeMatch = normalizeWaterType(aquarium.waterType, fish.waterType);
  details.waterType = waterTypeMatch;
  score += waterTypeMatch ? waterTypeWeight : 0;

  const tempMatch = calculateRangeMatch(aquariumTemp, fishTempRange[0], fishTempRange[1]);
  details.temperature = tempMatch;
  score += tempMatch * temperatureWeight;

  const phMatch = calculateRangeMatch(aquariumPh, fishPhRange[0], fishPhRange[1]);
  details.ph = phMatch;
  score += phMatch * phWeight;

  const hardnessMatch = calculateRangeMatch(aquariumHardness, fishHardnessRange[0], fishHardnessRange[1]);
  details.hardness = hardnessMatch;
  score += hardnessMatch * hardnessWeight;

  const biotopeMatch = aquarium.biotope && fish.biotype 
    ? aquarium.biotope.toLowerCase() === fish.biotype.toLowerCase()
    : false;
  details.biotope = biotopeMatch;
  score += biotopeMatch ? biotopeWeight : 0;

  return {
    score: Math.round(score),
    details
  };
}

/**
 * Zwraca rekomendowane ryby posortowane według match score
 * Kategoryzuje na: idealnie pasujące, dobrze pasujące, pasujące z ostrzeżeniem
 */
export function getRecommendedFishes(availableFishes, aquarium, aquariumFishes) {
  if (!availableFishes || !aquarium || !aquariumFishes || aquariumFishes.length === 0) {
    return {
      perfect: [],
      good: [],
      withWarning: []
    };
  }

  const recommended = [];

  for (const fish of availableFishes) {
    const compatibilityIssues = checkFishCompatibilityWithAquarium(fish, aquariumFishes, availableFishes);
    const hasErrors = compatibilityIssues.some(issue => issue.severity === "ERROR");
    
    if (hasErrors) {
      continue;
    }

    const matchScore = calculateMatchScore(fish, aquarium);
    const hasWarnings = compatibilityIssues.some(issue => issue.severity === "WARNING");

    recommended.push({
      fish,
      matchScore: matchScore.score,
      matchDetails: matchScore.details,
      compatibilityIssues,
      hasWarnings
    });
  }

  recommended.sort((a, b) => b.matchScore - a.matchScore);

  const perfect = recommended.filter(r => r.matchScore >= 90 && !r.hasWarnings).slice(0, 10);
  const good = recommended.filter(r => r.matchScore >= 70 && r.matchScore < 90 && !r.hasWarnings).slice(0, 10);
  const withWarning = recommended.filter(r => r.hasWarnings).slice(0, 10);

  return {
    perfect,
    good,
    withWarning
  };
}

