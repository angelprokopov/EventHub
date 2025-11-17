export function required(v?: string) { return !v ? 'Required' : undefined; }
export function min(n: number) { return (v?: string) => (v && v.length >= n ? undefined : `Min ${n} chars`); }