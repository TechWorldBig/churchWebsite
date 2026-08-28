import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Members from './pages/Members'
import Gallery from './pages/Gallery'
import Attendance from './pages/Attendance'
import About from './pages/About'
import Admin from './pages/Admin'
import Programs from './pages/Programs'
import AdminGallery from './pages/AdminGallery'

export default function App() {
  return <Layout><Routes><Route path="/" element={<Home/>}/><Route path="/members" element={<Members/>}/><Route path="/gallery" element={<Gallery/>}/><Route path="/programs" element={<Programs/>}/><Route path="/attendance" element={<Attendance/>}/><Route path="/about" element={<About/>}/><Route path="/admin" element={<Admin/>}/><Route path="/admin/gallery" element={<AdminGallery/>}/><Route path="*" element={<Home/>}/></Routes></Layout>
}
