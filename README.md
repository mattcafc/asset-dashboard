# Strategic Initiative Portfolio Dashboard

Professional, board-level portfolio dashboard for tracking strategic initiatives using **React**, **TypeScript**, and **Tailwind CSS**.

## What’s included

- **Executive summary**: status donut + portfolio health score + current quarter
- **Portfolio metrics**: % complete, % on track, risk count
- **Theme roll-ups**: grouped by `Opportunity` with worst-case health and progress
- **Initiative table**: sortable, filterable, quarter status dots, risk flags, row drill-down
- **Quarterly timeline**: milestone markers by quarter + overdue highlighting
- **Risk register**: annual risk and quarterly risk flags with notes
- **CSV ingestion**: upload or paste; persisted to local storage
- **Export to PDF**: board paper pack export from the dashboard view
- **Dark mode**: presentation-friendly toggle

## Run

```bash
npm install
npm run dev
```

## CSV format

Required/expected columns include:

- `ID`
- `Strategic Initiative`
- `Opportunity`
- `Lead`
- `Accountable Executive`
- `Annual Status`
- `Annual Status Notes`
- `Impact / Return Horizon`
- `Q1 Milestone`, `Q1 Due`, `Q1 Status`, `Q1 Status Notes` (and Q2–Q4 equivalents)
