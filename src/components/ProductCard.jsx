import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/CartContext"
import { Minus, Plus } from "lucide-react"

export function ProductCard({ product }) {
    const { cart, addToCart, updateQuantity, removeFromCart } = useCart()

    const cartItem = cart.find(item => item.id === product.id)
    const quantity = cartItem ? cartItem.quantity : 0

    const handleAdd = () => addToCart(product)
    const handleIncrement = () => updateQuantity(product.id, quantity + 1)
    const handleDecrement = () => {
        if (quantity === 1) removeFromCart(product.id)
        else updateQuantity(product.id, quantity - 1)
    }

    const price = Number(product.selling_price_with_gst || product.selling_price || product.price || 0)
    const mrp = Number(product.mrp || 0)
    const ptr = Number(product.ptr || 0)
    const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0

    return (
        /* Increased card length/height via min-height and padding */
        <Card className="group flex flex-col min-h-[350px] bg-white border border-gray-100 hover:shadow-md transition-shadow duration-300 rounded-2xl overflow-hidden w-full p-3">

            {/* Top Labels */}
            <div className="flex justify-between items-center mb-2">
                <span className="text-[12px] font-bold text-gray-500 uppercase tracking-tight">
                    {product.brand || "GENERIC"}
                </span>
                {discount > 0 && (
                    <div className="text-red-600 text-[13px] font-black">
                        {discount}% OFF
                    </div>
                )}
            </div>

            {/* Image Container - Slightly taller to match card length */}
            <div className="relative h-32 w-full flex items-center justify-center mb-3">
                <img
                    src={product.image || product.image_url}
                    alt={product.name}
                    className="max-h-full max-w-[85%] object-contain"
                />
            </div>

            {/* Name Section - More space allocated here */}
            <div className="flex flex-col mb-1 min-h-[2.5rem]">
                {/* min-height helps keep cards aligned if names vary in length */}
                <h3 className="text-base font-bold text-gray-900 line-clamp-3 leading-snug break-words">
                    {product.name}
                </h3>
            </div>

            {/* Price & Unit Grid */}
            <div className=" mt-auto">
                {/* MRP Row */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-gray-500">MRP: </span>
                        <span className="text-sm text-gray-400 line-through font-medium">₹{mrp.toFixed(2)}</span>
                        <span className="text-[10px] text-gray-400 italic">incl. GST</span>
                    </div>
                    <span className="text-[11px] font-bold text-gray-500 uppercase">Unit</span>
                </div>

                {/* PTR Row */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-gray-500">PTR: </span>
                        <span className="text-sm text-gray-400 line-through font-medium">₹{ptr.toFixed(2)}</span>
                        <span className="text-[10px] text-gray-400 italic">incl. GST</span>
                    </div>
                    <span className="text-[11px] font-bold text-gray-500">{product.size_label || "10 * 10"}</span>
                </div>
            </div>

            {/* Bottom Section - Price and Button in same row */}
            {/* Bottom Section - Price and Button stack on mobile, side-by-side on desktop */}
            <div className="mt-auto pt-3 border-t border-gray-100">
                {/* sm:flex-row keeps computer layout same; flex-col handles mobile */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

                    {/* Price Section: "OUR PRICE" and Amount in one line */}
                    <div className="flex items-center gap-2 sm:flex-col sm:items-start sm:gap-0">
                        <span className="text-[11px] font-black text-teal-900 leading-none">
                            OUR PRICE
                        </span>
                        <span className="text-xl font-black text-teal-800">
                            ₹{price.toFixed(0)}<span className="text-sm">.{price.toFixed(2).split('.')[1]}</span>
                        </span>
                    </div>

                    {/* Button Section: Full width on mobile, fixed width on computer */}
                    <div className="w-full sm:w-auto flex-shrink-0">
                        {quantity === 0 ? (
                            <Button
                                className="w-full sm:w-auto bg-white text-medical-teal-600 border border-medical-teal-600 hover:bg-medical-teal-50 font-semibold text-sm h-10 px-8 rounded-xl shadow-md transition-transform active:scale-95"
                                onClick={handleAdd}
                            >
                                ADD
                            </Button>
                        ) : (
                            <div className="flex items-center justify-between sm:justify-start bg-medical-teal-600 rounded-xl h-10 p-1 shadow-md w-full sm:w-auto">
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 text-white hover:bg-medical-teal-700 hover:text-white"
                                    onClick={handleDecrement}
                                >
                                    <Minus className="h-5 w-5 stroke-[4px]" />
                                </Button>
                                <span className="text-white font-bold px-3 min-w-[28px] text-center">
                                    {quantity}
                                </span>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 text-white hover:bg-medical-teal-700 hover:text-white"
                                    onClick={handleIncrement}
                                >
                                    <Plus className="h-5 w-5 stroke-[4px]" />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    )
}