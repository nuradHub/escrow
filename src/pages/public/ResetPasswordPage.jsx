import { AlertCircle, Circle, LoaderCircle, ShieldCheck, Eye } from "lucide-react"
import Header from "./Header"
import { Link, useParams } from "react-router-dom"
import { useContext, useState } from "react"
import { AppContext } from "../../context/ContextProvider"

const ResetPasswordPage = () => {

  const { isLoading, errMessage, setErrMessage, handleResetPassword, view, setView, password, setPassword, successMessage, setSuccessMessage} = useContext(AppContext)

  const {resetId} = useParams()

  const handleReset = async (e) => {
    e.preventDefault()
    setErrMessage('')
    setSuccessMessage('')
    const response = await handleResetPassword(resetId)
    if (response) {
      setErrMessage('')
      setErrMessage('')
      setSuccessMessage(response.message)
    }
  }

  return (
    <section className="flex flex-col h-screen">
      <Header className='lg:hidden' />
      <div className="flex h-full">
        {/* Left Side section */}
        <div className="hidden flex-col py-12 px-15 bg-slate-900 gap-15 flex-1 lg:flex">
          <div className="flex items-center gap-2 text-emerald-600 font-bold">
            <ShieldCheck className='bg-emerald-500/80 text-black p-1 rounded-sm ' size={35} />
            Escrow
          </div>
          <div className="flex flex-col gap-5 max-w-90">
            <p className="text-emerald-500 font-bold uppercase">Secure Your Account</p>
            <h4 className="text-white text-5xl tracking-wider leading-tight font-medium">Enter your new password</h4>
            <p className="text-slate-400">Choose a strong password you haven't used elsewhere.</p>
          </div>
          <hr />
          <div className="flex items-center gap-1 text-slate-400 text-xs">
            <Circle className='fill-emerald-500/80 p-1 rounded-sm animate-pulse' size={25} />
            Funds held until both sides confirm the deal.
          </div>
        </div>

        {/* Right Side section */}
        <div className="flex flex-col p-7 flex-1 lg:pl-30 lg:py-30 h-full justify-center items-center lg:items-start">
          <div className="w-full max-w-100 flex flex-col justify-center">
            <div className="flex flex-col gap-7 w-full">
              {/* Top */}
              <div className="flex flex-col gap-2">
                <h4 className="text-2xl font-bold">New Password</h4>
                <p className="text-sm text-slate-600">Enter your new password below</p>
              </div>
              {/* Form */}

              {errMessage && <div className="flex items-center gap-1 bg-red-800 py-1 px-4 rounded-xl text-sm text-red-100 shadow shadow-red-950">
                <AlertCircle size={15} className="text-red-100" />
                {errMessage}
              </div>}

              {successMessage && <div className="flex items-center gap-1 bg-green-800 py-1 px-4 rounded-xl text-sm text-red-100 shadow shadow-green-950">
                <AlertCircle size={15} className="text-green-100" />
                {successMessage}
              </div>}

              <form onSubmit={handleReset} method='POST' className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-slate-800">Password</label>
                  </div>
                  <div className="flex items-center relative w-full">
                    <input type={`${view ? 'text' : 'password'}`} id='password' name='name' placeholder="password" className="border border-slate-300 py-2 px-4 pr-13 rounded-xl focus:outline-0 focus:border-slate-500 flex-1" required onChange={(e) => setPassword(e.target.value)} value={password} />
                    <Eye className="absolute right-7 text-emerald-400/80 cursor-pointer" size={14} onClick={() => setView(!view)} />
                  </div>
                </div>
                <button type="submit" className="flex items-center justify-center bg-slate-900 text-white font-medium p-2 rounded-xl flex-1 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60" disabled={isLoading}>{isLoading ? <LoaderCircle size={20} className="animate-spin" /> : 'Reset Password'}</button>
              </form>
              <p className="flex items-center gap-1 text-slate-500">Back to <Link to='/login' className="text-emerald-500 font-bold" onClick={()=> {setErrMessage(''); setSuccessMessage('')}}>Login</Link></p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 py-6 px-4 gap-2 border-t border-slate-800/60 lg:hidden">
        <span>&copy; {new Date().getFullYear()} Escrow</span>
        <span>Secure P2P Transaction Node</span>
      </div>
    </section>
  )
}

export default ResetPasswordPage