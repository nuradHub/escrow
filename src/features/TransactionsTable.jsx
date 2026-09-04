import { Link, useNavigate } from 'react-router-dom'
import StatusBadge from './StatusBadge'
import { useContext } from 'react'
import { AppContext } from '../context/ContextProvider'

export default function TransactionsTable({ transactions, counterpartyLabel, getCounterparty, emptyMessage }) {

  const {currentUser} = useContext(AppContext)

  if (transactions.length === 0) {
    return (
      <div className="py-14 text-center">
        <p className="text-sm text-slate-500">{emptyMessage}</p>
      </div>
    )
  }

  const formatAmount = (amount, currency)=> {
    try{
      return new Intl.NumberFormat('en-US', {style: 'currency', currency: currency || 'USD'}).format(amount)
    }catch(err){
      return `${currency} ${amount}`
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-slate-200">
            <th className="py-3 px-4">Transaction / Item</th>
            <th className="py-3 px-4">{counterpartyLabel}</th>
            <th className="py-3 px-4 text-right">Value</th>
            <th className="py-3 px-4 text-center">Status</th>
            <th className="py-3 px-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-xs">
          {transactions.map((txn) => (
            <tr key={txn._id} className="hover:bg-slate-50/80 transition-colors">
              <td className="py-3.5 px-4">
                <span className="font-mono text-slate-900 font-bold block">{txn._id.slice(-8).toUpperCase()}</span>
                <span className="text-slate-400 text-[10px] block mt-0.5">{txn.title}</span>
              </td>
              <td className="py-3.5 px-4 text-slate-600 font-medium">{getCounterparty(txn) || '—'}</td>
              <td className="py-3.5 px-4 text-right font-bold text-slate-900">{formatAmount(txn.totalAmount, txn.currency)}</td>
              <td className="py-3.5 px-4 text-center"><StatusBadge status={txn.status} /></td>
              <td className="py-3.5 px-4 text-right">
                <Link to={currentUser.role === 'seller' ? `/seller/dashboard/transaction/${txn._id}` : `/buyer/dashboard/transaction/${txn._id}`} className="text-emerald-700 font-bold hover:underline">
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
