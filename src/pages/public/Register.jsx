import { Circle, Eye, AlertCircle, LoaderCircle, ShieldCheck } from "lucide-react"
import Header from "./Header"
import { Link, useNavigate } from "react-router-dom"
import { useContext, useState } from "react"
import { AppContext } from "../../context/ContextProvider"

const Register = () => {

  const { role, setRole, name, setName, email, setEmail, password, setPassword, country, setCountry, view, setView, errMessage, isLoading, handleRegister, setErrMessage, successMessage, setSuccessMessage } = useContext(AppContext)

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrMessage('')
    setSuccessMessage('')
    const response = await handleRegister()
    if (response) {
      setErrMessage('')
      setSuccessMessage(response.message)
      navigate('/login')
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
            <p className="text-emerald-500 font-bold uppercase">Get started</p>
            <h4 className="text-white text-5xl tracking-wider leading-tight font-medium">Trade with confidence</h4>
            <p className="text-slate-400">Escrow holds the funds until both the buyer and seller agree the deal is done neither side moves first.</p>
          </div>
          <hr />
          <div className="flex items-center gap-1 text-slate-400 text-xs">
            <Circle className='fill-emerald-500/80 p-1 rounded-sm animate-pulse' size={25} />
            Funds held until both sides confirm the deal.
          </div>
        </div>

        {/* right Side section */}
        <div className="flex flex-col p-7 flex-1 lg:pl-30 lg:py-15 h-full items-center justify-center lg:items-start">
          <div className="max-w-100 flex flex-col w-full justify-center ">
            <div className="flex flex-col gap-5">
              {/* Top */}
              <div className="flex flex-col gap-2">
                <h4 className="text-2xl font-bold">Create your account</h4>
                <p className="text-sm text-slate-600">Tell us which side of deal you're on.</p>
              </div>
              <div className="flex flex-col flex-1 gap-2 w-full">
                <p>I am the...</p>
                <div className="flex gap-2">
                  <button type="button" className={`${role === 'buyer' ? 'bg-emerald-500 text-white' : 'bg-white text-black'} border border-slate-400 font-medium p-2 rounded-xl flex-1`} onClick={() => setRole('buyer')}>Buyer</button>
                  <button type="button" className={`${role === 'seller' ? 'bg-emerald-500 text-white' : 'bg-white text-black'} border border-slate-400 font-medium p-2 rounded-xl flex-1`} onClick={() => setRole('seller')}>Seller</button>
                </div>
              </div>

              {errMessage && <div className="flex items-center gap-1 bg-red-800 py-1 px-4 rounded-xl text-sm text-red-100 shadow shadow-red-950">
                <AlertCircle size={15} className="text-red-100" />
                {errMessage}
              </div>}

              {successMessage && <div className="flex items-center gap-1 bg-green-800 py-1 px-4 rounded-xl text-sm text-red-100 shadow shadow-green-950">
                <AlertCircle size={15} className="text-red-100" />
                {successMessage}
              </div>}

              {/* Form */}
              <form onSubmit={handleSubmit} method="POST" className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-slate-800">Full name</label>
                  <input type="text" id='name' name='name' placeholder="James Jonnathan" className="border border-slate-300 py-2 px-4 rounded-xl focus:outline-0 focus:border-slate-500" required onChange={(e) => setName(e.target.value)} value={name} />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-slate-800">Email</label>
                  <input type="email" id='email' name='email' placeholder="James@gmail.com" className="border border-slate-300 py-2 px-4 rounded-xl focus:outline-0 focus:border-slate-500" required onChange={(e) => setEmail(e.target.value)} value={email} />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="password" className="text-slate-800">Password</label>
                  <div className="flex items-center relative w-full">
                    <input type={`${view ? 'text' : 'password'}`} id='password' name='password' placeholder="password" className="border border-slate-300 py-2 px-4 pr-13 rounded-xl focus:outline-0 focus:border-slate-500 flex-1" required onChange={(e) => setPassword(e.target.value)} value={password} />
                    <Eye className="absolute right-7 text-emerald-400/80 cursor-pointer" size={14} onClick={() => setView(!view)} />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="country" className="text-slate-800">Country</label>
                  <select 
                    id='country' 
                    name='country' 
                    className="border border-slate-300 py-2 px-4 rounded-xl focus:outline-0 focus:border-slate-500 bg-white" 
                    required 
                    onChange={(e) => setCountry(e.target.value)} 
                    value={country}
                  >
                    <option value="" disabled>Select your country</option>
                    <option value="NG">Nigeria</option>
                    <option value="GB">United Kingdom</option>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="GH">Ghana</option>
                    <option value="ZA">South Africa</option>
                    <option value="KE">Kenya</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="AU">Australia</option>
                  </select>
                </div>
                <button type="submit" className="flex items-center justify-center bg-slate-900 text-white font-medium p-2 rounded-xl flex-1 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60" disabled={isLoading}>{isLoading ? <LoaderCircle size={20} className="animate-spin" /> : 'Create account'}</button>
              </form>
              <p className="flex items-center gap-1 text-slate-500">Already have an account? <Link to='/login' className="text-emerald-500 font-bold" onClick={() => { setErrMessage(''); setSuccessMessage('') }}>Sign in</Link></p>
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

export default Register