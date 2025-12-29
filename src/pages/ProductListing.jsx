import { useState, useEffect } from 'react'
import { getProducts } from '@/api'
import { ProductCard } from '@/components/ProductCard'
import { useCart } from '@/context/CartContext'

export function ProductListing() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const { addToCart } = useCart()

    useEffect(() => {
        const store = JSON.parse(localStorage.getItem("store"))
        if (store && store.store_id) {
            getProducts(store.store_id).then(setProducts).finally(() => setLoading(false))
        }
    }, [])

    if (loading) return <div className="p-8 text-center">Loading products...</div>

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
                <ProductCard key={product.id} product={product} onAdd={addToCart} />
            ))}
        </div>
    )
}
