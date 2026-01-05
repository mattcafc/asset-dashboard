import { X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { parseInitiativesCsv } from '../../utils/csvParser'

export function CsvImportDialog({
  open,
  initialCsv,
  onClose,
  onApply,
}: {
  open: boolean
  initialCsv: string
  onClose: () => void
  onApply: (csvText: string) => void
}) {
  const [draft, setDraft] = useState(initialCsv)

  const preview = useMemo(() => parseInitiativesCsv(draft), [draft])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-4xl rounded-xl bg-white shadow-xl ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-slate-800">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <div>
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">Import portfolio CSV</div>
            <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">
              Upload a CSV file or paste data to refresh the dashboard. Saved locally in your browser.
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 p-5 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between gap-3">
              <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">CSV data</div>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-700">
                <input
                  type="file"
                  accept=".csv,text/csv"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (!f) return
                    const reader = new FileReader()
                    reader.onload = () => setDraft(String(reader.result ?? ''))
                    reader.readAsText(f)
                  }}
                />
                Upload CSV
              </label>
            </div>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="mt-2 h-[360px] w-full rounded-lg border border-slate-200 bg-white p-3 font-mono text-xs text-slate-900 shadow-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-sky-500 dark:focus:ring-sky-500/30"
              spellCheck={false}
            />
          </div>

          <div className="lg:col-span-1">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900">
              <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">Preview</div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
                <div className="rounded-md bg-white p-2 ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-slate-800">
                  <div className="text-[11px] font-medium">Initiatives</div>
                  <div className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-50">
                    {preview.initiatives.length}
                  </div>
                </div>
                <div className="rounded-md bg-white p-2 ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-slate-800">
                  <div className="text-[11px] font-medium">Warnings</div>
                  <div className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-50">
                    {preview.warnings.length}
                  </div>
                </div>
              </div>
              {preview.warnings.length ? (
                <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-amber-800 dark:text-amber-200">
                  {preview.warnings.slice(0, 6).map((w, idx) => (
                    <li key={idx}>{w}</li>
                  ))}
                </ul>
              ) : (
                <div className="mt-3 text-xs text-slate-600 dark:text-slate-300">Looks good.</div>
              )}
              <div className="mt-4 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => onApply(draft)}
                  className="inline-flex items-center justify-center rounded-lg bg-sky-600 px-3 py-2 text-sm font-semibold text-white hover:bg-sky-700"
                >
                  Apply & refresh
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
                >
                  Cancel
                </button>
              </div>
            </div>

            <div className="mt-3 text-xs text-slate-600 dark:text-slate-300">
              Expected headers include <span className="font-mono">ID</span>,{' '}
              <span className="font-mono">Strategic Initiative</span>, <span className="font-mono">Opportunity</span>,{' '}
              <span className="font-mono">Annual Status</span>, and quarterly columns like{' '}
              <span className="font-mono">Q1 Milestone</span>, <span className="font-mono">Q1 Due</span>,{' '}
              <span className="font-mono">Q1 Status</span>.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

