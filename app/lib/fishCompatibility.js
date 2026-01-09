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

