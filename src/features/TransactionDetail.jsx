import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Check, CreditCard, ShieldCheck, Loader2, Truck } from 'lucide-react'
import { approveTransactionAsBuyer, fetchTransaction, inviteCounterparty, payForTransaction, verifyPayment } from '../api'
import StatusBadge from './StatusBadge'
import { useContext } from 'react'
import { AppContext } from '../context/ContextProvider'
import axios from 'axios'

const formatAmount = (amount, currency) => {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD' }).format(amount)
  } catch (err) {
    return `${currency} ${amount}`
  }
}

const STEPS = ['Agreement', 'Payment', 'Delivery', 'Inspection', 'Closed']
const STEP_INDEX = { pending: 0, agreed: 1, paid: 2, in_progress: 3, pending_release: 3, completed: 4 }
const TERMINAL_NEGATIVE = ['disputed', 'refunded', 'canceled']

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2.5 text-xs border-b border-slate-100 last:border-0">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold text-slate-900">{value}</span>
    </div>
  )
}

function Stepper({ status }) {
  if (TERMINAL_NEGATIVE.includes(status)) {
    const copy = {
      disputed: { title: 'This transaction is disputed', body: 'An admin is reviewing the case to release or refund the funds. Contact support at escrow@support.com.' },
      refunded: { title: 'Funds were refunded to the buyer', body: 'This transaction is closed.' },
      canceled: { title: 'Transaction was canceled', body: 'No funds are held for this deal.' },
    }[status]
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
        <p className="font-bold">{copy.title}</p>
        <p className="mt-0.5 text-xs text-rose-700">{copy.body}</p>
      </div>
    )
  }

  const activeIndex = STEP_INDEX[status] ?? 0

  return (
    <div className="flex items-center justify-between px-1">
      {STEPS.map((step, i) => (
        <div key={step} className="flex flex-1 items-center last:flex-none">
          <div className="flex flex-col items-center">
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${i < activeIndex
                ? 'bg-emerald-500 border-emerald-500 text-white'
                : i === activeIndex
                  ? 'bg-slate-900 border-slate-900 text-white'
                  : 'bg-white border-slate-300 text-slate-400'
                }`}
            >
              {i < activeIndex ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span className={`mt-1.5 text-[10px] font-semibold ${i <= activeIndex ? 'text-slate-800' : 'text-slate-400'}`}>{step}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`h-0.5 flex-1 mx-1 ${i < activeIndex ? 'bg-emerald-500' : 'bg-slate-200'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

export default function TransactionDetail() {
  const { id } = useParams()
  const { currentUser } = useContext(AppContext)
  const [searchParams, setSearchParams] = useSearchParams()

  const [txn, setTxn] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [inviteForm, setInviteForm] = useState({ email: '', tel: '' })
  const [inviteError, setInviteError] = useState('')
  const [inviteSuccess, setInviteSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const [approving, setApproving] = useState(false)
  const [approveError, setApproveError] = useState('')

  const [delivering, setDelivering] = useState(false)
  const [deliverError, setDeliverError] = useState('')

  const [paying, setPaying] = useState(false)
  const [payError, setPayError] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [verifyMessage, setVerifyMessage] = useState('')

  const [cancelling, setCancelling] = useState(false)
  const [cancelError, setCancelError] = useState('')

  const [disputing, setDisputing] = useState(false)
  const [disputeError, setDisputeError] = useState('')

  useEffect(() => {
    const getTransaction = async () => {
      setLoading(true)
      try {
        const response = await fetchTransaction(id)
        setTxn(response)
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load this transaction')
      } finally {
        setLoading(false)
      }
    }
    getTransaction()
  }, [id])

  useEffect(() => {
    const payment = searchParams.get('payment')
    if (payment !== 'callback' && payment !== 'cancelled') return

    if (payment === 'cancelled') {
      setVerifyMessage('Payment was cancelled. You can try again whenever you\'re ready.')
      setSearchParams({}, { replace: true })
      return
    }

    setVerifying(true)
    const verifyTransaction = async () => {
      try {
        const { message, transaction } = await verifyPayment(id)
        setVerifyMessage(message)
        if (transaction) setTxn(transaction)
      } catch (err) {
        setVerifyMessage(err.response?.data?.message || 'Could not verify the payment.')
      } finally {
        setVerifying(false)
        setSearchParams({}, { replace: true })
      }
    }
    verifyTransaction()
  }, [id])

  const handlePay = async () => {
    setPayError('')
    setPaying(true)
    try {
      const { authorizationUrl } = await payForTransaction(id)
      window.location.href = authorizationUrl
    } catch (err) {
      setPayError(err.response?.data?.message || 'Could not start payment. Try again.')
      setPaying(false)
    }
  }

  const handleInviteSubmit = async (e) => {
    e.preventDefault()
    setInviteError('')
    setInviteSuccess('')
    setSubmitting(true)
    try {
      const { transaction } = await inviteCounterparty({ transactionId: id, ...inviteForm })
      setTxn(transaction)
      setInviteSuccess("Invite sent successfully! They'll get an email to confirm the deal.")
      setInviteForm({ email: '', tel: '' })
    } catch (err) {
      setInviteError(err.response?.data?.message || 'Could not send the invite. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleMarkDelivered = async () => {
    setDeliverError('')
    setDelivering(true)
    try {
      const { data } = await axios.put(`/transactions/${id}/deliver`)
      if (data.transaction) setTxn(data.transaction)
    } catch (err) {
      setDeliverError(err.response?.data?.message || 'Could not mark as delivered.')
    } finally {
      setDelivering(false)
    }
  }

  const handleApprove = async () => {
    setApproveError('')
    setApproving(true)
    try {
      const { transaction } = await approveTransactionAsBuyer(id)
      setTxn(transaction)
    } catch (err) {
      setApproveError(err.response?.data?.message || 'Could not confirm right now. Try again.')
    } finally {
      setApproving(false)
    }
  }

  if (loading) return (
    <div className="py-16 flex flex-col items-center justify-center space-y-3">
      <Loader2 className="h-6 w-6 text-emerald-600 animate-spin" />
      <p className="text-xs font-medium text-slate-400 animate-pulse">Fetching database records...</p>
    </div>
  )

  if (error || !txn) return <p className="py-16 text-center text-sm text-rose-600">{error || 'Transaction not found'}</p>

  const isCreator = txn.user?._id === currentUser?._id
  const counterpartySet = currentUser?.role === 'seller' ? !!txn.buyerEmail : !!txn.sellerEmail
  const counterpartyLabel = txn.user?.role === 'seller' ? 'Buyer' : 'Seller'
  const isBuyerOnDeal = currentUser?.role === 'buyer' && (txn.buyerEmail === currentUser?.email || isCreator)
  const isSellerOnDeal = currentUser?.role === 'seller' && (txn.sellerEmail === currentUser?.email || isCreator)

  const handleCancelTransaction = async () => {
    if (!window.confirm("Are you sure you want to cancel this transaction? This action cannot be undone.")) return
    setCancelError('')
    setCancelling(true)
    try {
      const { data } = await axios.put(`/transactions/${id}/cancel`)
      if (data.transaction) setTxn(data.transaction)
    } catch (err) {
      setCancelError(err.response?.data?.message || 'Could not cancel transaction.')
    } finally {
      setCancelling(false)
    }
  }

  const handleDisputeTransaction = async () => {
    if (!window.confirm("Are you sure you want to raise a dispute? This will freeze the transaction for admin review.")) return
    setDisputeError('')
    setDisputing(true)
    try {
      const { data } = await axios.put(`/transactions/${id}/dispute`)
      if (data.transaction) setTxn(data.transaction)
    } catch (err) {
      setDisputeError(err.response?.data?.message || 'Could not dispute transaction.')
    } finally {
      setDisputing(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link to={currentUser.role === 'seller' ? `/seller/dashboard` : `/buyer/dashboard`} className="text-xs font-semibold text-slate-400 hover:text-slate-700">
        ← Back to dashboard
      </Link>

      <div className="mt-3 flex items-start justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{txn.title}</h1>
          <p className="mt-1 text-xs font-mono text-slate-400">
            #{txn._id.slice(-8).toUpperCase()} · Created {new Date(txn.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
          </p>
        </div>
        <StatusBadge status={txn.status} />
      </div>

      <div className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <Stepper status={txn.status} />
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Item details</p>
          <p className="text-sm text-slate-700 leading-relaxed">{txn.description}</p>
          <div className="mt-3">
            <Row label="Category" value={txn?.itemCategory} />
            <Row label="Amount" value={formatAmount(txn?.amount, txn?.currency)} />
            <Row label="Escrow fee" value={formatAmount(txn.escrowFee, txn.currency)} />
            <Row label="Total held in escrow" value={formatAmount(txn?.totalAmount, txn?.currency)} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Logistics</p>
          <Row label="Shipping method" value={txn?.shippingMethod} />
          <Row label="Shipping fee paid by" value={txn?.shippingFeeBy} />
          <Row label="Inspection period" value={`${txn?.inspectionPeriod} day(s)`} />

          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-4 mb-2">{counterpartyLabel}</p>
          {counterpartySet ? (
            <div className="text-xs">
              <p className="font-semibold text-slate-800">{txn.user?.role === 'seller' ? txn?.buyerEmail : txn?.sellerEmail}</p>
              {(txn.user?.role === 'seller' ? txn.buyerTel : txn.sellerTel) && (
                <p className="text-slate-400 mt-0.5">{txn.user?.role === 'seller' ? txn?.buyerTel : txn?.sellerTel}</p>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-400">Not added yet.</p>
          )}
        </div>
      </div>

      {verifying && (
        <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
          Confirming your payment with Tazapay…
        </div>
      )}
      {!verifying && verifyMessage && (
        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          {verifyMessage}
        </div>
      )}

      {/* 1. BUYER ACTION: Fund transaction if pending or agreed */}
      {isBuyerOnDeal && ['pending', 'agreed'].includes(txn.status) && (
        <div className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <CreditCard className="h-3.5 w-3.5" /> Fund this transaction
          </p>
          <p className="text-xs text-slate-500">
            You'll be sent to Tazapay's secure checkout to pay {formatAmount(txn?.totalAmount, txn?.currency)}.
            The seller won't see this money until you confirm you're satisfied.
          </p>
          {payError && (
            <p className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{payError}</p>
          )}
          <button
            onClick={handlePay}
            disabled={paying}
            className="mt-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white transition-all shadow-sm disabled:opacity-50"
          >
            {paying ? 'Redirecting to Tazapay…' : `Pay ${formatAmount(txn?.totalAmount, txn?.currency)} with Tazapay`}
          </button>
        </div>
      )}

      {/* 2. SELLER ACTION: Mark as Delivered when status is 'paid' */}
      {isSellerOnDeal && txn.status === 'paid' && (
        <div className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <Truck className="h-3.5 w-3.5" /> Fulfill order
          </p>
          <p className="text-xs text-slate-500 mb-3">
            Funds are successfully held in escrow. Ship or deliver the item to the buyer, then mark the order as delivered.
          </p>
          {deliverError && (
            <p className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{deliverError}</p>
          )}
          <button
            onClick={handleMarkDelivered}
            disabled={delivering}
            className="rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 text-xs font-bold text-white transition-all shadow-sm disabled:opacity-50"
          >
            {delivering ? 'Updating status...' : 'Mark as Delivered / Shipped'}
          </button>
        </div>
      )}

      {/* 3. BUYER ACTION: Confirm satisfaction when status is 'in_progress' */}
      {isBuyerOnDeal && txn.status === 'in_progress' && (
        <div className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" /> Inspection & Confirmation
          </p>
          {txn.buyerApproved ? (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              <Check className="h-4 w-4" />
              You confirmed you're satisfied with this offer
              {txn?.buyerApprovedAt ? ` on ${new Date(txn.buyerApprovedAt).toLocaleDateString()}` : ''}.
            </div>
          ) : (
            <div>
              <p className="text-xs text-slate-500 mb-3">
                Have you received and inspected your order? Confirming your satisfaction will release the escrow funds to the seller.
              </p>
              {approveError && (
                <p className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{approveError}</p>
              )}
              <button
                onClick={handleApprove}
                disabled={approving}
                className="rounded-xl bg-emerald-500 hover:bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white transition-all shadow-sm disabled:opacity-50"
              >
                {approving ? 'Completing deal…' : "I'm satisfied, release funds"}
              </button>
            </div>
          )}
        </div>
      )}

      {isCreator && (
        <div className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            {counterpartySet ? 'Counterparty' : `Invite the ${counterpartyLabel.toLowerCase()}`}
          </p>

          {inviteSuccess && (
            <p className="mb-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
              {inviteSuccess}
            </p>
          )}

          {!counterpartySet ? (
            <form onSubmit={handleInviteSubmit} className="space-y-3">
              {inviteError && (
                <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                  {inviteError}
                </p>
              )}
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="email" required placeholder={`${counterpartyLabel}'s email`}
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm((f) => ({ ...f, email: e.target.value }))}
                  className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
                <input
                  type="tel" placeholder="Phone (optional)"
                  value={inviteForm.tel}
                  onChange={(e) => setInviteForm((f) => ({ ...f, tel: e.target.value }))}
                  className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
              <button
                type="submit" disabled={submitting}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-xl transition-all disabled:opacity-50"
              >
                {submitting ? 'Sending…' : 'Send invite'}
              </button>
            </form>
          ) : (
            <div className="text-xs">
              <p className="font-semibold text-slate-800">
                {txn.user?.role === 'seller' ? txn.buyerEmail : txn.sellerEmail}
              </p>
              <p className="text-emerald-600 font-medium mt-1">✓ Invitation sent and counterparty linked.</p>
            </div>
          )}
        </div>
      )}

      {/* 4. CANCEL TRANSACTION: Available to participants if not yet finalized */}
      {!TERMINAL_NEGATIVE.includes(txn.status) && !['paid', 'in_progress', 'pending_release', 'completed'].includes(txn.status) && (isBuyerOnDeal || isSellerOnDeal) && (
        <div className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Danger zone</p>
          <p className="text-xs text-slate-500 mb-3">
            Changed your mind about this deal? You can cancel the transaction before payment is made.
          </p>
          {cancelError && (
            <p className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{cancelError}</p>
          )}
          <button
            onClick={handleCancelTransaction}
            disabled={cancelling}
            className="rounded-xl border border-rose-200 bg-white hover:bg-rose-50 px-4 py-2 text-xs font-bold text-rose-700 transition-all shadow-sm disabled:opacity-50"
          >
            {cancelling ? 'Cancelling...' : 'Cancel Transaction'}
          </button>
        </div>
      )}

      {/* DISPUTE OPTION: Available to buyer/seller during active fulfillment */}
      {['paid', 'in_progress', 'pending_release'].includes(txn.status) && (isBuyerOnDeal || isSellerOnDeal) && (
        <div className="mt-6 bg-white rounded-2xl border border-rose-200 shadow-sm p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-rose-600 mb-2">Need help with this deal?</p>
          <p className="text-xs text-slate-500 mb-3">
            If something went wrong with the delivery or service, you can open a dispute. An admin will review the case and issue a refund if necessary.
          </p>
          {disputeError && (
            <p className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{disputeError}</p>
          )}
          <button
            onClick={handleDisputeTransaction}
            disabled={disputing}
            className="rounded-xl border border-rose-300 bg-rose-50 hover:bg-rose-100 px-4 py-2 text-xs font-bold text-rose-700 transition-all shadow-sm disabled:opacity-50"
          >
            {disputing ? 'Opening dispute...' : 'Raise Dispute'}
          </button>
        </div>
      )}
    </div>
  )
}
