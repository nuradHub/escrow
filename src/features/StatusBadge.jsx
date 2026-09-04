const STYLES = {
  pending: { label: 'Pending', bg: 'bg-amber-100', text: 'text-amber-800' },
  agreed: { label: 'Agreed', bg: 'bg-blue-100', text: 'text-blue-800' },
  paid: { label: 'Funded', bg: 'bg-blue-100', text: 'text-blue-800' },
  in_progress: { label: 'In progress', bg: 'bg-purple-100', text: 'text-purple-800' },
  released: { label: 'Released', bg: 'bg-emerald-100', text: 'text-emerald-800' },
  completed: { label: 'Completed', bg: 'bg-emerald-100', text: 'text-emerald-800' },
  disputed: { label: 'Disputed', bg: 'bg-rose-100', text: 'text-rose-800' },
  refunded: { label: 'Refunded', bg: 'bg-slate-100', text: 'text-slate-600' },
  canceled: { label: 'Canceled', bg: 'bg-slate-100', text: 'text-slate-600' },
}

export default function StatusBadge({ status }) {
  const style = STYLES[status] || STYLES.pending

  return (
    <span className={`inline-flex items-center rounded font-mono text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 ${style.bg} ${style.text}`}>
      {style.label}
    </span>
  )
}
