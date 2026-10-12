import { useState } from 'react'
import { Navigate, NavLink, Route, Routes, useNavigate } from 'react-router-dom'
import {
  BarChart3, Cloud, Database, FileImage, History, LayoutDashboard,
  LogOut, Menu, Satellite, Settings, Sparkles, UploadCloud, X
} from 'lucide-react'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Upload from './pages/Upload'
import Analysis from './pages/Analysis'
import Results from './pages/Results'
import HistoryPage from './pages/History'
import './index.css'

const nav = [
  {to:'/app', label:'Dashboard', icon:LayoutDashboard, end:true},
  {to:'/app/upload', label:'Upload imagery', icon:UploadCloud},
  {to:'/app/analysis', label:'AI analysis', icon:Sparkles},
  {to:'/app/results', label:'Results', icon:FileImage},
  {to:'/app/history', label:'Processing history', icon:History},
]

function Shell() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const logout = () => { localStorage.removeItem('cloudrecon_token'); navigate('/') }
