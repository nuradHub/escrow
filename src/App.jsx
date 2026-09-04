import LandingPage from './pages/public/LandingPage'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/public/Login'
import Register from './pages/public/Register'
import ResetLinkPage from './pages/public/ResetLinkPage.jsx'
import ResetPasswordPage from './pages/public/ResetPasswordPage'
import { useContext, useEffect } from 'react'
import { AppContext } from './context/ContextProvider.jsx'
import SellerProtectedRoute from './features/seller/SellerProtectedRoute.jsx'
import SellerDashboard from './features/seller/SellerDashboard.jsx'
import AppLayout from './features/seller/AppLayout.jsx'
import TransactionDetail from './features/TransactionDetail.jsx'
import BuyerDashboard from './features/buyer/BuyerDashboard.jsx'
import BuyerProtectedRoute from './features/buyer/BuyerProtectedRoute.jsx'
import AdminProtectedRoute from './features/admin/AdminProtectedRoute.jsx'
import AdminDashboard from './features/admin/AdminDashboard.jsx'

function App() {

  const { setCurrentUser, handleCurrentUser } = useContext(AppContext)

  useEffect(() => {
    const getUser = async () => {
      const response = await handleCurrentUser()
      if (response) {
        setCurrentUser(response)
      }
    }
    getUser()
  }, [])

  return (
    <>
      <Routes>
        <Route index element={<LandingPage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/reset-password' element={<ResetLinkPage />} />
        <Route path='/:resetId/reset-password' element={<ResetPasswordPage />} />
        <Route element={<SellerProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/seller/dashboard" element={<SellerDashboard />} />
            <Route path="/seller/dashboard/transaction/:id" element={<TransactionDetail />} />
          </Route>
        </Route>
        <Route element={<BuyerProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
            <Route path="/buyer/dashboard/transaction/:id" element={<TransactionDetail />} />
          </Route>
        </Route>
        <Route element={<AdminProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/dashboard/transaction/:id" element={<TransactionDetail />} />
          </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
