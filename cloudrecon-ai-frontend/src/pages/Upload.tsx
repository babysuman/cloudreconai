import { useRef, useState } from 'react'
import { ArrowRight, CheckCircle2, FileImage, MapPinned, UploadCloud, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { startAnalysis, uploadSatelliteImage } from '../services/api'

export default function Upload(){
 const [file,setFile]=useState<File|null>(null); const [drag,setDrag]=useState(false); const ref=useRef<HTMLInputElement>(null); const navigate=useNavigate(); const [composite,setComposite]=useState<'false-color'|'natural'>('false-color'); const [refFile,setRefFile]=useState<File|null>(null); const [busy,setBusy]=useState(false); const [error,setError]=useState('')
