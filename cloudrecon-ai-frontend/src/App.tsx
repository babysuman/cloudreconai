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
