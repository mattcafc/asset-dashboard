export type Quarter = 'Q1' | 'Q2' | 'Q3' | 'Q4'

export type Status = 'Complete' | 'On Track' | 'At Risk' | 'Blocked' | 'In Progress' | 'Not Commenced'

export interface QuarterMilestone {
  milestone: string
  /**
   * Parsed due date (if provided). Kept separate from `dueRaw` so we can
   * preserve whatever the CSV contained.
   */
  due?: Date
  dueRaw?: string
  status: Status
  statusNotes: string
}

export interface Initiative {
  id: string
  name: string
  opportunity: string
  lead: string
  accountableExecutive: string
  annualStatus: Status
  annualStatusNotes: string
  impactReturnHorizon: string
  quarters: Record<Quarter, QuarterMilestone>
}

export interface ParsedInitiativesResult {
  initiatives: Initiative[]
  warnings: string[]
}

