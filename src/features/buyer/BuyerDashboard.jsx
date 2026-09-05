import { useContext, useEffect } from 'react'
import { Lock, Wallet, Truck } from 'lucide-react'
import NewTransactionCard from '../NewTransactionCard'
import TransactionsTable from '../TransactionsTable'
import { AppContext } from '../../context/ContextProvider'

const BuyerDashboard = () => {
  const { currentUser, handleTransactions, setTransactions, transactions, isLoading, errMessage, setCurrentUser, handleCurrentUser } = useContext(AppContext)

  useEffect(() => {
    const getUser = async () => {
      const response = await handleCurrentUser()
      if (response) {
        setCurrentUser(response)
      }
    }
    getUser()
  }, [])

  useEffect(() => {
    const getTransactions = async () => {
      const response = await handleTransactions()
      if (response) {
        setTransactions(response)
      }
    }
    getTransactions()
  }, [])

  const initials = (currentUser?.name || currentUser?.email || '?').slice(0, 2).toUpperCase()
  const userEmail = currentUser?.email

  const buyerTransactions = transactions.filter(transaction => transaction?.buyerEmail === userEmail)

  // Sum up metrics for buyer
  const escrowHoldsTotal = buyerTransactions
    .filter(txn => txn.status === 'paid' || txn.status === 'in_progress' || txn.status === 'pending_release')
    .reduce((sum, txn) => sum + Number(txn.amount || 0), 0)

  const amountCompletedTotal = buyerTransactions
    .filter(txn => txn.status === 'completed')
    .reduce((sum, txn) => sum + Number(txn.amount || 0), 0)

  const activeOrders = buyerTransactions.filter(txn => txn.status === 'pending' || txn.status === 'in_progress' || txn.status === 'agreed')

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-5 mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Buyer dashboard</h2>
          <p className="text-slate-500 text-xs">Start new deals and track funds held on your behalf.</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-xs text-slate-400 font-medium">
            Signed in as: <strong className="text-slate-700">{currentUser?.name || currentUser?.email}</strong>
          </span>
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-700 font-bold text-xs flex items-center justify-center border border-emerald-500/30">
            {initials}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="bg-amber-100 text-amber-700 p-3 rounded-xl"><Lock className="h-5 w-5" /></div>
          <div>
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Held in escrow</span>
            <span className="text-lg font-bold text-slate-900 block">${escrowHoldsTotal.toFixed(2)}</span>
            <span className="text-[10px] text-amber-600 font-medium block mt-0.5">Secured pending confirmation.</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="bg-emerald-100 text-emerald-700 p-3 rounded-xl"><Wallet className="h-5 w-5" /></div>
          <div>
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Completed deals</span>
            <span className="text-lg font-bold text-slate-900 block">${amountCompletedTotal.toFixed(2)}</span>
            <span className="text-[10px] text-emerald-600 font-medium block mt-0.5">Successfully finalized.</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="bg-slate-100 text-slate-700 p-3 rounded-xl"><Truck className="h-5 w-5" /></div>
          <div>
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Active orders</span>
            <span className="text-lg font-bold text-slate-900 block">{activeOrders?.length}</span>
            <span className="text-[10px] text-slate-500 font-medium block mt-0.5">Currently in progress.</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <NewTransactionCard role="buyer" />

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-sm font-bold text-slate-900">My transactions</h3>
                <p className="text-slate-400 text-[11px] mt-0.5">Every deal you've started or been added to as buyer.</p>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Buyer account</span>
            </div>

            {isLoading && <p className="py-14 text-center text-xs text-slate-400">Loading…</p>}
            {!isLoading && errMessage && <p className="py-14 text-center text-xs text-rose-600">{errMessage}</p>}
            {!isLoading && !errMessage && (
              <TransactionsTable
                transactions={buyerTransactions}
                counterpartyLabel="Seller"
                getCounterparty={(txn) => txn.sellerEmail}
                emptyMessage="No transactions yet. Start one on the left."
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BuyerDashboard