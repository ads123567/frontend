import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getProduct } from "@/api"
import { useCart } from "@/context/CartContext"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Minus, Plus, ShoppingCart, ChevronLeft, Info, Table as TableIcon, ArrowRight } from "lucide-react"
import { toast } from "sonner"

export default function ProductDetails() {
    const { productId } = useParams()
    const navigate = useNavigate()
    const { cart, addToCart, updateQuantity, removeFromCart } = useCart()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)

    const cartItem = cart.find(item => item.id === parseInt(productId))
    const quantity = cartItem ? cartItem.quantity : 0
    const itemsInCart = cart.length

    useEffect(() => {
        getProduct(productId)
            .then(setProduct)
            .catch(err => {
                console.error("Failed to fetch product", err)
                toast.error("Product not found")
            })
            .finally(() => setLoading(false))
    }, [productId])

    const handleAdd = () => addToCart(product)
    const handleIncrement = () => updateQuantity(product.id, quantity + 1)
    const handleDecrement = () => {
        if (quantity === 1) removeFromCart(product.id)
        else updateQuantity(product.id, quantity - 1)
    }

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-teal-600"></div>
        </div>
    )

    if (!product) return (
        <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-800">Product not found</h2>
            <Button variant="link" onClick={() => navigate("/")}>Go back home</Button>
        </div>
    )

    const price = Number(product.selling_price_with_gst || product.selling_price || product.price || 0)
    const mrp = Number(product.mrp || 0)
    const ptr = Number(product.ptr || 0)

    return (
        <div className="relative min-h-screen bg-white pb-24 lg:pb-12">
            {/* Sticky Header: Back Button */}
            <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 py-3 lg:px-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-teal-600 hover:text-teal-700 font-bold transition-colors"
                    >
                        <ChevronLeft className="h-5 w-5 mr-1" />
                        Back to Shop
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                {/* Product Title Section */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center gap-3">
                        <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">
                            {product.name}
                        </h1>
                        <span className="inline-block px-2 py-1 bg-red-50 text-red-600 text-[10px] font-black rounded-md border border-red-100 w-fit">
                            {Math.round(((mrp - price) / mrp) * 100)}% OFF
                        </span>
                    </div>
                    <p className="text-teal-600 font-bold mt-1 uppercase tracking-wide text-xs">
                        {product.category_name || "Pharmaceuticals"}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    
                    {/* Left Sidebar: Image & Desktop Controls (4 cols) */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="flex justify-center lg:justify-start">
                            <div className="w-1/3 lg:w-full aspect-square relative flex items-center justify-center bg-gray-50 border border-gray-100 rounded-3xl overflow-hidden">
                                <img
                                    src={product.image || product.image_url}
                                    alt={product.name}
                                    className="max-h-[80%] max-w-[80%] object-contain mix-blend-multiply"
                                />
                            </div>
                        </div>
                        
                        {/* DESKTOP CONTROLS */}
                        <div className="hidden lg:flex flex-col gap-3">
                            <CartControls 
                                quantity={quantity} 
                                handleAdd={handleAdd} 
                                handleDecrement={handleDecrement} 
                                handleIncrement={handleIncrement} 
                            />
                            
                            {itemsInCart > 0 && (
                                <Button 
                                    onClick={() => navigate("/checkout")}
                                    className="w-full h-14 bg-teal-800 hover:bg-teal-900 text-white font-black rounded-xl shadow-lg flex items-center justify-center gap-2"
                                >
                                    VIEW CART & CHECKOUT
                                    <ArrowRight className="h-5 w-5" />
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Right Content Area (8 cols) */}
                    <div className="lg:col-span-8 space-y-8">
                        
                        {/* Specifications Table */}
                        <div className="overflow-hidden border border-gray-200 rounded-2xl shadow-sm bg-white">
                            <div className="bg-gray-50 p-4 border-b border-gray-200 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <TableIcon className="h-4 w-4 text-gray-400" />
                                    <h3 className="font-bold text-sm text-gray-700 uppercase tracking-widest">Pricing & Details</h3>
                                </div>
                            </div>
                            <table className="w-full text-sm text-left border-collapse">
                                <tbody className="divide-y divide-gray-100">
                                    <tr>
                                        <td className="p-4 bg-gray-50/30 text-gray-500 font-medium w-1/3">Manufacturer</td>
                                        <td className="p-4 font-bold text-gray-900">{product.brand || "Generic"}</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 bg-gray-50/30 text-gray-500 font-medium">Packing</td>
                                        <td className="p-4 font-bold text-gray-900">{product.size_label || "10 Units"}</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 bg-gray-50/30 text-gray-500 font-medium">MRP</td>
                                        <td className="p-4 font-bold text-gray-900 line-through decoration-gray-400">₹{mrp.toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 bg-gray-50/30 text-gray-500 font-medium">Our Price (PTR)</td>
                                        <td className="p-4 font-black text-lg text-teal-700">₹{ptr.toFixed(2)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Description Section */}
                        <Card className="p-6 border-none bg-teal-50/30 rounded-2xl">
                            <h3 className="text-lg font-black text-gray-900 mb-3 flex items-center">
                                <Info className="h-5 w-5 mr-2 text-teal-600" />
                                Product Summary
                            </h3>
                            <div className="text-gray-600 leading-relaxed text-sm">
                                {product.description || `This high-quality ${product.name} is sourced from verified manufacturers. Store in a cool, dry place away from direct sunlight.`}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            {/* MOBILE STICKY BOTTOM BAR */}
            <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-gray-100 p-4 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
                <div className="flex items-center gap-3 max-w-lg mx-auto">
                    <div className="flex-1">
                        <CartControls 
                            quantity={quantity} 
                            handleAdd={handleAdd} 
                            handleDecrement={handleDecrement} 
                            handleIncrement={handleIncrement} 
                        />
                    </div>
                    {itemsInCart > 0 && (
                        <Button 
                            onClick={() => navigate("/checkout")}
                            className="h-12 px-6 bg-teal-800 hover:bg-teal-900 text-white font-black rounded-xl shadow-md flex items-center gap-2"
                        >
                            <ShoppingCart className="h-5 w-5" />
                            <span className="hidden xs:inline">VIEW CART</span>
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}

// Reusable Control Component
function CartControls({ quantity, handleAdd, handleDecrement, handleIncrement }) {
    if (quantity === 0) {
        return (
            <Button
                className="w-full bg-medical-teal-600 hover:bg-medical-teal-700 text-white font-black text-md h-12 lg:h-14 rounded-xl shadow-md transition-all active:scale-95"
                onClick={handleAdd}
            >
                ADD TO CART
            </Button>
        )
    }

    return (
        <div className="flex items-center bg-medical-teal-600 rounded-xl h-12 lg:h-14 p-1 shadow-md">
            <Button
                size="icon"
                variant="ghost"
                className="h-10 w-10 lg:h-12 lg:w-12 text-white hover:bg-medical-teal-700 hover:text-white"
                onClick={handleDecrement}
            >
                <Minus className="h-5 w-5 stroke-[3px]" />
            </Button>
            <span className="flex-1 text-white text-lg font-black text-center">
                {quantity}
            </span>
            <Button
                size="icon"
                variant="ghost"
                className="h-10 w-10 lg:h-12 lg:w-12 text-white hover:bg-medical-teal-700 hover:text-white"
                onClick={handleIncrement}
            >
                <Plus className="h-5 w-5 stroke-[3px]" />
            </Button>
        </div>
    )
}