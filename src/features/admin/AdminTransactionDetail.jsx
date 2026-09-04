import { useEffect, useState, useContext } from 'react'
import { Link, useParams } from 'react-router-dom'
import StatusBadge from '../components/StatusBadge'
import { AppContext } from '../../context/ContextProvider'

function formatAmount(amount, currency) {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD' }).format(amount)
  } catch {
    return `${currency} ${amount}`
  }
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2.5 text-xs border-b border-slate-100 last:border-0">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold text-slate-900">{value ?? '—'}</span>
    </div>
  )
}

export default function AdminTransactionDetail() {
  const { id } = useParams()
  const { handleFetchTransaction, isLoading, errMessage } = useContext(AppContext)
  const [txn, setTxn] = useState(null)
  const [localError, setLocalError] = useState('')

  useEffect(() => {
    const getTransaction = async () => {
      setLocalError('')
      try {
        const response = await handleFetchTransaction(id)
        if (response) {
          setTxn(response)
        }
      } catch (err) {
        setLocalError(err.response?.data?.message || 'Could not load this transaction')
      }
    }
    getTransaction()
  }, [id])

  if (isLoading) return <p className="py-16 text-center text-sm text-slate-400">Loading…</p>
  if (localError || errMessage || !txn) return <p className="py-16 text-center text-sm text-rose-600">{localError || errMessage || 'Transaction not found'}</p>

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/admin" className="text-xs font-semibold text-slate-400 hover:text-slate-700">
        ← Back to all transactions
      </Link>

      <div className="mt-3 flex items-start justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{txn.title}</h1>
          <p className="mt-1 text-xs font-mono text-slate-400">
            Created by {txn.user?.name || txn.user?.email} ({txn.user?.role})
          </p>
        </div>
        <StatusBadge status={txn.status} />
      </div>

      <p className="mt-5 text-sm leading-relaxed text-slate-700">{txn.description}</p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Parties</p>
          <Row label="Seller" value={txn.sellerEmail} />
          <Row label="Seller phone" value={txn.sellerTel} />
          <Row label="Buyer" value={txn.buyerEmail} />
          <Row label="Buyer phone" value={txn.buyerTel} />
          <Row
            label="Buyer approved"
            value={txn.buyerApproved ? `Yes, ${new Date(txn.buyerApprovedAt).toLocaleDateString()}` : 'Not yet'}
          />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Terms</p>
          <Row label="Category" value={txn.itemCategory} />
          <Row label="Amount" value={formatAmount(txn.amount, txn.currency)} />
          <Row label="Escrow fee" value={formatAmount(txn.escrowFee, txn.currency)} />
          <Row label="Total held in escrow" value={formatAmount(txn.totalAmount, txn.currency)} />
          <Row label="Shipping method" value={txn.shippingMethod} />
          <Row label="Shipping fee paid by" value={txn.shippingFeeBy} />
        </div>
      </div>

      <div className="mt-6 rounded-xl bg-slate-100 border border-slate-200 p-4 text-xs text-slate-600">
        <strong className="text-slate-800 block mb-0.5">No release/refund actions yet</strong>
        These buttons need dedicated backend endpoints (e.g. <code>PUT /admin/transactions/:id/release</code>,
        <code> /refund</code>) that don't exist yet — happy to add them once you're ready.
      </div>
    </div>
  )
}