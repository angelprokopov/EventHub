const KNOWN_COUNTRIES = [
    'bulgaria',
    'united kingdom',
    'uk',
    'united states',
    'usa',
    'germany',
    'france',
    'spain',
    'italy',
];

export function normalizeCity(raw: string | undefined | null): string {
    if (!raw) return '';

    // Remove things in parentheses: "National Palace (NDK), Sofia, Bulgaria" -> "National Palace , Sofia, Bulgaria"
    let cleaned = raw.replace(/\(.*?\)/g, ' ');

    // Collapse multiple spaces
    cleaned = cleaned.replace(/\s+/g, ' ').trim();

    // Split by comma and trim each part
    const parts = cleaned
        .split(',')
        .map(p => p.trim())
        .filter(Boolean);

    if (parts.length === 0) return '';

    if (parts.length === 1) {
        // Single token like "Sofia"
        return parts[0];
    }

    // Decide if the last part looks like a country
    const last = parts[parts.length - 1];
    const lastLower = last.toLowerCase();

    const isLastCountry =
        KNOWN_COUNTRIES.includes(lastLower) ||
        // very simple heuristic: "Republic of ..." / "Kingdom of ..." etc
        /republic|kingdom|federation|state/i.test(last);

    if (isLastCountry && parts.length >= 2) {
        // If the last is a country, take the part before it
        return parts[parts.length - 2];
    }

    // Otherwise assume the last segment is the city
    return last;
}
