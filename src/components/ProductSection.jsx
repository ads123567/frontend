import { ProductCard } from "@/components/ProductCard"
import { useCart } from "@/context/CartContext"

export function ProductSection({ title, products }) {
    const { addToCart } = useCart()

    return (
        <div className="container mx-auto px-4 py-8 border-t border-gray-100">
            <div className="flex justify-between items-end mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                <button className="text-medical-teal-600 font-semibold text-sm hover:underline">See All</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    )
}
