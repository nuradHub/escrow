import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PlusCircle } from 'lucide-react'
import { createTransaction } from '../api'
import { AppContext } from '../context/ContextProvider'

const ITEM_CATEGORIES = ['Electronics', 'Vehicles', 'Fashion', 'Real Estate', 'Services', 'Other']
const SHIPPING_METHODS = ['Courier delivery', 'Local pickup', 'Digital delivery', 'Freight']

const NewTransactionCard = ({ role })=> {

  const {currentUser} = useContext(AppContext)

  const navigate = useNavigate()
  const counterpartyLabel = role === 'seller' ? 'Buyer' : 'Seller'

  const [form, setForm] = useState({
    title: '',
    description: '',
    itemCategory: ITEM_CATEGORIES[0],
    currency: 'USD',
    amount: '',
    inspectionPeriod: '3',
    shippingMethod: SHIPPING_METHODS[0],
    shippingFeeBy: 'buyer',
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const amountNum = Number(form.amount) || 0
  const escrowFeePreview = Number((amountNum * 0.025).toFixed(2))
  const totalPreview = Number((amountNum + escrowFeePreview).toFixed(2))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const { transaction } = await createTransaction({ ...form, amount: amountNum })
      currentUser.role === 'seller' ? navigate(`/seller/dashboard/transaction/${transaction._id}`) : navigate(`/buyer/dashboard/transaction/${transaction._id}`)
      
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create the transaction. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = "w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none font-medium text-slate-900"
  const labelClass = "block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1"

  return (
    <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5 h-max">
      <div>
        <h3 className="text-base font-bold text-slate-900 flex items-center">
          <PlusCircle className="h-4 w-4 text-emerald-500 mr-2" /> Start an escrow agreement
        </h3>
        <p className="text-slate-400 text-[11px] mt-0.5">
          You'll invite the {counterpartyLabel.toLowerCase()} once this is saved.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</p>
        )}

        <div>
          <label className={labelClass}>Item title <span className="text-red-500">*</span></label>
          <input name="title" required value={form.title} onChange={handleChange} className={inputClass} placeholder="iPhone 16 Pro Max, 256GB" />
        </div>

        <div>
          <label className={labelClass}>Description <span className="text-red-500">*</span></label>
          <textarea name="description" required rows={2} value={form.description} onChange={handleChange} className={inputClass} placeholder="Condition, terms, and delivery expectations." />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Category</label>
            <select name="itemCategory" value={form.itemCategory} onChange={handleChange} className={inputClass}>
              {ITEM_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Currency</label>
            <select name="currency" value={form.currency} onChange={handleChange} className={inputClass}>
              <option value="USD">USD</option>
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>Amount <span className="text-red-500">*</span></label>
          <div className="relative">
            <input
              name="amount" type="number" min="0" step="0.01" required
              value={form.amount} onChange={handleChange}
              className={`${inputClass} pl-7`} placeholder="0.00"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Inspection (days)</label>
            <input name="inspectionPeriod" type="number" min="0" value={form.inspectionPeriod} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Shipping fee by</label>
            <select name="shippingFeeBy" value={form.shippingFeeBy} onChange={handleChange} className={inputClass}>
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>Shipping method</label>
          <select name="shippingMethod" value={form.shippingMethod} onChange={handleChange} className={inputClass}>
            {SHIPPING_METHODS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {amountNum > 0 && (
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs space-y-1">
            <div className="flex justify-between text-slate-500"><span>Subtotal</span><span>{form.currency} {amountNum.toFixed(2)}</span></div>
            <div className="flex justify-between text-slate-500"><span>Escrow fee (2.5%)</span><span>{form.currency} {escrowFeePreview.toFixed(2)}</span></div>
            <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-slate-200"><span>Total held</span><span>{form.currency} {totalPreview.toFixed(2)}</span></div>
          </div>
        )}

        <button
          type="submit" disabled={submitting}
          className="w-full bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold py-3 rounded-xl transition-all shadow-md disabled:opacity-50"
        >
          {submitting ? 'Saving…' : 'Save and continue'}
        </button>
      </form>
    </div>
  )
}

export default NewTransactionCard
