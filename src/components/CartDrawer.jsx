import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/CartContext"
import { useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2 } from "lucide-react"

export function CartDrawer({ open, onOpenChange }) {
    const { cart, updateQuantity, removeFromCart } = useCart()
    const navigate = useNavigate()

    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)

    const handleCheckout = () => {
        onOpenChange(false)
        const user = localStorage.getItem("user")
        if (!user) {
            navigate("/login", { state: { from: { pathname: "/checkout" } } })
        } else {
            navigate("/checkout")
        }
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-md flex flex-col">
                <SheetHeader>
                    <SheetTitle>Your Cart ({cart.length})</SheetTitle>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto py-4">
                    {cart.length === 0 ? (
                        <div className="text-center text-muted-foreground py-8">
                            Your cart is empty.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cart.map(item => (
                                <div key={item.id} className="flex gap-4 items-center border-b pb-4">
                                    <img src={item.image} alt={item.name} className="h-16 w-16 object-cover rounded" />
                                    <div className="flex-1">
                                        <h4 className="font-medium line-clamp-1">{item.name}</h4>
                                        <p className="text-sm text-muted-foreground">₹{item.price}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                                                <Minus className="h-3 w-3" />
                                            </Button>
                                            <span className="text-sm w-4 text-center">{item.quantity}</span>
                                            <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                                <Plus className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => removeFromCart(item.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {cart.length > 0 && (
                    <SheetFooter className="pt-4 border-t">
                        <div className="w-full space-y-4">
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>₹{total}</span>
                            </div>
                            <Button className="w-full" onClick={handleCheckout}>
                                Proceed to Checkout
                            </Button>
                        </div>
                    </SheetFooter>
                )}
            </SheetContent>
        </Sheet>
    )
}
