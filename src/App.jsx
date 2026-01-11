import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
// 1. Import QueryClient and Provider
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { CartProvider } from './context/CartContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CartDrawer } from './components/CartDrawer'
import { Checkout } from './pages/Checkout'
import Login from './pages/Login'
import { Profile } from './pages/Profile'
import ProtectedRoute from './components/ProtectedRoute'
import CreateUser from './pages/admin/CreateUser'
import ResetPassword from './pages/admin/ResetPassword'
import ChangePassword from './pages/ChangePassword'
import OrderDetails from './pages/OrderDetails'
import { Toaster, toast } from 'sonner'
import AdminDashboard from './pages/admin/AdminDashboard'

// Pages
import Home from './pages/Home'
import About from './pages/About'
import Support from './pages/Support'
import Contact from './pages/Contact'

// UI Components
import { Navbar } from './components/Navbar'
import { LocationModal } from './components/LocationModal'

// 2. Create a client instance (create this outside the component so it doesn't reset on re-renders)
const queryClient = new QueryClient()

function AppContent() {
  const { user, loading } = useAuth()
  const [location, setLocation] = useState(null)
  const [locationModalOpen, setLocationModalOpen] = useState(false)
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false)
  const navigate = useNavigate()

  // Location Logic: Only ask if user is logged in
  useEffect(() => {
    if (!loading && user) {
      const savedStore = localStorage.getItem("store")
      if (savedStore) {
        setLocation(JSON.parse(savedStore))
      } else {
        setLocationModalOpen(true)
      }
    }
  }, [user, loading])

  const handleLocationSelect = (data) => {
    localStorage.setItem("store", JSON.stringify(data))
    setLocation(data)
    setLocationModalOpen(false)
  }

  const handleProtectedAction = (action) => {
    if (user) {
      action()
    } else {
      toast.error("Please login first to continue", { duration: 5000 })
      setTimeout(() => navigate("/login"), 5000)
    }
  }

  return (
    <div className="min-h-screen bg-background font-sans antialiased flex flex-col">
      <Navbar
        location={location}
        onLocationClick={() => handleProtectedAction(() => setLocationModalOpen(true))}
        onCartClick={() => handleProtectedAction(() => setCartDrawerOpen(true))}
      />

      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/support" element={<Support />} />
          <Route path="/contact" element={<Contact />} />

          {/* Admin Routes */}
          <Route path="/admin/create-user" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <CreateUser />
            </ProtectedRoute>
          } />
          <Route path="/admin/reset-password" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ResetPassword />
            </ProtectedRoute>
          } />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* User Routes */}
          <Route path="/change-password" element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          } />
          <Route path="/" element={
            <ProtectedRoute>
              <Home location={location} />
            </ProtectedRoute>
          } />
          <Route path="/checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/order-details/:orderId" element={
            <ProtectedRoute>
              <OrderDetails />
            </ProtectedRoute>
          } />
        </Routes>
      </main>

      <LocationModal
        open={locationModalOpen}
        onOpenChange={setLocationModalOpen}
        onLocationSelect={handleLocationSelect}
      />

      <CartDrawer
        open={cartDrawerOpen}
        onOpenChange={setCartDrawerOpen}
      />

      <Toaster richColors position="top-center" />
    </div>
  )
}

function App() {
  return (
    // 3. Wrap the application with QueryClientProvider
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <Router>
            <AppContent />
          </Router>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App