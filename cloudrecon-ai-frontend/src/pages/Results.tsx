import { useEffect, useState, type CSSProperties } from 'react'
import { Download, FileText, Printer, RefreshCcw, Sparkles } from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { downloadUrl, getResult, imageUrl, startAnalysis } from '../services/api'

const engineName=(e:string)=>({'generative-ai':'Generative AI (LaMa)','reference-fill':'Reference image fill','opencv-inpaint':'OpenCV inpainting (basic fallback)','java-diffusion':'Java fill (basic fallback)'} as Record<string,string>)[e]??e

export default function Results(){
 const [params]=useSearchParams(); const id=params.get('job'); const navigate=useNavigate()
 const [job,setJob]=useState<any>(null); const [split,setSplit]=useState(50); const [view,setView]=useState<'output'|'mask'>('output')
