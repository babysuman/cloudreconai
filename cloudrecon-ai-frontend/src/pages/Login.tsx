import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LockKeyhole, Mail, Satellite, ShieldCheck } from 'lucide-react'
import { login } from '../services/api'

export default function Login() {
  const [email,setEmail]=useState('researcher@cloudrecon.ai')
  const [password,setPassword]=useState('demo123')
  const navigate=useNavigate()
  const [error,setError]=useState('')

  const submit=async(e:FormEvent)=>{e.preventDefault(); setError(''); try{const {data}=await login(email,password); localStorage.setItem('cloudrecon_token',data.token); navigate('/app')}catch{setError('Wrong email or password, or the server is not running.')}}
  return <div className="auth-page">
