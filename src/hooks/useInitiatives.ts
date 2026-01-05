import { useEffect, useMemo, useState } from 'react'
import type { Initiative } from '../types/initiative'
import { parseInitiativesCsv } from '../utils/csvParser'

const STORAGE_KEY = 'portfolioDashboard.csv.v1'

const SAMPLE_CSV = `ID,Strategic Initiative,Opportunity,Lead,Accountable Executive,Annual Status,Annual Status Notes,Impact / Return Horizon,Q1 Milestone,Q1 Due,Q1 Status,Q1 Status Notes,Q2 Milestone,Q2 Due,Q2 Status,Q2 Status Notes,Q3 Milestone,Q3 Due,Q3 Status,Q3 Status Notes,Q4 Milestone,Q4 Due,Q4 Status,Q4 Status Notes
SI-001,Digital Sales Enablement,Commercial Growth,A. Patel,COO,On Track,"Adoption tracking in place; rollout 65% complete",0-12 months,CRM pilot complete,2026-01-31,Complete,"Pilot delivered on time",Sales playbooks v2,2026-04-15,On Track,"Drafting complete; stakeholder review",Field rollout wave 2,2026-08-15,On Track,"Dependency: training capacity",Benefits realization review,2026-11-30,Not Commenced,"Plan approved"
SI-002,Cost-to-Serve Optimization,Operational Excellence,J. Kim,CFO,At Risk,"Vendor negotiation delayed; mitigation underway",12-24 months,Baseline model,2026-02-10,On Track,"Data validated",Contract renegotiation,2026-05-01,At Risk,"Legal review backlog",Process redesign,2026-08-30,Not Commenced,"Awaiting approvals",Savings verification,2026-12-05,Not Commenced,""
SI-003,Customer Data Platform,Data & Analytics,S. Rivera,CIO,Blocked,"Platform choice unresolved; escalated to steering group",12-24 months,Requirements sign-off,2026-01-20,At Risk,"Scope creep risk",Vendor selection,2026-04-20,Not Commenced,"",Implementation sprint 1,2026-07-20,Not Commenced,"",Go-live,2026-10-31,Not Commenced,""
SI-004,ESG Reporting Automation,Risk & Compliance,M. Chen,CEO,In Progress,"Core data sources mapped; controls design in progress",0-12 months,Source inventory,2026-03-05,On Track,"",Controls design,2026-06-10,On Track,"",Automation build,2026-09-15,Not Commenced,"",Assurance readiness,2026-12-01,Not Commenced,""
`

export function useInitiatives() {
  const [csvText, setCsvText] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved && saved.trim() ? saved : SAMPLE_CSV
    } catch {
      return SAMPLE_CSV
    }
  })

  const parsed = useMemo(() => parseInitiativesCsv(csvText), [csvText])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, csvText)
    } catch {
      // ignore (private mode / restricted)
    }
  }, [csvText])

  const clear = () => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
    setCsvText(SAMPLE_CSV)
  }

  return {
    csvText,
    setCsvText,
    initiatives: parsed.initiatives as Initiative[],
    warnings: parsed.warnings,
    clear,
  }
}

