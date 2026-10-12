import { useEffect, useState } from 'react'
import { Download, FileImage, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { downloadUrl, getHistory } from '../services/api'

export default function History(){
 const [rows,setRows]=useState<any[]>([]); const [q,setQ]=useState('')
 useEffect(()=>{ getHistory().then(r=>setRows(r.data)).catch(()=>{}) },[])
 const shown=rows.filter(r=>(r.filename+r.code).toLowerCase().includes(q.toLowerCase()))
 return <div><div className="page-heading"><div><div className="section-kicker">WORKSPACE</div><h1>Processing history</h1><p>Review previous cloud-removal and reconstruction jobs.</p></div></div>
  <section className="panel table-panel"><div className="history-tools"><div className="search-box"><Search size={16}/><input placeholder="Search image or job ID" value={q} onChange={e=>setQ(e.target.value)}/></div></div>
