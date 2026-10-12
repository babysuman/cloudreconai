import { useEffect, useState, type CSSProperties } from 'react'
import { Download, FileText, Printer, RefreshCcw, Sparkles } from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { downloadUrl, getResult, imageUrl, startAnalysis } from '../services/api'

const engineName=(e:string)=>({'generative-ai':'Generative AI (LaMa)','reference-fill':'Reference image fill','opencv-inpaint':'OpenCV inpainting (basic fallback)','java-diffusion':'Java fill (basic fallback)'} as Record<string,string>)[e]??e

export default function Results(){
 const [params]=useSearchParams(); const id=params.get('job'); const navigate=useNavigate()
 const [job,setJob]=useState<any>(null); const [split,setSplit]=useState(50); const [view,setView]=useState<'output'|'mask'>('output')
 useEffect(()=>{ if(id) getResult(id).then(r=>setJob(r.data)).catch(()=>{}) },[id])
 const report=(()=>{ try{ return job?.report?JSON.parse(job.report):null }catch{ return null } })()
 const saveReport=()=>{
  if(!report) return
  const li=(a:string[])=>a.map(x=>`<li>${x}</li>`).join('')
  const lc=report.landCover
  const html=`<!doctype html><meta charset="utf-8"><title>${report.title}</title><style>body{font:16px/1.6 system-ui;max-width:780px;margin:2rem auto;padding:0 1rem;color:#12202f}h1{font-size:1.6rem}h2{margin-top:1.6rem;font-size:1.15rem}td,th{padding:6px 14px;border-bottom:1px solid #ddd;text-align:left}small{color:#667}</style><h1>${report.title}</h1><small>Generated ${report.generatedAt}</small><h2>Summary</h2><p>${report.summary}</p><h2>Data quality</h2><p>${report.quality.label}. Cloud cover ${report.quality.cloudCoverage}%, confidence ${report.quality.confidence}%, engine ${report.quality.engine}.</p><h2>Land cover (after reconstruction)</h2><table><tr><th>Vegetation</th><th>Water / dark</th><th>Bare / built-up</th><th>Cloud (reconstructed)</th></tr><tr><td>${lc.vegetation}%</td><td>${lc.water}%</td><td>${lc.bareBuilt}%</td><td>${lc.cloud}%</td></tr></table><h2>Observations</h2><ul>${li(report.observations)}</ul><h2>Recommendations</h2><ul>${li(report.recommendations)}</ul><h2>Limitations</h2><ul>${li(report.limitations)}</ul>`
  const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([html],{type:'text/html'})); a.download=(job.code||'report')+'-situation-report.html'; a.click()
 }
 if(!id) return <div className="empty-state"><h2>No result selected</h2><p>Open a job from your history, or <Link to="/app/upload">upload an image</Link>.</p></div>
 if(!job) return <div className="empty-state"><h2>Loading result…</h2></div>
 const fill:CSSProperties={position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'contain'}
 const reprocess=async()=>{ await startAnalysis(id); navigate('/app/analysis?job='+id) }
 return <div>
  <div className="page-heading"><div><div className="section-kicker">RECONSTRUCTION RESULT</div><h1>{job.filename}</h1><p>{job.status} · {job.date} · {engineName(job.engine)}</p></div><div className="heading-actions"><button className="btn btn-ghost" onClick={()=>setView(v=>v==='output'?'mask':'output')}>{view==='output'?'Show cloud mask':'Show reconstruction'}</button><a className="btn btn-primary" href={downloadUrl(id)}><Download size={16}/> Export result</a></div></div>
  <div className="result-grid">
   <section className="panel compare-panel"><div className="compare-toolbar"><span>Before / after comparison</span></div>
    <div className="comparison" style={{position:'relative',display:'block',minHeight:380}}>
     <img src={imageUrl(id,view)} alt="Result" style={fill}/>
     <img src={imageUrl(id,'input')} alt="Original" style={{...fill,clipPath:`inset(0 ${100-split}% 0 0)`}}/>
     <div style={{position:'absolute',top:0,bottom:0,left:split+'%',width:3,background:'#fff',pointerEvents:'none'}}/>
     <input type="range" min={0} max={100} value={split} onChange={e=>setSplit(+e.target.value)} aria-label="Compare original and result" style={{position:'absolute',inset:0,width:'100%',height:'100%',opacity:0,cursor:'ew-resize'}}/>
    </div>
    <div className="compare-caption"><span>Left: original · Right: {view==='output'?'reconstructed':'cloud mask'}. Drag to compare.</span><b>{job.cloudRemoval}% of detected cloud removed</b></div>
   </section>
   <aside className="result-side">
    <div className="panel quality-card"><div className="section-kicker">QUALITY SCORE</div><div className="big-score">{job.reconstructionScore}<span>/100</span></div><p>Heuristic score from cloud removal and the amount of surrounding clear area. Validate against ground truth before operational use.</p><div className="quality-row"><span>Cloud coverage</span><b>{job.cloudCoverage}%</b></div><div className="quality-row"><span>Cloud removal</span><b>{job.cloudRemoval}%</b></div><div className="quality-row"><span>Confidence</span><b>{job.confidence}%</b></div><div className="quality-row"><span>Processing time</span><b>{job.duration}</b></div></div>
