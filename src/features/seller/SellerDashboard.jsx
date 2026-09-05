import { useContext, useEffect, useState } from 'react'
import { Lock, Wallet, Truck, Building2, CheckCircle2 } from 'lucide-react'
import NewTransactionCard from '../NewTransactionCard'
import TransactionsTable from '../TransactionsTable'
import { AppContext } from '../../context/ContextProvider'
import axios from 'axios'

const SellerDashboard = () => {
  const { currentUser, handleTransactions, setTransactions, transactions, isLoading, errMessage, handleCurrentUser, setCurrentUser } = useContext(AppContext)

  const [bankForm, setBankForm] = useState({
    accountName: '',
    accountNumber: '',
    bankCode: '',
    bankName: ''
  })
  const [savingBank, setSavingBank] = useState(false)
  const [bankSuccess, setBankSuccess] = useState('')
  const [bankError, setBankError] = useState('')

  useEffect(() => {
    const getUser = async () => {
      const response = await handleCurrentUser()
      if (response) {
        setCurrentUser(response)
        if (response.bankDetails) {
          setBankForm(response.bankDetails)
        }
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

  const handleSaveBank = async (e) => {
    e.preventDefault()
    setSavingBank(true)
    setBankSuccess('')
    setBankError('')
    try {
      const { data } = await axios.put('/users/bank-details', bankForm)
      setCurrentUser(data.user)
      setBankSuccess('Payout account saved successfully!')
    } catch (err) {
      setBankError(err.response?.data?.message || 'Could not save bank details.')
    } finally {
      setSavingBank(false)
    }
  }

  const initials = (currentUser?.name || currentUser?.email || '?').slice(0, 2).toUpperCase()
  const userEmail = currentUser?.email

  const sellerTransactions = transactions.filter(transaction => transaction?.sellerEmail === userEmail)

  const escrowHoldsTotal = sellerTransactions
    .filter(txn => txn.status === 'paid' || txn.status === 'in_progress' || txn.status === 'pending_release')
    .reduce((sum, txn) => sum + Number(txn.amount || 0), 0)

  const amountReleaseTotal = sellerTransactions
    .filter(txn => txn.status === 'completed')
    .reduce((sum, txn) => sum + Number(txn.amount || 0), 0)

  const activeOrders = sellerTransactions.filter(txn => txn.status === 'pending' || txn.status === 'in_progress')

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-5 mb-8 gap-4">
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
        <div className="space-y-6">
          <NewTransactionCard role="seller" />

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-indigo-100 text-indigo-700 p-2.5 rounded-xl"><Building2 className="h-5 w-5" /></div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Payout Account</h3>
                  <p className="text-xs text-slate-400">Where earnings will be sent.</p>
                </div>
              </div>
              {currentUser?.bankDetails?.accountNumber && (
                <span className="flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Active
                </span>
              )}
            </div>

            {bankSuccess && (
              <p className="mb-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                {bankSuccess}
              </p>
            )}
            {bankError && (
              <p className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                {bankError}
              </p>
            )}

            <form onSubmit={handleSaveBank} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Bank Name</label>
                <input
                  type="text"
                  placeholder="e.g. JPMorgan Chase"
                  value={bankForm.bankName}
                  onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Account Number</label>
                <input
                  type="text"
                  placeholder="0123456789"
                  maxLength={10}
                  value={bankForm.accountNumber}
                  onChange={(e) => setBankForm({ ...bankForm, accountNumber: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Account Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={bankForm.accountName}
                  onChange={(e) => setBankForm({ ...bankForm, accountName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Bank Code (Optional)</label>
                <input
                  type="text"
                  placeholder="044"
                  value={bankForm.bankCode}
                  onChange={(e) => setBankForm({ ...bankForm, bankCode: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={savingBank}
                  className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 py-2.5 text-xs font-bold text-white transition-all disabled:opacity-50"
                >
                  {savingBank ? 'Saving...' : 'Save Payout Account'}
                </button>
              </div>
            </form>
          </div>
        </div>

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