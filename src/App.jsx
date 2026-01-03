import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CartDrawer } from './components/CartDrawer'
import { Checkout } from './pages/Checkout'
import Login from './pages/Login'
import { Profile } from './pages/Profile'
import ProtectedRoute from './components/ProtectedRoute'
import { Toaster, toast } from 'sonner'

// Pages
import Home from './pages/Home'
import About from './pages/About'
import Support from './pages/Support'
import Contact from './pages/Contact'

// UI Components
import { Navbar } from './components/Navbar'
import { LocationModal } from './components/LocationModal'

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
        // User is logged in but no store selected
        setLocationModalOpen(true)
      }
    }
  }, [user, loading])

  const handleLocationSelect = (data) => {
    localStorage.setItem("store", JSON.stringify(data))
    setLocation(data)
    setLocationModalOpen(false)
  }

  // Protected Action Handler
  const handleProtectedAction = (action) => {
    if (user) {
      action()
    } else {
      toast.error("Please login first to continue", {
        duration: 5000,
      })
      setTimeout(() => {
        navigate("/login")
      }, 5000)
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

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home location={location} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                {" "}
                {/* Fixed whitespace */}
                <Profile />
              </ProtectedRoute>
            }
          />
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
    <AuthProvider>
      <CartProvider>
        <Router>
          <AppContent />
        </Router>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
