import { StrictMode, Suspense, lazy, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { MotionConfig } from 'motion/react'
import './index.css'
import PitchIndex from './PitchIndex'
import MockupSwitcher from './shared/MockupSwitcher'

const ClassicHome = lazy(() => import('./classic/ClassicHome'))
const CoutureHome = lazy(() => import('./couture/CoutureHome'))

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
        <Suspense fallback={<div className="min-h-svh bg-couture-ink" />}>
          <Routes>
            <Route path="/" element={<PitchIndex />} />
            <Route path="/classic" element={<ClassicHome />} />
            <Route path="/couture" element={<CoutureHome />} />
          </Routes>
        </Suspense>
        <MockupSwitcher />
      </BrowserRouter>
    </MotionConfig>
  </StrictMode>,
)
