import { useEffect, useState } from 'react'
import { BrainCircuit, CheckCircle2, Cloud, Database, LoaderCircle, ScanSearch, Sparkles } from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { getAnalysis } from '../services/api'

const stages=[['Upload validation','Input image and metadata verified'],['Cloud detection','Generating cloud mask'],['Generative reconstruction','Restoring affected regions'],['Quality assessment','Calculating reconstruction metrics']]

export default function Analysis(){
 const [params]=useSearchParams(); const id=params.get('job'); const navigate=useNavigate(); const [job,setJob]=useState<any>(null)
 const step:number=job?.stage??1
 useEffect(()=>{ if(!id) return; const t=setInterval(async()=>{ try{ const {data}=await getAnalysis(id); setJob(data); if(data.status==='Completed'){clearInterval(t); navigate('/app/results?job='+id)} if(data.status==='Failed') clearInterval(t) }catch{} },1000); return()=>clearInterval(t)},[id])
