import { useEffect, useMemo, useRef, useState } from 'react'
import { CsvImportDialog } from './components/dashboard/CsvImportDialog'
import { ExecutiveSummary } from './components/dashboard/ExecutiveSummary'
import { InitiativeTable } from './components/dashboard/InitiativeTable'
import { PortfolioMetrics } from './components/dashboard/PortfolioMetrics'
import { RiskRegister } from './components/dashboard/RiskRegister'
import { ThemeCards } from './components/dashboard/ThemeCards'
import { TimelineView } from './components/dashboard/TimelineView'
import { FilterBar } from './components/ui/FilterBar'
import { useFilters } from './hooks/useFilters'
import { useInitiatives } from './hooks/useInitiatives'
import { exportElementToPdf } from './utils/pdfExport'

const THEME_STORAGE_KEY = 'portfolioDashboard.theme.v1'

function applyTheme(dark: boolean) {
  const root = document.documentElement
  root.classList.toggle('dark', dark)
}

export default function App() {
  const { csvText, setCsvText, initiatives, warnings } = useInitiatives()
  const { filters, setFilters, options, filtered, reset } = useFilters(initiatives)

  const [importOpen, setImportOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY)
      const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ?? false
      return saved ? saved === 'dark' : prefersDark
    } catch {
      return false
    }
  })
  const dashboardRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    applyTheme(darkMode)
  }, [darkMode])

  const onToggleDarkMode = () => {
    setDarkMode((d) => {
      const next = !d
      localStorage.setItem(THEME_STORAGE_KEY, next ? 'dark' : 'light')
      applyTheme(next)
      return next
    })
  }

  const title = useMemo(() => {
    const parts: string[] = []
    if (filters.opportunity !== 'All') parts.push(filters.opportunity)
    if (filters.lead !== 'All') parts.push(`Lead: ${filters.lead}`)
    if (filters.status !== 'All') parts.push(`Status: ${filters.status}`)
    if (filters.quarter !== 'All') parts.push(`Quarter: ${filters.quarter}`)
    return parts.length ? `Portfolio Dashboard — ${parts.join(' · ')}` : 'Portfolio Dashboard'
  }, [filters])

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-[1400px] px-4 py-6">
        <div className="mb-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Strategic initiative portfolio
          </div>
          <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              Board-level dashboard
            </h1>
            <div className="text-sm text-slate-600 dark:text-slate-300">
              Showing <span className="font-semibold text-slate-900 dark:text-slate-100">{filtered.length}</span> of{' '}
              <span className="font-semibold text-slate-900 dark:text-slate-100">{initiatives.length}</span>
            </div>
          </div>
        </div>

        {warnings.length ? (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100">
            <div className="font-semibold">CSV warnings</div>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {warnings.slice(0, 4).map((w, idx) => (
                <li key={idx}>{w}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div ref={dashboardRef} className="space-y-4">
          <ExecutiveSummary
            initiatives={filtered}
            onOpenImport={() => setImportOpen(true)}
            onExportPdf={async () => {
              if (!dashboardRef.current) return
              await exportElementToPdf({ element: dashboardRef.current, title })
            }}
            darkMode={darkMode}
            onToggleDarkMode={onToggleDarkMode}
          />

          <PortfolioMetrics initiatives={filtered} />

          <FilterBar filters={filters} setFilters={setFilters} options={options} onReset={reset} />

          <ThemeCards
            initiatives={filtered}
            onSelectTheme={(opportunity) => setFilters({ ...filters, opportunity })}
          />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <InitiativeTable initiatives={filtered} />
            </div>
            <div className="lg:col-span-4">
              <RiskRegister initiatives={filtered} />
            </div>
          </div>

          <TimelineView initiatives={filtered} focusQuarter={filters.quarter} />
        </div>

        <CsvImportDialog
          key={importOpen ? 'open' : 'closed'}
          open={importOpen}
          initialCsv={csvText}
          onClose={() => setImportOpen(false)}
          onApply={(next) => {
            setCsvText(next)
            setImportOpen(false)
          }}
        />
      </div>
    </div>
  )
}
