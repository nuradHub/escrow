import axios from 'axios'

export const logoutUser = async ()=> {
  const { data } = await axios.post('/logout')
  return data
}

export const createTransaction = async (payload)=> {
  const { data } = await axios.post('/new-transaction', payload)
  return data
}

export const inviteCounterparty = async ({ transactionId, email, tel })=> {
  const { data } = await axios.put('/transactions', { transactionId, email, tel })
  return data
}

export const fetchTransaction = async (id)=> {
  const { data } = await axios.get(`/transactions/${id}`)
  return data
}

export const approveTransactionAsBuyer = async (id)=> {
  const { data } = await axios.put(`/transactions/${id}/approve`)
  return data
}

export const fetchAllTransactionsAdmin = async ()=> {
  const { data } = await axios.get('/admin/transactions')
  return data
}

export const payForTransaction = async (id)=> {
  const { data } = await axios.post(`/transactions/${id}/pay`)
  return data
}

export const verifyPayment = async (id)=> {
  const { data } = await axios.get(`/transactions/${id}/verify-payment`)
  return data
}
