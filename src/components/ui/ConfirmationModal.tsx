import type { ReactNode } from 'react';

type ConfirmationModalProps = { open: boolean; title: string; children: ReactNode; confirmLabel?: string; isConfirming?: boolean; onConfirm(): void; onClose(): void; };

export const ConfirmationModal = ({ open, title, children, confirmLabel = 'Confirm', isConfirming, onConfirm, onClose }: ConfirmationModalProps) => {
  if (!open) return null;
  return <div role="dialog" aria-modal="true" aria-labelledby="confirm-title" className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4"><div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"><h2 id="confirm-title" className="text-lg font-semibold text-slate-900">{title}</h2><div className="mt-2 text-sm text-slate-600">{children}</div><div className="mt-6 flex justify-end gap-3"><button onClick={onClose} disabled={isConfirming} className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">Cancel</button><button onClick={onConfirm} disabled={isConfirming} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">{isConfirming ? 'Deleting…' : confirmLabel}</button></div></div></div>;
};
