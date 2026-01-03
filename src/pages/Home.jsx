import { useState, useEffect } from 'react'
import { Hero } from '../components/Hero'
import { CategoryStrip } from '../components/CategoryStrip'
import { ProductSection } from '../components/ProductSection'
import { Footer } from '../components/Footer'
import { getProducts } from '../api'

export default function Home({ location }) {
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
