import { useContext, useState, useEffect } from 'react'
import { Users, LayoutDashboard, Receipt, UserCog } from 'lucide-react'
import AdminOverviewContent from './AdminOverviewContent'
import AdminAllTransactionsContent from './AdminAllTransactionsContent'
import AdminAdminsContent from './AdminAdminsContent'
import AdminUsersContent from './AdminUsersContent'
import { AppContext } from '../../context/ContextProvider'
import { fetchAllUsers } from '../../api'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard')

  const { setCurrentUser, handleCurrentUser } = useContext(AppContext)

  const [admins, setAdmins] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
    const getAllUsers = async () => {
      try {
        setLoading(true)
        const response = await fetchAllUsers()
        if (response) {
          const user = response.filter((f)=> f.role === 'buyer' || f.role === 'seller')
          const admin = response.filter((f)=> f.role === 'admin')
          setUsers(user)
          setAdmins(admin)
        }
      } catch (err) {
        console.log(err.message)
        setError(err.response?.data?.message)
      }finally{
        setLoading(false)
      }
    }
    getAllUsers()
  }, [])

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
            className={`flex flex-col lg:flex-row items-center justify-center lg:justify-start lg:space-x-3 px-3 py-2.5 rounded-xl text-[10px] lg:text-xs font-semibold transition-colors flex-1 lg:flex-none lg:w-full ${activeTab === 'dashboard'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
          >
            <LayoutDashboard className="h-4 w-4 mb-1 lg:mb-0 shrink-0" />
            <span className="text-center lg:text-left">Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('transactions')}
            className={`flex flex-col lg:flex-row items-center justify-center lg:justify-start lg:space-x-3 px-3 py-2.5 rounded-xl text-[10px] lg:text-xs font-semibold transition-colors flex-1 lg:flex-none lg:w-full ${activeTab === 'transactions'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
          >
            <Receipt className="h-4 w-4 mb-1 lg:mb-0 shrink-0" />
            <span className="text-center lg:text-left">Transactions</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`flex flex-col lg:flex-row items-center justify-center lg:justify-start lg:space-x-3 px-3 py-2.5 rounded-xl text-[10px] lg:text-xs font-semibold transition-colors flex-1 lg:flex-none lg:w-full ${activeTab === 'users'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
          >
            <Users className="h-4 w-4 mb-1 lg:mb-0 shrink-0" />
            <span className="text-center lg:text-left">Users</span>
          </button>

          <button
            onClick={() => setActiveTab('admins')}
            className={`flex flex-col lg:flex-row items-center justify-center lg:justify-start lg:space-x-3 px-3 py-2.5 rounded-xl text-[10px] lg:text-xs font-semibold transition-colors flex-1 lg:flex-none lg:w-full ${activeTab === 'admins'
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

      {/* Right Content Area toggling active views */}
      <div className="w-full lg:col-span-4 px-2 lg:px-0">
        {activeTab === 'dashboard' && <AdminOverviewContent />}
        {activeTab === 'transactions' && <AdminAllTransactionsContent />}
        {activeTab === 'users' && <AdminUsersContent loading={loading} users={users} error={error} setUsers={setUsers} setAdmins={setAdmins}/>}
        {activeTab === 'admins' && <AdminAdminsContent loading={loading} admins={admins} error={error} setAdmins={setAdmins} setUsers={setUsers}/>}
      </div>
    </div>
  )
}

export default AdminDashboard
