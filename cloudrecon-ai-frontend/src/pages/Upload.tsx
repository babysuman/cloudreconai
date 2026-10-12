import { useRef, useState } from 'react'
import { ArrowRight, CheckCircle2, FileImage, MapPinned, UploadCloud, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { startAnalysis, uploadSatelliteImage } from '../services/api'
