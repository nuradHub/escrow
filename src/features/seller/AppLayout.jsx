import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from '../../context/ContextProvider'
import { logoutUser } from '../../api'

const AppLayout = ()=> {

  const { currentUser } = useContext(AppContext)

  const navigate = useNavigate()

  const handleLogout = async () => {
    await logoutUser()
    navigate('/login')
  }

  const initials = (currentUser?.name || currentUser?.email || '?').slice(0, 2).toUpperCase()

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900 text-white shadow-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to={currentUser.role === 'seller' ? '/seller/dashboard' : '/buyer/dashboard'} className="flex items-center space-x-3">
            <div className="flex items-center justify-center rounded-lg bg-emerald-500 p-2 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5 text-slate-900">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div>
              <span className="block text-xl font-bold tracking-tight text-emerald-400">Escrow</span>
              <span className="-mt-1 block text-xs text-slate-400">Escrow, done right</span>
            </div>
          </Link>

          <div className="flex items-center space-x-4">
            {currentUser?.role === 'admin' && (
              <Link
                to="/admin/dashboard"
                className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-400 transition-all hover:text-white"
              >
                Admin
              </Link>
            )}
            <div className="hidden text-right sm:block">
              <p className="text-xs font-medium text-slate-200">{currentUser?.name || currentUser?.email}</p>
              <p className="text-[10px] uppercase tracking-wider text-slate-500">{currentUser?.role}</p>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/20 text-xs font-bold text-emerald-400">
              {initials}
            </div>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-300 transition-all hover:bg-slate-800 hover:text-white"
            >
              Log out
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
