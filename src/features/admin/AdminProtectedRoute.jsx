import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { AppContext } from '../../context/ContextProvider'

const AdminProtectedRoute = ()=> {

  const {setCurrentUser, currentUser} = useContext(AppContext)
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(()=> {
    const verify = async ()=> {
      try{
        setLoading(true)
        const {data} = await axios.get('/verify-session')
        const {message, user} = data
        setMessage(message)
        setCurrentUser(user)
      }catch(err){
        console.log(err.message)
        setMessage(err.response?.data?.message)
      }finally{
        setLoading(false)
      }
    }
    verify()
  }, [])

  if (loading || message === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-400">Loading session…</p>
      </div>
    )
  }

  if (!currentUser || message === false) return <Navigate to="/login" replace />
  if(currentUser && currentUser.role === 'seller') return <Navigate to='/seller/dashboard' replace/>
  if(currentUser && currentUser.role === 'buyer') return <Navigate to='/buyer/dashboard' replace/>

  if(currentUser && (currentUser.role === 'admin')){
    return <Outlet />
  }
}

export default AdminProtectedRoute
