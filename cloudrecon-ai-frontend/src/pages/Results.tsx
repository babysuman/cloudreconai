import { useEffect, useState, type CSSProperties } from 'react'
import { Download, FileText, Printer, RefreshCcw, Sparkles } from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { downloadUrl, getResult, imageUrl, startAnalysis } from '../services/api'

