/**
 * Wspólne funkcje do formatowania danych ryb z API.
 * Używane w bazie ryb (menu główne) i w modalu „Dodaj rybę” na stronie akwarium,
 * żeby parametry gatunku były zawsze takie same jak w bazie.
 */

const DEFAULT_TEMP = [22, 26];
const DEFAULT_PH = [6.5, 7.5];
const DEFAULT_HARDNESS = [5, 15];

function parseRange(str, defaults) {
  if (!str || typeof str !== "string") return defaults;
  const parts = str.split("-").map((p) => parseFloat(String(p).trim()));
  if (parts.length !== 2 || parts.some((n) => Number.isNaN(n))) return defaults;
  return [Math.min(parts[0], parts[1]), Math.max(parts[0], parts[1])];
}

/**
 * Normalizuje typ wody z API (np. "Słodkowodna") do klucza używanego w UI.
 * @param {string} apiWaterType
 * @returns {"freshwater"|"saltwater"|"brackish"}
 */
export function normalizeWaterTypeFromApi(apiWaterType) {
  const s = String(apiWaterType || "").toLowerCase();
  if (s.includes("słod") || s.includes("slod")) return "freshwater";
  if (s.includes("słonaw") || s.includes("slonaw")) return "brackish";
  if (s.includes("słon") || s.includes("slon")) return "saltwater";
  return "freshwater";
}

/**
 * Formatuje parametry ryby z surowej odpowiedzi API do stałego formatu wyświetlania.
 * Te same reguły i domyślne wartości co w bazie ryb (convertApiFishToUI).
 *
 * @param {object} apiFish - obiekt ryby z GET /v1/fish (id, name, temperature, ph, hardnessDGH, …)
 * @returns {{ temperature: string, ph: string, hardness: string, biotope: string, temperament: string, minSchool: number, waterType: string }}
 */
export function formatFishParamsFromApi(apiFish) {
  if (!apiFish) {
    return {
      temperature: `${DEFAULT_TEMP[0]}-${DEFAULT_TEMP[1]} °C`,
      ph: `${DEFAULT_PH[0]}-${DEFAULT_PH[1]}`,
      hardness: `${DEFAULT_HARDNESS[0]}-${DEFAULT_HARDNESS[1]} °dGH`,
      biotope: "-",
      temperament: "-",
      minSchool: 1,
      waterType: "freshwater",
    };
  }

  const tempRange = parseRange(apiFish.temperature, DEFAULT_TEMP);
  const phRange = parseRange(apiFish.ph, DEFAULT_PH);
  const hardRange = parseRange(apiFish.hardnessDGH, DEFAULT_HARDNESS);

  return {
    temperature: `${tempRange[0]}-${tempRange[1]} °C`,
    ph: `${phRange[0]}-${phRange[1]}`,
    hardness: `${hardRange[0]}-${hardRange[1]} °dGH`,
    biotope: apiFish.biotope || apiFish.biotype || "-",
    temperament: apiFish.temperament || "-",
    minSchool: apiFish.minShoalSize ?? apiFish.minSchoolSize ?? 1,
    waterType: normalizeWaterTypeFromApi(apiFish.waterType),
  };
}
