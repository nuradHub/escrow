import { AlertCircle, Circle, LoaderCircle, ShieldCheck } from "lucide-react"
import Header from "./Header"
import { Link } from "react-router-dom"
import { useContext } from "react"
import { AppContext } from "../../context/ContextProvider"

const ResetLinkPage = () => {

  const { email, setEmail, isLoading, errMessage, setErrMessage, handleResetLink, successMessage, setSuccessMessage } = useContext(AppContext)

  const handleReset = async (e) => {
    e.preventDefault()
    setErrMessage('')
    setSuccessMessage('')
    const response = await handleResetLink()
    if (response) {
      setErrMessage('')
      setSuccessMessage(response.message)
    }
  }

  return (
    <section className="flex flex-col h-screen">
      <Header className='lg:hidden' />
      <div className="flex h-full">
        {/* Left Side section */}
        <div className="hidden flex-col py-12 px-15 bg-slate-900 gap-20 flex-1 lg:flex">
          <div className="flex items-center gap-2 text-emerald-600 font-bold">
            <ShieldCheck className='bg-emerald-500/80 text-black p-1 rounded-sm ' size={35} />
            Escrow
          </div>
          <div className="flex flex-col gap-5 max-w-90">
            <p className="text-emerald-500 font-bold uppercase">Forgot Password? No Problem</p>
            <h4 className="text-white text-5xl tracking-wider leading-tight font-medium">Kindly provide your email address</h4>
            <p className="text-slate-400">You will be back using our service in no time.</p>
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
                <h4 className="text-2xl font-bold">Reset Password</h4>
                <p className="text-sm text-slate-600">Enter your details to reset your password</p>
              </div>
              {/* Form */}

              {errMessage && <div className="flex items-center gap-1 bg-red-800 py-1 px-4 rounded-xl text-sm text-red-100 shadow shadow-red-950">
                <AlertCircle size={15} className="text-red-100" />
                {errMessage}
              </div>}

              {successMessage && <div className="flex items-center gap-1 bg-green-800 py-1 px-4 rounded-xl text-sm text-red-100 shadow shadow-green-950">
                <AlertCircle size={15} className="text-red-100" />
                {successMessage}
              </div>}

              <form onSubmit={handleReset} method='POST' className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-slate-800">Email</label>
                  <input type="email" id='email' name='email' placeholder="James@gmail.com" className="border border-slate-300 py-2 px-4 rounded-xl focus:outline-0 focus:border-slate-500" required onChange={(e) => setEmail(e.target.value)} value={email} />
                </div>
                <button type="submit" className="flex items-center justify-center bg-slate-900 text-white font-medium p-2 rounded-xl flex-1 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60" disabled={isLoading}>{isLoading ? <LoaderCircle size={20} className="animate-spin" /> : 'Send Reset Link'}</button>
              </form>
              <p className="flex items-center gap-1 text-slate-500">Back to <Link to='/login' className="text-emerald-500 font-bold" onClick={() => { setErrMessage(''); setSuccessMessage('') }}>Login</Link></p>
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

export default ResetLinkPage