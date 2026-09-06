import { useContext, useEffect, useState } from "react"
import { AppContext } from "../../context/ContextProvider"
import { fetchAllTransactionsAdmin } from "../../api"
import { Link } from 'react-router-dom'
import { ArrowUpRight, CheckCircle, Building2, XCircle } from 'lucide-react'
import StatusBadge from '../StatusBadge'
import axios from 'axios'

function formatAmount(amount, currency) {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD' }).format(amount)
  } catch {
    return `${currency || 'USD'} ${amount}`
  }
}

const AdminAllTransactionsContent = () => {
  const { isLoading, errMessage } = useContext(AppContext)
  const [transactions, setTransactions] = useState([])
  const [localError, setLocalError] = useState('')
  const [actionLoadingId, setActionLoadingId] = useState(null)

  useEffect(() => {
    const getTransactions = async () => {
      setLocalError('')
      try {
        const response = await fetchAllTransactionsAdmin()
        if (response) {
          setTransactions(response)
        }
      } catch (err) {
        setLocalError(err.response?.data?.message || 'Could not load transactions')
      }
    }
    getTransactions()
  }, [])

  const handleCompletePayout = async (txnId) => {
    if (!window.confirm("Have you sent the funds to the seller's bank account? This will close the escrow and mark the transaction as completed.")) return
    
    setActionLoadingId(txnId)
    try {
      const { data } = await axios.put(`/admin/transactions/${txnId}/complete-payout`)
      if (data.transaction) {
        setTransactions(prev => prev.map(t => (t._id === txnId ? data.transaction : t)))
      }
    } catch (err) {
      console.error(err.response?.data?.message || err.message)
      alert(err.response?.data?.message || 'Could not complete payout.')
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleResolveDispute = async (txnId, winner) => {
    const actionLabel = winner === 'buyer' ? 'refund the buyer' : 'release funds to the seller and complete'
    if (!window.confirm(`Are you sure you want to resolve this dispute in favor of the ${winner}? This will ${actionLabel}.`)) return

    setActionLoadingId(txnId)
    try {
      const { data } = await axios.put(`/admin/transactions/${txnId}/resolve`, { winner })
      if (data.transaction) {
        setTransactions(prev => prev.map(t => (t._id === txnId ? data.transaction : t)))
      }
    } catch (err) {
      console.error(err.response?.data?.message || err.message)
      alert(err.response?.data?.message || 'Could not resolve dispute.')
    } finally {
      setActionLoadingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-5">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">All transactions</h2>
        <p className="text-slate-500 text-xs">Displaying every available transaction record currently processed across the platform.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading && <p className="py-14 text-center text-xs text-slate-400">Loading…</p>}
        {!isLoading && (localError || errMessage) && <p className="py-14 text-center text-xs text-rose-600">{localError || errMessage}</p>}
        {!isLoading && !localError && !errMessage && transactions.length === 0 && (
          <p className="py-14 text-center text-xs text-slate-500">No transactions recorded in the database yet.</p>
        )}

        {!isLoading && !localError && !errMessage && transactions.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3 px-4">Transaction ID</th>
                  <th className="py-3 px-4">Seller & Payout Details</th>
                  <th className="py-3 px-4">Buyer</th>
                  <th className="py-3 px-4 text-right">Value</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Buyer satisfied</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {transactions.map((txn) => {
                  const isProcessing = actionLoadingId === txn._id
                  const bank = txn?.bankDetails

                  return (
                    <tr key={txn._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-slate-900 font-bold block">{txn._id.slice(-8).toUpperCase()}</span>
                        <span className="text-slate-400 text-[10px] block mt-0.5">{txn.title}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        <span className="font-medium text-slate-900 block">{txn.sellerEmail || '—'}</span>
                        {bank && bank.accountNumber ? (
                          <div className="mt-1 space-y-0.5 bg-slate-50 p-2 rounded-lg border border-slate-200">
                            <p className="font-semibold text-slate-800 flex items-center gap-1">
                              <Building2 className="h-3 w-3 text-indigo-600 shrink-0" />
                              {bank.bankName} ({bank.accountNumber})
                            </p>
                            <p className="text-[10px] text-slate-500">{bank.accountName} {bank.bankCode ? `· Code: ${bank.bankCode}` : ''}</p>
                          </div>
                        ) : (
                          <span className="text-[10px] text-amber-600 italic block mt-0.5">No bank details added</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium">{txn.buyerEmail || '—'}</td>
                      <td className="py-3.5 px-4 text-right font-bold text-slate-900">{formatAmount(txn.totalAmount, txn.currency || 'USD')}</td>
                      <td className="py-3.5 px-4 text-center"><StatusBadge status={txn.status} /></td>
                      <td className="py-3.5 px-4 text-center">
                        {txn.buyerApproved ? (
                          <span className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5">Confirmed</span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5">Pending</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right space-y-2">
                        {/* Admin Action Button: Pending Release */}
                        {txn.status === 'pending_release' && (
                          <div>
                            <button
                              onClick={() => handleCompletePayout(txn._id)}
                              disabled={isProcessing}
                              className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] px-2.5 py-1.5 rounded-lg transition-all disabled:opacity-50 shadow-sm"
                              title="Mark as paid out and complete transaction"
                            >
                              <CheckCircle className="h-3 w-3" />
                              {isProcessing ? 'Processing...' : 'Mark Paid & Complete'}
                            </button>
                          </div>
                        )}

                        {/* Admin Action Buttons: Disputed */}
                        {txn.status === 'disputed' && (
                          <div className="flex flex-col gap-1.5 items-end">
                            <button
                              onClick={() => handleResolveDispute(txn._id, 'buyer')}
                              disabled={isProcessing}
                              className="inline-flex items-center gap-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] px-2.5 py-1.5 rounded-lg transition-all disabled:opacity-50 shadow-sm"
                              title="Rule in favor of buyer and issue refund"
                            >
                              <XCircle className="h-3 w-3" />
                              {isProcessing ? 'Processing...' : 'Refund Buyer'}
                            </button>
                            <button
                              onClick={() => handleResolveDispute(txn._id, 'seller')}
                              disabled={isProcessing}
                              className="inline-flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] px-2.5 py-1.5 rounded-lg transition-all disabled:opacity-50 shadow-sm"
                              title="Rule in favor of seller and release payout"
                            >
                              <CheckCircle className="h-3 w-3" />
                              {isProcessing ? 'Processing...' : 'Payout Seller'}
                            </button>
                          </div>
                        )}

                        <div>
                          <Link to={`/admin/dashboard/transaction/${txn._id}`} className="inline-flex items-center gap-1 text-emerald-700 font-bold hover:underline text-[11px]">
                            View <ArrowUpRight className="h-3 w-3" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminAllTransactionsContent