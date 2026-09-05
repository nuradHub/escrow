import { createContext, useState } from "react";
import axios from 'axios'

export const AppContext = createContext()

const ContextProvider = ({children}) => {

  const [role, setRole] = useState('seller')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [country, setCountry] = useState('') 
  const [view, setView] = useState(false)
  const [errMessage, setErrMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [transactions, setTransactions] = useState([])

  const handleRegister = async ()=> {  
    try{
      setIsLoading(true)
      const response = await axios.post('/register', {
        role,
        name,
        email,
        password,
        country: country.toUpperCase()
      })
      
      setRole('')
      setName('')
      setEmail('')
      setPassword('')
      setCountry('')

      if(response.data) return response.data
      
    }catch(err){
      console.log(err.message)
      if(err.response?.data?.message) setErrMessage(err.response?.data?.message)
    }finally{
      setIsLoading(false)
    }
  }

  const handleSignin = async ()=> {  
    try{
      setIsLoading(true)
      const response = await axios.post('/login', {
        email,
        password,
      })

      setRole('')
      setName('')
      setEmail('')
      setPassword('')

      if(response.data) return response.data
      
    }catch(err){
      console.log(err.message)
      if(err.response?.data?.message) setErrMessage(err.response?.data?.message)
    }finally{
      setIsLoading(false)
    }
  }

  const handleResetLink = async ()=> {  
    try{
      setIsLoading(true)
      const response = await axios.post('/reset-link', {
        email,
      })

      setEmail('')

      if(response.data) return response.data
      
    }catch(err){
      console.log(err.message)
      if(err.response?.data?.message) setErrMessage(err.response?.data?.message)
    }finally{
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (resentId)=> {  
    if(!resentId) return
    try{
      setIsLoading(true)
      const response = await axios.put(`/${resentId}/reset-password`, {
        password,
      })

      setPassword('')

      if(response.data) return response.data
      
    }catch(err){
      console.log(err.message)
      if(err.response?.data?.message) setErrMessage(err.response?.data?.message)
    }finally{
      setIsLoading(false)
    }
  }

  const handleTransactions = async ()=> {  
    try{
      setIsLoading(true)
      const response = await axios.get('/transactions')

      if(response.data) return response.data
      
    }catch(err){
      console.log(err.message)
      if(err.response?.data?.message) setErrMessage(err.response?.data?.message)
    }finally{
      setIsLoading(false)
    }
  }

  const handleCurrentUser = async ()=> {  
    try{
      setIsLoading(true)
      const response = await axios.get('/current-user')

      if(response.data) return response.data
      
    }catch(err){
      console.log(err.message)
    }finally{
      setIsLoading(false)
    }
  }

  const value = {
    role, setRole,
    email, setEmail,
    name, setName,
    password, setPassword,
    view, setView,
    errMessage, setErrMessage,
    isLoading, setIsLoading,
    handleRegister, handleSignin,
    handleResetLink, handleResetPassword,
    successMessage, setSuccessMessage,
    currentUser, setCurrentUser,
    transactions, setTransactions,
    handleTransactions, handleCurrentUser,
    country, setCountry
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export default ContextProvider