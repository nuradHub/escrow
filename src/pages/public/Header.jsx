import { ShieldCheck } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const Header = ({ className }) => {
  const location = useLocation()
  const path = location.pathname

  return (
    <section className={`flex items-center justify-between bg-slate-900 py-3 px-3 border-b shadow shadow-slate-100 border-slate-500 md:px-20 ${className}`}>
      <div className='flex items-center text-emerald-400 gap-2 text-xl'>
        <ShieldCheck className='bg-emerald-500/60 text-black p-1 rounded-sm ' size={35} />
        Escrow
      </div>
      {!(path.includes('register') || path.includes('login')) &&
        <div className='flex items-center gap-5'>
          <Link to='/login' className='text-white'>Sign in</Link>
          <Link to='/register' className='bg-emerald-500/80 py-1 px-2 rounded-lg font-medium'>Get Started</Link>
        </div>
      }
    </section>
  )
}

export default Header