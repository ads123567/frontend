import { ProductCard } from "@/components/ProductCard"
import { useCart } from "@/context/CartContext"

export function ProductSection({ title, products }) {
    const { addToCart } = useCart()

    return (
        <div className="container mx-auto px-1 py-1 border-t border-gray-100">
            <div className="flex justify-between items-end mb-6 px-2" >
                <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                <button className="text-medical-teal-600 font-semibold text-sm hover:underline">See All</button>
            </div>
            {/* px-[1px] ensures exactly 1 pixel of space on left and right sides */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6 px-1 sm:px-6 py-4">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    )
}
