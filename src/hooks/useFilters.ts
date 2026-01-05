import { useMemo, useState } from 'react'
import type { Initiative, Quarter, Status } from '../types/initiative'
import { QUARTERS } from '../utils/dateUtils'

export interface FiltersState {
  opportunity: string | 'All'
  lead: string | 'All'
  status: Status | 'All'
  quarter: Quarter | 'All'
  search: string
}

const DEFAULT_FILTERS: FiltersState = {
  opportunity: 'All',
  lead: 'All',
  status: 'All',
  quarter: 'All',
  search: '',
}

export function useFilters(initiatives: Initiative[]) {
  const [filters, setFilters] = useState<FiltersState>(DEFAULT_FILTERS)

  const options = useMemo(() => {
    const opportunities = Array.from(new Set(initiatives.map((i) => i.opportunity).filter(Boolean))).sort()
    const leads = Array.from(new Set(initiatives.map((i) => i.lead).filter(Boolean))).sort()
    const statuses = Array.from(new Set(initiatives.map((i) => i.annualStatus))).sort()
    return { opportunities, leads, statuses, quarters: QUARTERS }
  }, [initiatives])

  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase()
    return initiatives.filter((i) => {
      if (filters.opportunity !== 'All' && i.opportunity !== filters.opportunity) return false
      if (filters.lead !== 'All' && i.lead !== filters.lead) return false
      if (filters.status !== 'All' && i.annualStatus !== filters.status) return false
      if (filters.quarter !== 'All' && !i.quarters[filters.quarter].milestone) return false
      if (q) {
        const hay = `${i.id} ${i.name}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [initiatives, filters])

  const reset = () => setFilters(DEFAULT_FILTERS)

  return { filters, setFilters, options, filtered, reset }
}

