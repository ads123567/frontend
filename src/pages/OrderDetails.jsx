import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, Package, MessageCircle, Phone, AlertCircle, Download, User, MapPin } from "lucide-react"
import { getOrderDetailsApi } from "@/api"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

export default function OrderDetails() {
    const { orderId } = useParams()
    const navigate = useNavigate()
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showReturnModal, setShowReturnModal] = useState(false)

    useEffect(() => {
        setLoading(true)
        getOrderDetailsApi(orderId)
            .then(setOrder)
            .catch(err => {
                console.error(err)
                setError("Failed to load order details")
            })
            .finally(() => setLoading(false))
    }, [orderId])

    if (loading) return <div className="p-8 text-center mt-20 animate-pulse">Loading order details...</div>
    if (error || !order) return (
        <div className="p-8 text-center mt-20">
            <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
            <h2 className="text-xl font-bold">{error || "Order not found"}</h2>
            <Button variant="link" onClick={() => navigate("/profile?tab=orders")}>Back to Orders</Button>
        </div>
    )

    const listingPrice = order.items?.reduce((sum, item) => sum + (parseFloat(item.mrp) * item.quantity), 0) || 0

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl mt-16">
            <Button
                variant="ghost"
                className="mb-6 hover:bg-gray-100 -ml-2 text-gray-600"
                onClick={() => navigate("/profile?tab=orders")}
            >
                <ChevronLeft className="mr-2 h-4 w-4" /> Back to Orders
            </Button>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* LEFT COLUMN: Order Info & Items */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Order ID Card */}
                    <Card className="border-none shadow-sm bg-white overflow-hidden">
                        <div className="h-1 bg-medical-teal-500 w-full" />
                        <CardHeader className="flex flex-row justify-between items-start space-y-0">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Order Reference</p>
                                <CardTitle className="text-xl font-mono mt-1">
                                    OD{order.id.toString().padStart(12, '0')}
                                </CardTitle>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Placed On</p>
                                <p className="text-gray-900 font-medium mt-1">
                                    {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </p>
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Product List */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-lg px-1 flex items-center gap-2">
                            <Package className="h-5 w-5 text-medical-teal-600" />
                            Order Items ({order.items?.length})
                        </h3>
                        {order.items?.map((item) => (
                            <Card key={item.id} className="border border-gray-100 shadow-sm transition-hover hover:shadow-md">
                                <CardContent className="p-4 flex gap-4">
                                    <div className="h-24 w-24 bg-gray-50 rounded-xl flex-shrink-0 flex items-center justify-center border">
                                        <Package className="h-10 w-10 text-gray-300" />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-bold text-gray-900 text-lg line-clamp-1">{item.product?.name || "Premium Product"}</p>
                                                <p className="text-sm text-gray-500 font-medium">Quantity: {item.quantity}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-lg text-medical-teal-700">₹{item.unit_price}</p>
                                                <p className="text-xs text-gray-400 line-through">₹{item.mrp}</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-end">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-medical-teal-600 border-medical-teal-100 hover:bg-medical-teal-50 rounded-lg font-bold"
                                                onClick={() => setShowReturnModal(true)}
                                            >
                                                Request Return
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* RIGHT COLUMN: Delivery & Summary */}
                <div className="lg:col-span-1 space-y-6">
                    
                    {/* Delivery Details */}
                    <Card className="border-none shadow-sm overflow-hidden bg-white">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-medical-teal-600" />
                                Delivery Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                                <div className="flex gap-3">
                                    <div className="mt-1 h-2 w-2 rounded-full bg-medical-teal-500 shrink-0" />
                                    <p className="text-sm text-gray-700 leading-relaxed font-medium">
                                        <span className="font-bold text-gray-900">Home </span>
                                        Sri Ram spandana Challaghatta, nagasandra road, Near Metro Station, Bangalore - 560073
                                    </p>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                                        <User className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">Aman</p>
                                        <p className="text-xs text-gray-500">+91 9523015069</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Price Summary - Sticky on Desktop */}
                    <Card className="border-none shadow-md bg-white lg:sticky lg:top-24">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold">Payment Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-gray-600">
                                    <span>Listing price</span>
                                    <span>₹{listingPrice}</span>
                                </div>
                                <div className="flex justify-between text-green-600 font-medium">
                                    <span>Discount</span>
                                    <span>- ₹{listingPrice - order.total_amount}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Delivery Fee</span>
                                    <span className="text-green-600">FREE</span>
                                </div>
                                <div className="border-t border-dashed pt-3 mt-3 flex justify-between items-center">
                                    <span className="font-bold text-lg">Total Amount</span>
                                    <span className="font-extrabold text-xl text-medical-teal-700">₹{order.total_amount}</span>
                                </div>
                            </div>

                            <div className="bg-medical-teal-50/50 rounded-xl p-3 flex items-center justify-between border border-medical-teal-100">
                                <span className="text-medical-teal-900 text-xs font-bold uppercase tracking-tight">Paid via {order.payment_method}</span>
                                <div className="h-6 px-2 bg-white rounded border border-medical-teal-200 text-[10px] font-black text-medical-teal-600 flex items-center">
                                    SUCCESS
                                </div>
                            </div>

                            <Button className="w-full h-12 bg-gray-900 hover:bg-black text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                                <Download className="h-4 w-4" />
                                Download Invoice
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Return Modal (Keeping your logic) */}
            <Dialog open={showReturnModal} onOpenChange={setShowReturnModal}>
                <DialogContent className="max-w-[340px] rounded-[2rem] p-8">
                    <DialogHeader className="items-center text-center">
                        <div className="h-20 w-20 bg-medical-teal-50 rounded-full flex items-center justify-center mb-4">
                            <AlertCircle className="h-10 w-10 text-medical-teal-600" />
                        </div>
                        <DialogTitle className="text-2xl font-bold">Return Request</DialogTitle>
                        <DialogDescription className="text-gray-500 text-base leading-relaxed">
                            To ensure a smooth return, please chat with our support experts.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-3 mt-8">
                        <Button 
                            className="bg-[#25D366] hover:bg-[#1fa851] text-white h-14 rounded-2xl font-bold text-lg gap-3"
                            onClick={() => window.open(`https://wa.me/919523015069?text=Hi, I want to return an item from my order OD${order.id}`, '_blank')}
                        >
                            <MessageCircle className="h-6 w-6 fill-current" /> WhatsApp Support
                        </Button>
                        <Button 
                            variant="outline"
                            className="h-14 rounded-2xl font-bold text-lg gap-3 border-2"
                            onClick={() => window.location.href = 'tel:9523015069'}
                        >
                            <Phone className="h-5 w-5" /> Call Agent
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}