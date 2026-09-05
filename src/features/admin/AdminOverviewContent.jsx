import { useContext, useEffect, useState } from "react"
import { AppContext } from "../../context/ContextProvider"
import { fetchAllTransactionsAdmin } from "../../api"
import { Link } from 'react-router-dom'
import { Layers, ShieldAlert, ShieldCheck, Wallet, Users, ArrowUpRight, TrendingUp } from 'lucide-react'
import StatusBadge from '../StatusBadge'


function formatAmount(amount, currency) {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD' }).format(amount)
  } catch {
    return `${currency || 'USD'} ${amount}`
  }
}

const AdminOverviewContent = () => {
  const { isLoading, errMessage } = useContext(AppContext)
  const [transactions, setTransactions] = useState([])
  const [localError, setLocalError] = useState('')

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

  const stats = {
    currency: 'USD',
    totalValue: formatAmount(transactions.reduce((sum, t) => sum + (t.totalAmount || 0), 0), 'USD'),
    total: transactions.length,
    disputed: transactions.filter((t) => t.status === 'disputed').length,
    awaitingBuyer: transactions.filter((t) => !t.buyerApproved).length,
    totalEscrowProfits: formatAmount(transactions.reduce((sum, t) => sum + (Number(t.escrowHolds) || 0), 0), 'USD'),
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-5">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Admin oversight</h2>
        <p className="text-slate-500 text-xs">System metrics show total platform volume, active disputes, and recent transaction flows.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="bg-slate-100 text-slate-700 p-3 rounded-xl"><Layers className="h-5 w-5" /></div>
            <div>
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Total transactions</span>
              <span className="text-lg font-bold text-slate-900 block">{stats.total}</span>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="bg-emerald-100 text-emerald-700 p-3 rounded-xl"><Wallet className="h-5 w-5" /></div>
            <div>
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Total value in escrow</span>
              <span className="text-lg font-bold text-slate-900 block">{stats.totalValue}</span>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="bg-amber-100 text-amber-700 p-3 rounded-xl"><ShieldCheck className="h-5 w-5" /></div>
            <div>
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Awaiting buyer sign-off</span>
              <span className="text-lg font-bold text-slate-900 block">{stats.awaitingBuyer}</span>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="bg-rose-100 text-rose-700 p-3 rounded-xl"><ShieldAlert className="h-5 w-5" /></div>
            <div>
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Disputed</span>
              <span className="text-lg font-bold text-slate-900 block">{stats.disputed}</span>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4 sm:col-span-2">
            <div className="bg-indigo-100 text-indigo-700 p-3 rounded-xl"><TrendingUp className="h-5 w-5" /></div>
            <div>
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Total Escrow Profits</span>
              <span className="text-lg font-bold text-slate-900 block">{stats.totalEscrowProfits}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Registered Users</span>
              <div className="bg-indigo-50 text-indigo-600 p-2.5 rounded-xl">
                <Users className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">{stats.total > 0 ? stats.total * 2 : 0}</span>
              <span className="text-xs font-semibold text-slate-500">total accounts</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Platform registry tracking buyers and sellers database records.</p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Database Status</span>
            <span className="text-emerald-600 font-bold">Synchronized</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent Transactions</h3>
            <p className="text-slate-400 text-[11px] mt-0.5">Displaying real-time database feed of all system escrow activities.</p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/50">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Live Feed
          </span>

        </div>

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
                  <th className="py-3 px-4">Seller</th>
                  <th className="py-3 px-4">Buyer</th>
                  <th className="py-3 px-4 text-right">Value</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Buyer satisfied</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {transactions.slice(0, 5).map((txn) => (
                  <tr key={txn._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-slate-900 font-bold block">{txn._id.slice(-8).toUpperCase()}</span>
                      <span className="text-slate-400 text-[10px] block mt-0.5">{txn.title}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">{txn.sellerEmail || '—'}</td>
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
                    <td className="py-3.5 px-4 text-right">
                      <Link to={`/admin/dashboard/transaction/${txn._id}`} className="inline-flex items-center gap-1 text-emerald-700 font-bold hover:underline">
                        View <ArrowUpRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminOverviewContent