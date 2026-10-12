import { useEffect, useState } from 'react'
import { Download, FileImage, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { downloadUrl, getHistory } from '../services/api'

export default function History(){
