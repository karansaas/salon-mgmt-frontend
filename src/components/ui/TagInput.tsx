import { KeyboardEvent, useState } from 'react';

type TagInputProps = { value: string[]; onChange(value: string[]): void; placeholder?: string; };
export const TagInput = ({ value, onChange, placeholder = 'Type a skill and press Enter' }: TagInputProps) => {
  const [draft, setDraft] = useState('');
  const add = () => { const tag = draft.trim(); if (tag && !value.some((item) => item.toLowerCase() === tag.toLowerCase())) onChange([...value, tag]); setDraft(''); };
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => { if (event.key === 'Enter' || event.key === ',') { event.preventDefault(); add(); } if (event.key === 'Backspace' && !draft && value.length) onChange(value.slice(0, -1)); };
  return <div className="mt-1.5 rounded-lg border border-slate-300 bg-white p-2 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100"><div className="flex flex-wrap gap-2">{value.map((tag) => <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">{tag}<button type="button" onClick={() => onChange(value.filter((item) => item !== tag))} aria-label={`Remove ${tag}`} className="font-bold hover:text-brand-900">×</button></span>)}<input value={draft} onChange={(event) => setDraft(event.target.value)} onBlur={add} onKeyDown={onKeyDown} placeholder={placeholder} className="min-w-40 flex-1 border-0 px-1 py-1 text-sm outline-none" /></div></div>;
};
