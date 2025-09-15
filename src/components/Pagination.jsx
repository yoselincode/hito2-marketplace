import React from "react";

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  pageSizeOptions = [6, 9, 12, 24],
  onPageChange,
  onPageSizeChange,
  className = "",
}) {
  const isFirst = currentPage <= 1;
  const isLast = currentPage >= Math.max(1, totalPages);

  function goTo(page) {
    const next = Math.min(Math.max(1, page), Math.max(1, totalPages));
    if (next !== currentPage) onPageChange?.(next);
  }

  return (
    <div
      className={`mt-8 flex flex-wrap items-center justify-between gap-3 ${className}`}
    >
      <div className="text-sm text-slate-600">
        Página {currentPage} de {Math.max(1, totalPages)}
        {typeof totalItems === "number" ? ` — ${totalItems}` : ""}{" "}
        {typeof totalItems === "number" ? "resultados" : ""}
      </div>
      <div className="flex items-center gap-2">
        {onPageSizeChange && (
          <select
            className="rounded-xl border px-2 py-2 text-sm"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            {pageSizeOptions.map((n) => (
              <option key={n} value={n}>
                {n} por página
              </option>
            ))}
          </select>
        )}

        <button
          onClick={() => goTo(1)}
          disabled={isFirst}
          className="rounded-xl border px-3 py-2 text-sm disabled:opacity-40"
          aria-label="Primera página"
        >
          « Primero
        </button>
        <button
          onClick={() => goTo(currentPage - 1)}
          disabled={isFirst}
          className="rounded-xl border px-3 py-2 text-sm disabled:opacity-40"
          aria-label="Página anterior"
        >
          ‹ Anterior
        </button>
        <button
          onClick={() => goTo(currentPage + 1)}
          disabled={isLast}
          className="rounded-xl border px-3 py-2 text-sm disabled:opacity-40"
          aria-label="Página siguiente"
        >
          Siguiente ›
        </button>
        <button
          onClick={() => goTo(totalPages)}
          disabled={isLast}
          className="rounded-xl border px-3 py-2 text-sm disabled:opacity-40"
          aria-label="Última página"
        >
          Último »
        </button>
      </div>
    </div>
  );
}
