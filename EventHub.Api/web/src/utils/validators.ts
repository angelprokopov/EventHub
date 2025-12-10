export function required(value: string | null | undefined): string | undefined {
    // null / undefined or only whitespace => error
    if (value == null || value.trim().length === 0) {
        return 'This field is required.';
    }

    // non-empty text => valid
    return undefined;
}
export function min(n: number) { return (v?: string) => (v && v.length >= n ? undefined : `Min ${n} chars`); }
export function isValidUrl(value: string | undefined | null): string | undefined {
    // Allow empty value (optional field)
    if (!value) return undefined;

    try {
        const url = new URL(value);

        // Only allow http / https
        if (url.protocol === 'http:' || url.protocol === 'https:') {
            return undefined;
        }

        return 'Only http and https URLs are allowed.';
    } catch {
        return 'Invalid URL format.';
    }
}