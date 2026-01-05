import Papa from 'papaparse'
import type { Initiative, ParsedInitiativesResult, Quarter, Status } from '../types/initiative'
import { QUARTERS, parseDateLoose } from './dateUtils'
import { normalizeStatus } from './statusCalculations'

type Row = Record<string, unknown>

const requiredHeaders = ['ID', 'Strategic Initiative', 'Opportunity', 'Lead', 'Annual Status'] as const

function getString(row: Row, key: string): string {
  const v = row[key]
  if (v === null || v === undefined) return ''
  return String(v).trim()
}

function quarterKey(q: Quarter, suffix: string): string {
  // CSV format: "Q1 Milestone", "Q1 Due", "Q1 Status", "Q1 Status Notes"
  return `${q} ${suffix}`
}

function parseQuarter(row: Row, q: Quarter): { milestone: string; dueRaw?: string; due?: Date; status: Status; statusNotes: string } {
  const milestone = getString(row, quarterKey(q, 'Milestone'))
  const dueRaw = getString(row, quarterKey(q, 'Due'))
  const due = parseDateLoose(dueRaw)
  const status = normalizeStatus(getString(row, quarterKey(q, 'Status')))
  const statusNotes = getString(row, quarterKey(q, 'Status Notes'))
  return { milestone, dueRaw: dueRaw || undefined, due, status, statusNotes }
}

export function parseInitiativesCsv(csvText: string): ParsedInitiativesResult {
  const warnings: string[] = []
  const trimmed = csvText.trim()
  if (!trimmed) return { initiatives: [], warnings: [] }

  const parsed = Papa.parse<Row>(trimmed, {
    header: true,
    skipEmptyLines: 'greedy',
    dynamicTyping: false,
    transformHeader: (h) => h.trim(),
  })

  if (parsed.errors?.length) {
    warnings.push(...parsed.errors.slice(0, 5).map((e) => `CSV parse: ${e.message} (row ${e.row ?? '—'})`))
  }

  const rows = (parsed.data ?? []).filter((r) => Object.keys(r ?? {}).length > 0)
  if (rows.length === 0) return { initiatives: [], warnings }

  const headers = Object.keys(rows[0] ?? {})
  const missing = requiredHeaders.filter((h) => !headers.includes(h))
  if (missing.length) {
    warnings.push(
      `Missing expected header(s): ${missing.join(', ')}. Parsing will continue, but results may be incomplete.`,
    )
  }

  const initiatives: Initiative[] = rows
    .map((row, idx) => {
      const id = getString(row, 'ID') || `ROW-${idx + 1}`
      const name = getString(row, 'Strategic Initiative')
      const opportunity = getString(row, 'Opportunity')
      const lead = getString(row, 'Lead')
      const accountableExecutive = getString(row, 'Accountable Executive')
      const annualStatus = normalizeStatus(getString(row, 'Annual Status'))
      const annualStatusNotes = getString(row, 'Annual Status Notes')
      const impactReturnHorizon = getString(row, 'Impact / Return Horizon')

      const quarters = QUARTERS.reduce((acc, q) => {
        acc[q] = parseQuarter(row, q)
        return acc
      }, {} as Initiative['quarters'])

      return {
        id,
        name,
        opportunity,
        lead,
        accountableExecutive,
        annualStatus,
        annualStatusNotes,
        impactReturnHorizon,
        quarters,
      }
    })
    // Drop empty placeholder rows (common in pasted exports)
    .filter((i) => i.id.trim() || i.name.trim())

  return { initiatives, warnings }
}

