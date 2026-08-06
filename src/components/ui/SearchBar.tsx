type SearchBarProps = { value: string; onChange(value: string): void; placeholder?: string; };

export const SearchBar = ({ value, onChange, placeholder = 'Search…' }: SearchBarProps) => (
  <label className="relative block w-full sm:max-w-sm">
    <span className="sr-only">Search clients</span>
    <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 pl-9 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100" />
    <span aria-hidden className="absolute left-3 top-2.5 text-slate-400">⌕</span>
  </label>
);
