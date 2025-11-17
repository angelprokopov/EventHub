export default function FormField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
    return (
        <label className="field">
            <span>{label}</span>
            {children}
            {error && <small className="error">{error}</small>}
        </label>
    );
}