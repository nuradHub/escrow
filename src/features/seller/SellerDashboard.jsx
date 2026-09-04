import { useContext, useEffect} from 'react'
import { Lock, Wallet, Truck } from 'lucide-react'
import NewTransactionCard from '../NewTransactionCard'
import TransactionsTable from '../TransactionsTable'
import { AppContext } from '../../context/ContextProvider'

const SellerDashboard = ()=> {
  const { currentUser, handleTransactions, setTransactions, transactions, isLoading, errMessage } = useContext(AppContext)

  useEffect(() => {
    const getTransactions = async ()=> {
      const response = await handleTransactions()
      if(response){
        setTransactions(response)
      }
    }
    getTransactions()
  }, [])

  const initials = (currentUser?.name || currentUser?.email || '?').slice(0, 2).toUpperCase()
  
  const userEmail = currentUser?.email;

  const sellerTransactions = transactions.filter(transaction => transaction?.sellerEmail === userEmail)

  // 2. Sum up the amounts
  const escrowHoldsTotal = sellerTransactions
    .filter(txn => txn.status === 'paid')
    .reduce((sum, txn) => sum + Number(txn.amount || 0), 0)

  const amountReleaseTotal = sellerTransactions
    .filter(txn => txn.status === 'released')
    .reduce((sum, txn) => sum + Number(txn.amount || 0), 0)

  const activeOrders = sellerTransactions.filter(txn => txn.status === 'pending' || txn.status === 'in-progress')

  return (
    <div>
      <div className="flex flex-col  md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-5 mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Seller dashboard</h2>
          <p className="text-slate-500 text-xs">Track inbound deals and funds waiting to be released to you.</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-xs text-slate-400 font-medium">
            Signed in as: <strong className="text-slate-700">{currentUser?.name || currentUser?.email}</strong>
          </span>
          <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-700 font-bold text-xs flex items-center justify-center border border-indigo-500/30">
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
            <span className="text-[10px] text-amber-600 font-medium block mt-0.5">Awaiting buyer confirmation.</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="bg-emerald-100 text-emerald-700 p-3 rounded-xl"><Wallet className="h-5 w-5" /></div>
          <div>
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Released to you</span>
            <span className="text-lg font-bold text-slate-900 block">${amountReleaseTotal.toFixed(2)}</span>
            <span className="text-[10px] text-emerald-600 font-medium block mt-0.5">From completed deals.</span>
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
        <NewTransactionCard role="seller" />

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Inbound orders</h3>
                <p className="text-slate-400 text-[11px] mt-0.5">Deals you've listed or been added to as seller.</p>
              </div>
              <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Seller account</span>
            </div>

            {isLoading && <p className="py-14 text-center text-xs text-slate-400">Loading…</p>}
            {!isLoading && errMessage && <p className="py-14 text-center text-xs text-rose-600">{errMessage}</p>}
            {!isLoading && !errMessage && (
              <TransactionsTable
                transactions={sellerTransactions}
                counterpartyLabel="Buyer"
                getCounterparty={(txn) => txn.buyerEmail}
                emptyMessage="No orders yet. List an item on the left."
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SellerDashboard

