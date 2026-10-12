import { useRef, useState } from 'react'
import { ArrowRight, CheckCircle2, FileImage, MapPinned, UploadCloud, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { startAnalysis, uploadSatelliteImage } from '../services/api'

export default function Upload(){
 const [file,setFile]=useState<File|null>(null); const [drag,setDrag]=useState(false); const ref=useRef<HTMLInputElement>(null); const navigate=useNavigate(); const [composite,setComposite]=useState<'false-color'|'natural'>('false-color'); const [refFile,setRefFile]=useState<File|null>(null); const [busy,setBusy]=useState(false); const [error,setError]=useState('')
 const run=async()=>{ if(!file) return; setBusy(true); setError(''); try{ const up=await uploadSatelliteImage(file, composite, refFile); await startAnalysis(up.data.id); navigate('/app/analysis?job='+up.data.id) }catch(e:any){ setError(e?.response?.data?.error||'Upload failed. Check the file and that the server is running.'); setBusy(false) } }
 const choose=(f?:File)=>{if(f && /\.(tif|tiff|png|jpe?g)$/i.test(f.name)) setFile(f)}
 return <div>
  <div className="page-heading"><div><div className="section-kicker">NEW ANALYSIS</div><h1>Upload satellite imagery</h1><p>Prepare a LISS-IV image for cloud detection and reconstruction.</p></div></div>
  <div className="upload-layout">
   <section className="panel upload-panel">
    {!file ? <div className={`dropzone ${drag?'drag':''}`} onDragOver={e=>{e.preventDefault();setDrag(true)}} onDragLeave={()=>setDrag(false)} onDrop={e=>{e.preventDefault();setDrag(false);choose(e.dataTransfer.files[0])}} onClick={()=>ref.current?.click()}>
      <input ref={ref} hidden type="file" accept=".tif,.tiff,.png,.jpg,.jpeg" onChange={e=>choose(e.target.files?.[0])}/>
      <div className="upload-icon"><UploadCloud size={30}/></div><h2>Drop your satellite image here</h2><p>or click to browse from your computer</p><span>GeoTIFF, TIFF, PNG or JPEG · Max 500 MB</span>
