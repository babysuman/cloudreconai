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
