type PaginationProps = { page: number; totalPages: number; total: number; itemLabel?: string; onPageChange(page: number): void; };

export const Pagination = ({ page, totalPages, total, itemLabel = 'client', onPageChange }: PaginationProps) => {
  const label = `${total} ${itemLabel}${total === 1 ? '' : 's'}`;
  if (totalPages <= 1) return <p className="text-sm text-slate-500">{label}</p>;
  return <div className="flex items-center justify-between gap-4"><p className="text-sm text-slate-500">{label}</p><div className="flex items-center gap-2"><button onClick={() => onPageChange(page - 1)} disabled={page === 1} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-40">Previous</button><span className="text-sm text-slate-600">Page {page} of {totalPages}</span><button onClick={() => onPageChange(page + 1)} disabled={page === totalPages} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-40">Next</button></div></div>;
};
