import { useEffect, type ReactNode } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useSession } from './auth'
import AdminLayout from './AdminLayout'
import LoginPage from './LoginPage'
import ProductsPage from './ProductsPage'
import { EditProductPage, NewProductPage } from './ProductPages'
import { cx, FOCUS } from './styles'
import { Toaster } from './ui'

/** Unauthenticated visitors go to sign in, remembering where they were headed */
function RequireAuth({ children }: { children: ReactNode }) {
  const session = useSession()
  const location = useLocation()
  if (!session) return <Navigate to="/admin/login" replace state={{ from: location }} />
  return children
}

/** The in-house admin at /admin/*: a light working tool, separate from both storefront concepts. */
export default function AdminApp() {
  useEffect(() => {
    const prevTitle = document.title
    const bg = document.body.style.background
    document.title = 'Stylemart Admin'
    document.body.style.background = '#ffffff'
    return () => {
      document.title = prevTitle
      document.body.style.background = bg
    }
  }, [])

  return (
    <div className={cx('min-h-svh bg-white font-manrope text-admin-ink antialiased selection:bg-couture-gold/30', FOCUS)}>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route index element={<ProductsPage />} />
          <Route path="products/new" element={<NewProductPage />} />
          <Route path="products/:id" element={<EditProductPage />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Routes>
      <Toaster />
    </div>
  )
}
