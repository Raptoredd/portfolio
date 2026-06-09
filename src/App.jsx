import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ThemeWidget from './components/layout/ThemeWidget'
import PageTransition from './components/layout/PageTransition'
import Home from './pages/Home'
import Parcours from './pages/Parcours'
import Projets from './pages/Projets'
import Veille from './pages/Veille'
import CTF from './pages/CTF'
import CTFSolutions from './pages/CTFSolutions'
import C2Page from './pages/C2Page'
import VertexAdmin from './pages/VertexAdmin'
import VisionCorpPage from './pages/VisionCorpPage'
import Homelab from './pages/Homelab'
import Contact from './pages/Contact'

export default function App() {
  const location = useLocation()
  const isStandalone = ['/vertex-admin', '/visioncorp', '/C2', '/ctf/solutions'].includes(location.pathname)

  return (
    <>
      {!isStandalone && <Navbar />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={
            <PageTransition><Home /></PageTransition>
          } />
          <Route path="/parcours" element={
            <PageTransition><Parcours /></PageTransition>
          } />
          <Route path="/projets" element={
            <PageTransition><Projets /></PageTransition>
          } />
          <Route path="/veille" element={
            <PageTransition><Veille /></PageTransition>
          } />
          <Route path="/ctf" element={
            <PageTransition><CTF /></PageTransition>
          } />
          <Route path="/ctf/solutions" element={
            <PageTransition><CTFSolutions /></PageTransition>
          } />
          <Route path="/C2" element={<C2Page />} />
          <Route path="/vertex-admin" element={<VertexAdmin />} />
          <Route path="/visioncorp" element={<VisionCorpPage />} />
          <Route path="/homelab" element={
            <PageTransition><Homelab /></PageTransition>
          } />
          <Route path="/contact" element={
            <PageTransition><Contact /></PageTransition>
          } />
        </Routes>
      </AnimatePresence>
      {!isStandalone && <Footer />}
      {!isStandalone && <ThemeWidget />}
    </>
  )
}
