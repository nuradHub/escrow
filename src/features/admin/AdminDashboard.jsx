import {useState } from 'react'
import {Users, LayoutDashboard, Receipt, UserCog } from 'lucide-react'
import AdminOverviewContent from './AdminOverviewContent'
import AdminAllTransactionsContent from './AdminAllTransactionsContent'
import AdminAdminsContent from './AdminAdminsContent'
import AdminUsersContent from './AdminUsersContent'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-5 gap-8 items-start min-h-[calc(100vh-120px)] pb-24 lg:pb-0">
      {/* Sidebar Navigation Panel */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md p-3 border-t border-slate-200 shadow-lg lg:sticky lg:col-span-1 lg:p-4 lg:rounded-2xl lg:border lg:border-slate-200 lg:shadow-sm lg:space-y-1 lg:top-6 lg:flex lg:flex-col lg:justify-between lg:h-full lg:min-h-125]">
        <div className="flex justify-around items-center space-x-1 lg:space-y-1 lg:flex-col lg:space-x-0 lg:w-full">
          <div className="hidden lg:block px-3 py-2 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Admin Control
          </div>
          
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col lg:flex-row items-center justify-center lg:justify-start lg:space-x-3 px-3 py-2.5 rounded-xl text-[10px] lg:text-xs font-semibold transition-colors flex-1 lg:flex-none lg:w-full ${
              activeTab === 'dashboard'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="h-4 w-4 mb-1 lg:mb-0 shrink-0" />
            <span className="text-center lg:text-left">Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('transactions')}
            className={`flex flex-col lg:flex-row items-center justify-center lg:justify-start lg:space-x-3 px-3 py-2.5 rounded-xl text-[10px] lg:text-xs font-semibold transition-colors flex-1 lg:flex-none lg:w-full ${
              activeTab === 'transactions'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Receipt className="h-4 w-4 mb-1 lg:mb-0 shrink-0" />
            <span className="text-center lg:text-left">Transactions</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`flex flex-col lg:flex-row items-center justify-center lg:justify-start lg:space-x-3 px-3 py-2.5 rounded-xl text-[10px] lg:text-xs font-semibold transition-colors flex-1 lg:flex-none lg:w-full ${
              activeTab === 'users'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Users className="h-4 w-4 mb-1 lg:mb-0 shrink-0" />
            <span className="text-center lg:text-left">Users</span>
          </button>

          <button
            onClick={() => setActiveTab('admins')}
            className={`flex flex-col lg:flex-row items-center justify-center lg:justify-start lg:space-x-3 px-3 py-2.5 rounded-xl text-[10px] lg:text-xs font-semibold transition-colors flex-1 lg:flex-none lg:w-full ${
              activeTab === 'admins'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <UserCog className="h-4 w-4 mb-1 lg:mb-0 shrink-0" />
            <span className="text-center lg:text-left">Admins</span>
          </button>
        </div>

        <div className="hidden lg:block px-3 py-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-400">
          <span>System Status: </span>
          <span className="text-emerald-600 font-bold">Online</span>
        </div>
      </div>

<<<<<<< HEAD
      {/* Right Content Area toggling active views */}
      <div className="w-full lg:col-span-4 px-2 lg:px-0">
        {activeTab === 'dashboard' && <AdminOverviewContent />}
        {activeTab === 'transactions' && <AdminAllTransactionsContent />}
        {activeTab === 'users' && <AdminUsersContent />}
        {activeTab === 'admins' && <AdminAdminsContent />}
=======
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-900">All transactions</h3>
          <p className="text-slate-400 text-[11px] mt-0.5">Release/refund actions will appear here</p>
        </div>

        {isLoading && <p className="py-14 text-center text-xs text-slate-400">Loading…</p>}
        {!isLoading && (localError || errMessage) && <p className="py-14 text-center text-xs text-rose-600">{localError || errMessage}</p>}
        {!isLoading && !localError && !errMessage && transactions.length === 0 && (
          <p className="py-14 text-center text-xs text-slate-500">No transactions on the platform yet.</p>
        )}

        {!isLoading && !localError && !errMessage && transactions.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3 px-4">Transaction</th>
                  <th className="py-3 px-4">Seller</th>
                  <th className="py-3 px-4">Buyer</th>
                  <th className="py-3 px-4 text-right">Value</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Buyer satisfied</th>
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
                      <Link to={`/admin/dashboard/transaction/${txn._id}`} className="text-emerald-700 font-bold hover:underline">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
>>>>>>> f1184795e87923895f28d00a16b132efd1c4ef80
      </div>
    </div>
  )
}

export default AdminDashboard
