import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { CartDrawer } from './components/CartDrawer'
import { Checkout } from './pages/Checkout'
import Login from './pages/Login'
import { Profile } from './pages/Profile'
import ProtectedRoute from './components/ProtectedRoute'

// New UI Components
import { Navbar } from './components/Navbar'
import { LocationModal } from './components/LocationModal'
import { Hero } from './components/Hero'
import { CategoryStrip } from './components/CategoryStrip'
import { ProductSection } from './components/ProductSection'
import { Footer } from './components/Footer'
import { getProducts } from './api'

function Home({ location }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProducts()
      .then(data => {
        // Get 20-30 products (e.g., slice 0 to 24)
        setProducts(data.slice(0, 24))
      })
      .catch(err => console.error("Failed to load products", err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <CategoryStrip />

      {loading ? (
        <div className="p-8 text-center">Loading products...</div>
      ) : (
        <>
          <ProductSection title="Featured Products" products={products.slice(0, 12)} />
          <ProductSection title="Best Sellers" products={products.slice(12, 24)} />
        </>
      )}

      <Footer />
    </div>
  )
}

function App() {
  const [location, setLocation] = useState(null)
  const [locationModalOpen, setLocationModalOpen] = useState(false)
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false)

  useEffect(() => {
    const savedStore = localStorage.getItem("store")
    if (savedStore) {
      setLocation(JSON.parse(savedStore))
    } else {
      setLocationModalOpen(true)
    }
  }, [])

  const handleLocationSelect = (data) => {
    localStorage.setItem("store", JSON.stringify(data))
    setLocation(data)
    setLocationModalOpen(false)
  }

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-background font-sans antialiased flex flex-col">
            <Navbar
              location={location}
              onLocationClick={() => setLocationModalOpen(true)}
              onCartClick={() => setCartDrawerOpen(true)}
            />

            <main className="flex-1">
              <Routes>
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
                <Route path="/login" element={<Login />} />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
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
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
