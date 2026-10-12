import { useEffect, useState } from 'react'
import { BrainCircuit, CheckCircle2, Cloud, Database, LoaderCircle, ScanSearch, Sparkles } from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { getAnalysis } from '../services/api'

const stages=[['Upload validation','Input image and metadata verified'],['Cloud detection','Generating cloud mask'],['Generative reconstruction','Restoring affected regions'],['Quality assessment','Calculating reconstruction metrics']]
