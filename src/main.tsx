import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { MotionConfig } from 'motion/react'
import './index.css'
import PitchIndex from './PitchIndex'
import ClassicHome from './classic/ClassicHome'
import CoutureHome from './couture/CoutureHome'
import MockupSwitcher from './shared/MockupSwitcher'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<PitchIndex />} />
          <Route path="/classic" element={<ClassicHome />} />
          <Route path="/couture" element={<CoutureHome />} />
        </Routes>
        <MockupSwitcher />
      </BrowserRouter>
    </MotionConfig>
  </StrictMode>,
)
