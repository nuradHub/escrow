import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { AppContext } from '../../context/ContextProvider'
import { LoaderCircleIcon } from 'lucide-react'

const BuyerProtectedRoute = () => {

  const { setCurrentUser, currentUser } = useContext(AppContext)
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const verify = async () => {
      try {
        setLoading(true)
        const { data } = await axios.get('/verify-session')
        const { message, user } = data
        setMessage(message)
        setCurrentUser(user)
      } catch (err) {
        console.log(err.message)
        setMessage(err.response?.data?.message)
      } finally {
        setLoading(false)
      }
    }
    verify()
  }, [])

  if (loading || message === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className='flex flex-col gap-2 items-center'>
          <LoaderCircleIcon className="animate-spin" size={30} />
          <p className="text-md text-slate-400">Loading session…</p>
        </div>
      </div>
    )
  }

  if (!currentUser || message === false) return <Navigate to="/login" replace />
  if (currentUser && currentUser.role === 'admin') return <Navigate to='/admin/dashboard' replace />
  if (currentUser && currentUser.role === 'seller') return <Navigate to='/seller/dashboard' replace />

  if (currentUser && currentUser.role === 'buyer') {
    return <Outlet />
  }
}

export default BuyerProtectedRoute
