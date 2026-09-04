import { CircleArrowDown } from "lucide-react"
import { useEffect } from "react"
import { Link } from "react-router-dom"
import AOS from "aos"

const Main = () => {

  useEffect(()=> {
    AOS.init({
      duration: 700,
      once: true,
      easing: "ease-in-out"
    })
  }, [])

  return (
    <section className="flex flex-col ">
      {/* Hero section */}
      <div className="flex flex-col items-center bg-slate-900 pt-10 gap-5 pb-30 md:pt-20">
        <div className="flex flex-col items-center gap-7 max-w-150 px-2 md:px-0">
          <span className="flex items-center gap-2 px-4 py-1 rounded-full text-xs font-semibold tracking-wide bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" data-aos='fade-up'>
            <CircleArrowDown size={15} className="animate-pulse text-emerald-200" />
            Buyer and seller protection, built in
          </span>
          <div className="flex flex-col gap-7 items-center justify-center">
            <h4 className="text-center text-white text-3xl font-bold tracking-wider leading-tight lg:text-4xl" data-aos='fade-right' data-aos-delay='100'>Buy/Sell with confidence. Escrow holds the funds.</h4>
            <p className="text-center text-slate-400 text-sm font-lighter tracking-wider lg:text-md" data-aos='fade-up' data-aos-delay='200'>Neither side moves first. We hold the payment untill the buyer confirms the deal is exactly what was agreed on.</p>
            <div className="flex items-center justify-center gap-4" data-aos='fade-up' data-aos-delay='300'>
              <Link to='/register' className="bg-emerald-500/80 py-2 px-4 rounded-xl font-medium text-[14px] md:text-xl text-center shadow shadow-emerald-800 text-slate-950 md:text-xl">Start a transaction</Link>
              <Link to='/login' className="bg-slate-800 py-2 px-4 rounded-xl font-medium text-[14px] text-center shadow shadow-slate-700 text-white md:text-xl ">I have an account</Link>
            </div>
          </div>
        </div>
      </div>

      {/* How it works section */}
      <div className="flex flex-col pt-10 px-5 gap-10 pb-10">
        <h5 className="text-center text-xl font-medium" data-aos='fade-up' data-aos-delay='50'>How it works</h5>
        <div className="flex flex-wrap justify-center gap-8 pt-6">

          {/* Step 01 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative flex-1 max-w-80 min-w-70" data-aos='fade-up' data-aos-delay='100'>
            <div className="absolute -top-4 left-6 bg-slate-900 text-emerald-400 w-8 h-8 rounded-full font-bold flex items-center justify-center text-xs border-2 border-white shadow">1</div>
            <div className="flex items-center justify-between mt-2 mb-2">
              <h3 className="font-bold text-slate-900 text-md">Agree on terms</h3>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-mono font-bold">PENDING</span>
            </div>
            <p className="text-slate-500 text-xs leading-loose">Buyer or seller starts the deal and invites the other side to confirm the price, item, and delivery terms.</p>
          </div>

          {/* Step 02 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative flex-1 max-w-80 min-w-70" data-aos='fade-up' data-aos-delay='150'>
            <div className="absolute -top-4 left-6 bg-slate-900 text-emerald-400 w-8 h-8 rounded-full font-bold flex items-center justify-center text-xs border-2 border-white shadow">2</div>
            <div className="flex items-center justify-between mt-2 mb-2">
              <h3 className="font-bold text-slate-900 text-md">Funds held safely</h3>
              <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono font-bold">FUNDED</span>
            </div>
            <p className="text-slate-500 text-xs leading-loose">Once agreed, the payment is held by Escrow not released to the seller until the buyer confirms.</p>
          </div>

          {/* Step 03 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative flex-1 max-w-80 min-w-70" data-aos='fade-up' data-aos-delay='200'>
            <div className="absolute -top-4 left-6 bg-slate-900 text-emerald-400 w-8 h-8 rounded-full font-bold flex items-center justify-center text-xs border-2 border-white shadow">3</div>
            <div className="flex items-center justify-between mt-2 mb-2">
              <h3 className="font-bold text-slate-900 text-md">Buyer confirms</h3>
              <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-mono font-bold">IN_PROGRESS</span>
            </div>
            <p className="text-slate-500 text-xs leading-loose">When the item arrives and matches what was agreed, the buyer marks the deal satisfied.</p>
          </div>

          {/* Step 04 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative flex-1 max-w-80 min-w-70" data-aos='fade-up' data-aos-delay='250'>
            <div className="absolute -top-4 left-6 bg-slate-900 text-emerald-400 w-8 h-8 rounded-full font-bold flex items-center justify-center text-xs border-2 border-white shadow">4</div>
            <div className="flex items-center justify-between mt-2 mb-2">
              <h3 className="font-bold text-slate-900 text-md">Funds released</h3>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono font-bold">RELEASED</span>
            </div>
            <p className="text-slate-500 text-xs leading-loose">Escrow releases the held funds to the seller. Admins can step in if anything is disputed.</p>
          </div>
        </div>
      </div>

      {/* Trust section */}
      <div className="flex flex-col pt-10 px-5 gap-10 pb-10" data-aos='fade-up' data-aos-delay='50'>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 text-white shadow-lg flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex flex-col gap-3 max-w-lg">
            <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2.5 py-0.5 rounded-full text-[11px] font-semibold w-max">
              <span>🛡️ Zero-Risk P2P Architecture</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              Secure trade for International markets
            </h2>
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
              Funds are locked securely in virtual pools and never touch the seller's balance until the buyer explicitly confirms fulfillment.
            </p>
          </div>

          <div className="flex flex-row sm:flex-row gap-3 w-full lg:w-auto">
            <div className="bg-slate-800/60 border border-slate-700/50 p-3 rounded-xl flex items-center gap-3 flex-1 lg:flex-initial">
              <div className="bg-emerald-500/20 text-emerald-400 p-2 rounded-lg font-bold text-xs">$</div>
              <div>
                <div className="text-[10px] text-slate-400">Currencies</div>
                <div className="text-xs font-semibold text-white">USD</div>
              </div>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/50 p-3 rounded-xl flex items-center gap-3 flex-1 lg:flex-initial">
              <div className="bg-emerald-500/20 text-emerald-400 p-2 rounded-lg font-bold text-xs">⚖️</div>
              <div>
                <div className="text-[10px] text-slate-400">Resolution</div>
                <div className="text-xs font-semibold text-white">Admin-Led</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Main