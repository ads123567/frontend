import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function Checkout() {
    const { cart, clearCart } = useCart()
    const navigate = useNavigate()
    const location = useLocation()
    const [user, setUser] = useState(null)

    useEffect(() => {
        const savedUser = localStorage.getItem("user")
        if (!savedUser) {
            navigate("/login", { state: { from: location }, replace: true })
        } else {
            setUser(JSON.parse(savedUser))
        }
    }, [navigate, location])

    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)

    const handlePlaceOrder = () => {
        // Call API to place order
        alert("Order Placed Successfully!")
        clearCart()
        navigate("/")
    }

    if (!user) return null

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold">Checkout</h2>
            <Card>
                <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {cart.map(item => (
                        <div key={item.id} className="flex justify-between">
                            <span>{item.name} x {item.quantity}</span>
                            <span>₹{item.price * item.quantity}</span>
                        </div>
                    ))}
                    <div className="border-t pt-4 flex justify-between font-bold">
                        <span>Total</span>
                        <span>₹{total}</span>
                    </div>
                </CardContent>
            </Card>
            <Button className="w-full size-lg" onClick={handlePlaceOrder}>
                Place Order
            </Button>
        </div>
    )
}
