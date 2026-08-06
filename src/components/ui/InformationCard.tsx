import type { ReactNode } from 'react';

type InformationCardProps = { title: string; children: ReactNode; className?: string; };

export const InformationCard = ({ title, children, className = '' }: InformationCardProps) => <section className={`rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}><div className="border-b border-slate-100 px-5 py-4"><h2 className="font-semibold text-slate-900">{title}</h2></div><div className="p-5">{children}</div></section>;

export const EmptyHistory = ({ label }: { label: string }) => <div className="rounded-lg bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">No {label.toLowerCase()} available yet.</div>;
