import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/CartContext"
import { Minus, Plus } from "lucide-react"

export function ProductCard({ product }) {
    const { cart, addToCart, updateQuantity, removeFromCart } = useCart()

    // Find if product is in cart
    const cartItem = cart.find(item => item.id === product.id)
    const quantity = cartItem ? cartItem.quantity : 0

    const handleAdd = () => {
        addToCart(product)
    }

    const handleIncrement = () => {
        updateQuantity(product.id, quantity + 1)
    }

    const handleDecrement = () => {
        if (quantity === 1) {
            removeFromCart(product.id)
        } else {
            updateQuantity(product.id, quantity - 1)
        }
    }

    // Handle price display (check for different price fields from backend)
    const price = product.selling_price_with_gst || product.price || 0
    const mrp = product.mrp || 0
    const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0

    return (
        <Card className="w-full overflow-hidden hover:shadow-lg transition-shadow border-gray-100">
            <div className="h-48 bg-gray-50 flex items-center justify-center relative">
                <img src={product.image || product.image_url} alt={product.name} className="h-full w-full object-contain p-4 mix-blend-multiply" />
                {discount > 0 && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded">
                        {discount}% OFF
                    </span>
                )}
            </div>
            <CardHeader className="p-3 pb-0">
                <div className="space-y-1">
                    <CardTitle className="text-sm font-semibold line-clamp-2 h-10 leading-tight text-gray-800">
                        {product.name}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                            {product.size_label || "Standard"}
                        </span>
                    </div>
                </div>
            </CardHeader>
            <CardFooter className="p-3 pt-3 flex flex-col gap-3">
                <div className="flex items-baseline gap-2 w-full">
                    <span className="text-base font-bold text-gray-900">₹{price}</span>
                    {mrp > price && (
                        <span className="text-xs text-gray-400 line-through">₹{mrp}</span>
                    )}
                </div>

                {quantity === 0 ? (
                    <Button
                        size="sm"
                        className="w-full bg-white text-medical-teal-600 border border-medical-teal-600 hover:bg-medical-teal-50 font-semibold h-9"
                        onClick={handleAdd}
                    >
                        Add to Cart
                    </Button>
                ) : (
                    <div className="flex items-center justify-between w-full bg-medical-teal-600 rounded-md h-9 px-1">
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-white hover:bg-medical-teal-700 hover:text-white"
                            onClick={handleDecrement}
                        >
                            <Minus className="h-4 w-4" />
                        </Button>
                        <span className="text-white font-bold text-sm w-8 text-center">{quantity}</span>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-white hover:bg-medical-teal-700 hover:text-white"
                            onClick={handleIncrement}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </CardFooter>
        </Card>
    )
}
