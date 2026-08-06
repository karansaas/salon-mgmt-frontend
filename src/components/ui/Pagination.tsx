type PaginationProps = { page: number; totalPages: number; total: number; onPageChange(page: number): void; };

export const Pagination = ({ page, totalPages, total, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return <p className="text-sm text-slate-500">{total} client{total === 1 ? '' : 's'}</p>;
  return <div className="flex items-center justify-between gap-4"><p className="text-sm text-slate-500">{total} clients</p><div className="flex items-center gap-2"><button onClick={() => onPageChange(page - 1)} disabled={page === 1} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-40">Previous</button><span className="text-sm text-slate-600">Page {page} of {totalPages}</span><button onClick={() => onPageChange(page + 1)} disabled={page === totalPages} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-40">Next</button></div></div>;
};
