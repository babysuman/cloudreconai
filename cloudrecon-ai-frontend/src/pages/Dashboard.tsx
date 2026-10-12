import { ArrowUpRight, Cloud, Cpu, FileImage, Gauge, MoreHorizontal, Satellite, Sparkles } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Link } from 'react-router-dom'

const chart=[{day:'Mon',images:12,cloud:31},{day:'Tue',images:18,cloud:44},{day:'Wed',images:15,cloud:38},{day:'Thu',images:24,cloud:51},{day:'Fri',images:21,cloud:46},{day:'Sat',images:28,cloud:58},{day:'Sun',images:26,cloud:49}]
const recent=[['LISS-IV_RJ_042.tif','Completed','92.8%','2m 14s'],['LISS-IV_RJ_043.tif','Processing','—','Running'],['LISS-IV_MP_017.tif','Completed','89.4%','1m 52s'],['LISS-IV_UP_031.tif','Queued','—','Queued']]

export default function Dashboard(){
 return <div>
  <div className="page-heading"><div><div className="section-kicker">OVERVIEW</div><h1>Satellite intelligence dashboard</h1><p>Monitor your imagery pipeline and reconstruction jobs.</p></div><Link className="btn btn-primary" to="/app/upload"><Sparkles size={17}/> New analysis</Link></div>
  <div className="stat-grid">
   <Stat icon={Satellite} label="Images processed" value="128" trend="+14.2%" note="this month"/>
   <Stat icon={Cloud} label="Avg. cloud coverage" value="42.8%" trend="-6.4%" note="vs last month"/>
   <Stat icon={Gauge} label="Avg. reconstruction" value="91.7%" trend="+3.8%" note="quality score"/>
   <Stat icon={Cpu} label="AI jobs completed" value="96" trend="+21" note="this month"/>
  </div>
  <div className="dashboard-grid">
   <section className="panel chart-panel"><div className="panel-head"><div><h2>Processing activity</h2><p>Images processed and average cloud coverage</p></div><button className="select-btn">Last 7 days⌄</button></div><ResponsiveContainer width="100%" height={290}><AreaChart data={chart}><defs><linearGradient id="fillA" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0ea5e9" stopOpacity=".18"/><stop offset="100%" stopColor="#0ea5e9" stopOpacity="0"/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="#dde6f0"/><XAxis dataKey="day" stroke="#94a3b8" tick={{fontSize:11}}/><YAxis stroke="#94a3b8" tick={{fontSize:11}}/><Tooltip contentStyle={{background:'#fff',border:'1px solid #dde6f0',borderRadius:10,boxShadow:'0 4px 16px #00000012',color:'#1a2535',fontSize:11}}/><Area type="monotone" dataKey="images" stroke="#0ea5e9" fill="url(#fillA)" strokeWidth={2.5}/></AreaChart></ResponsiveContainer></section>
