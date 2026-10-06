import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MotionConfig } from 'motion/react'
import './index.css'
import PitchIndex from './PitchIndex'
import MockupSwitcher from './shared/MockupSwitcher'
import ScrollManager from './shared/ScrollManager'

const ClassicHome = lazy(() => import('./classic/ClassicHome'))
const CoutureHome = lazy(() => import('./couture/CoutureHome'))
const CoutureCollection = lazy(() => import('./couture/CollectionPage'))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <ScrollManager />
        <Suspense fallback={<div className="min-h-svh bg-couture-ink" />}>
          <Routes>
            <Route path="/" element={<PitchIndex />} />
            <Route path="/classic" element={<ClassicHome />} />
            <Route path="/couture" element={<CoutureHome />} />
            <Route path="/couture/collection" element={<CoutureCollection />} />
          </Routes>
        </Suspense>
        <MockupSwitcher />
      </BrowserRouter>
    </MotionConfig>
  </StrictMode>,
)
