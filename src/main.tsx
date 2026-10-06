import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Route, RouterProvider, Routes } from 'react-router-dom'
import { MotionConfig } from 'motion/react'
import './index.css'
import PitchIndex from './PitchIndex'
import MockupSwitcher from './shared/MockupSwitcher'
import ScrollManager from './shared/ScrollManager'

const ClassicHome = lazy(() => import('./classic/ClassicHome'))
const CoutureHome = lazy(() => import('./couture/CoutureHome'))
const CoutureCollection = lazy(() => import('./couture/CollectionPage'))
const AdminApp = lazy(() => import('./admin/AdminApp'))

function App() {
  return (
    <>
      <ScrollManager />
      <Suspense fallback={<div className="min-h-svh bg-couture-ink" />}>
        <Routes>
          <Route path="/" element={<PitchIndex />} />
          <Route path="/classic" element={<ClassicHome />} />
          <Route path="/couture" element={<CoutureHome />} />
          <Route path="/couture/collection" element={<CoutureCollection />} />
          <Route
            path="/admin/*"
            element={
              <Suspense fallback={<div className="min-h-svh bg-white" />}>
                <AdminApp />
              </Suspense>
            }
          />
        </Routes>
      </Suspense>
      <MockupSwitcher />
    </>
  )
}

// A data router (rather than <BrowserRouter>) so the admin can guard unsaved changes with useBlocker
const router = createBrowserRouter([{ path: '*', element: <App /> }])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <RouterProvider router={router} />
    </MotionConfig>
  </StrictMode>,
)
