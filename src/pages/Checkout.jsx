import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getAddresses, placeOrderApi } from '@/api'
import { MapPin, Plus, CheckCircle2, Package } from 'lucide-react'
import { Dialog, DialogContent } from "@/components/ui/dialog"
import confetti from 'canvas-confetti'

export function Checkout() {
    const { cart, clearCart, refreshCart } = useCart()
    const navigate = useNavigate()
    const location = useLocation()
    const [user, setUser] = useState(null)
    const [addresses, setAddresses] = useState([])
    const [selectedAddressId, setSelectedAddressId] = useState(null)
    const [loading, setLoading] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [placedOrder, setPlacedOrder] = useState(null)
    const [countdown, setCountdown] = useState(5)

    useEffect(() => {
        const savedUser = localStorage.getItem("user")
        if (!savedUser) {
            navigate("/login", { state: { from: location }, replace: true })
        } else {
            const parsedUser = JSON.parse(savedUser)
            setUser(parsedUser)
            fetchAddresses()
        }
    }, [navigate, location])

    const fetchAddresses = async () => {
        try {
            const data = await getAddresses()
            setAddresses(data)
            const defaultAddr = data.find(a => a.is_default) || data[0]
            if (defaultAddr) setSelectedAddressId(defaultAddr.id)
        } catch (err) {
            console.error("Failed to load addresses", err)
        }
    }

    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
    const deliveryFee = total > 500 ? 0 : 40

    const handlePlaceOrder = async () => {
        if (!selectedAddressId) {
            alert("Please select or add an address first")
            return
        }

        setLoading(true)
        try {
            const orderData = {
                address_id: selectedAddressId,
                payment_method: "cod"
            }
            const res = await placeOrderApi(orderData)
            setPlacedOrder(res)
            setShowSuccess(true)

            // Celebration!
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#0d9488', '#0ea5e9', '#10b981']
            })

            // Clear cart and refresh local state
            await clearCart()
            if (refreshCart) await refreshCart()

            // Countdown for redirect
            let timer = 5
            const interval = setInterval(() => {
                timer -= 1
                setCountdown(timer)
                if (timer <= 0) {
                    clearInterval(interval)
                    navigate("/profile?tab=orders")
                }
            }, 1000)

        } catch (err) {
            alert("Failed to place order. Please try again.")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    if (!user) return null

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Addresses and Payment */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Address Selection */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-xl flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-medical-teal-600" />
                                Delivery Address
                            </CardTitle>
                            <Button variant="ghost" size="sm" onClick={() => navigate("/profile?tab=addresses")} className="text-medical-teal-600">
                                <Plus className="h-4 w-4 mr-1" /> Add New
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {addresses.length === 0 ? (
                                <div className="text-center py-6 border-2 border-dashed rounded-lg bg-gray-50">
                                    <p className="text-gray-500 mb-3">No saved addresses found</p>
                                    <Button size="sm" onClick={() => navigate("/profile?tab=addresses")}>Add Address</Button>
                                </div>
                            ) : (
                                <div className="grid gap-3">
                                    {addresses.map(addr => (
                                        <div
                                            key={addr.id}
                                            onClick={() => setSelectedAddressId(addr.id)}
                                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedAddressId === addr.id
                                                    ? "border-medical-teal-600 bg-medical-teal-50"
                                                    : "border-gray-100 hover:border-gray-200 bg-white"
                                                }`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-semibold text-gray-800">{addr.address_line}</p>
                                                    <p className="text-sm text-gray-500">{addr.landmark}</p>
                                                    <p className="text-sm text-gray-500">Pincode: {addr.pincode_id}</p>
                                                </div>
                                                {selectedAddressId === addr.id && (
                                                    <CheckCircle2 className="h-5 w-5 text-medical-teal-600" />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Payment Method */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">Payment Method</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="p-4 rounded-lg border-2 border-medical-teal-600 bg-medical-teal-50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-medical-teal-100 flex items-center justify-center text-medical-teal-600 font-bold">₹</div>
                                    <div>
                                        <p className="font-semibold text-gray-800">Cash on Delivery</p>
                                        <p className="text-xs text-gray-500">Pay when you receive the order</p>
                                    </div>
                                </div>
                                <CheckCircle2 className="h-5 w-5 text-medical-teal-600" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Order Summary */}
                <div className="space-y-6">
                    <Card className="sticky top-24">
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="max-h-60 overflow-y-auto space-y-3 pr-2">
                                {cart.map(item => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                        <span className="text-gray-600 truncate flex-1 mr-4">{item.name} x {item.quantity}</span>
                                        <span className="font-medium">₹{item.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t pt-4 space-y-2">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Subtotal</span>
                                    <span>₹{total}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Delivery Fee</span>
                                    <span className={deliveryFee === 0 ? "text-green-600 font-medium" : ""}>
                                        {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                                    </span>
                                </div>
                                <div className="flex justify-between font-bold text-lg pt-2 border-t text-gray-900">
                                    <span>Total</span>
                                    <span>₹{total + deliveryFee}</span>
                                </div>
                            </div>

                            <Button
                                className="w-full h-12 text-lg bg-medical-teal-600 hover:bg-medical-teal-700"
                                onClick={handlePlaceOrder}
                                disabled={loading || cart.length === 0}
                            >
                                {loading ? "Placing Order..." : "Place Order"}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Success Modal */}
            <Dialog open={showSuccess} onOpenChange={() => { }}>
                <DialogContent className="sm:max-w-md text-center py-10">
                    <div className="flex flex-col items-center gap-4">
                        <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                            <Package className="h-10 w-10 animate-bounce" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">Congratulations!</h2>
                        <p className="text-gray-600 font-medium">Your order has been placed successfully.</p>
                        {placedOrder && (
                            <p className="text-sm bg-gray-100 px-4 py-2 rounded-full font-bold text-gray-700">
                                Order ID: #{placedOrder.id}
                            </p>
                        )}
                        <div className="mt-4 space-y-2">
                            <p className="text-xs text-medical-teal-600 font-semibold uppercase tracking-wider">
                                Redirecting to orders in {countdown}s...
                            </p>
                            <Button variant="outline" size="sm" onClick={() => navigate("/profile?tab=orders")}>
                                View My Orders
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
