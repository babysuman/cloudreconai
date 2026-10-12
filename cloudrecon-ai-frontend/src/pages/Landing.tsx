import { ArrowRight, CheckCircle2, CloudOff, Eye, Layers3, Satellite, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="landing">
      <header className="landing-nav">
        <div className="brand">
          <div className="brand-mark"><Satellite size={21}/></div>
          <div><strong>CloudRecon</strong><span>AI SATELLITE LAB</span></div>
        </div>
        <div className="landing-links">
          <a href="#technology">Technology</a><a href="#workflow">Workflow</a><a href="#about">About</a>
          <Link className="btn btn-outline" to="/login">Sign in</Link>
        </div>
      </header>

      <section className="hero">
        <div className="hero-grid"/>
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={15}/> GENERATIVE AI FOR EARTH OBSERVATION</div>
          <h1>See beyond the clouds with <em>AI reconstruction.</em></h1>
          <p>CloudRecon restores cloud-obscured LISS-IV satellite imagery using an AI-assisted reconstruction pipeline, helping researchers explore clearer land-surface information.</p>
