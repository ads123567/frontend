import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChevronLeft, Package, MapPin, Phone, MessageCircle, AlertCircle } from "lucide-react"
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

    if (loading) return <div className="p-8 text-center mt-20">Loading order details...</div>
    if (error || !order) return (
        <div className="p-8 text-center mt-20">
            <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
            <h2 className="text-xl font-bold">{error || "Order not found"}</h2>
            <Button variant="link" onClick={() => navigate("/profile?tab=orders")}>Back to Orders</Button>
        </div>
    )

    // Calculate sum of MRPs (Listing Price)
    const listingPrice = order.items?.reduce((sum, item) => sum + (parseFloat(item.mrp) * item.quantity), 0) || 0

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl mt-16">
            <Button
                variant="ghost"
                className="mb-6 hover:bg-gray-100"
                onClick={() => navigate("/profile?tab=orders")}
            >
                <ChevronLeft className="mr-2 h-4 w-4" /> Back to Orders
            </Button>

            <div className="space-y-6">
                {/* Order ID and Date */}
                <Card className="border-none shadow-sm bg-gray-50/50">
                    <CardHeader className="pb-2">
                        <p className="text-sm font-medium text-gray-500">Order Id</p>
                        <CardTitle className="text-lg font-mono">OD{order.id.toString().padStart(18, '0')}</CardTitle>
                        <p className="text-sm font-medium text-gray-500 mt-4">Order Date</p>
                        <p className="text-gray-900">{new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </CardHeader>
                </Card>

                {/* Delivery Details */}
                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Delivery details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 bg-gray-50/50 m-4 rounded-2xl p-6">
                        <div className="flex gap-3">
                            <div className="mt-1">
                                <div className="h-4 w-4 rounded-full border-2 border-gray-400 flex items-center justify-center">
                                    <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="font-bold flex items-center gap-2">
                                    Other <span className="font-normal text-gray-600 line-clamp-1">Sri Ram spandana Challaghatta, nagasandra road, Nea...</span>
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3 items-center">
                            <UserIcon className="h-5 w-5 text-gray-400" />
                            <p className="font-medium text-gray-900">Aman <span className="ml-2 font-normal text-gray-600">9523015069</span></p>
                        </div>
                    </CardContent>
                </Card>

                {/* Product List */}
                <div className="space-y-4">
                    <p className="font-bold text-lg px-2">Order Items</p>
                    {order.items?.map((item) => (
                        <Card key={item.id} className="border-none shadow-sm overflow-hidden">
                            <CardContent className="p-4 flex gap-4">
                                <div className="h-20 w-20 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                                    <Package className="h-8 w-8 text-gray-400" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-bold text-gray-900">{item.product?.name || "Product"}</p>
                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold">₹{item.unit_price}</p>
                                            <p className="text-xs text-gray-400 line-through">₹{item.mrp}</p>
                                        </div>
                                    </div>
                                    <div className="mt-2 text-right">
                                        <Button
                                            variant="link"
                                            className="text-medical-teal-600 h-auto p-0 font-bold"
                                            onClick={() => setShowReturnModal(true)}
                                        >
                                            Return
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Price Details */}
                <Card className="border-none shadow-sm overflow-hidden relative">
                    {/* Tiny Divider Dot */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-1.5 w-1.5 bg-medical-teal-500 rounded-full"></div>

                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Price details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 bg-gray-50/50 m-4 rounded-2xl p-6">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Listing price</span>
                            <span className="font-medium">₹{listingPrice}</span>
                        </div>

                        <div className="border-t border-dashed border-gray-300 pt-4 mt-4">
                            <div className="flex justify-between items-center text-lg">
                                <span className="font-bold">Total amount</span>
                                <span className="font-bold">₹{order.total_amount}</span>
                            </div>
                        </div>

                        <div className="mt-6 bg-white rounded-xl p-4 flex items-center justify-between border border-gray-100">
                            <span className="text-gray-600 font-medium">Payment method</span>
                            <div className="flex items-center gap-2">
                                <div className="h-5 w-8 bg-gray-100 rounded flex items-center justify-center border text-[10px] font-bold">UPI</div>
                                <span className="text-sm font-bold uppercase">{order.payment_method}</span>
                            </div>
                        </div>

                        <Button className="w-full mt-4 h-14 bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-100 rounded-2xl shadow-none font-bold text-lg flex items-center justify-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center">
                                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"></path></svg>
                            </div>
                            Download Invoice
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Return Modal */}
            <Dialog open={showReturnModal} onOpenChange={setShowReturnModal}>
                <DialogContent className="max-w-[320px] rounded-3xl p-6">
                    <DialogHeader className="items-center text-center">
                        <div className="h-16 w-16 bg-medical-teal-50 rounded-full flex items-center justify-center mb-4">
                            <HelpCircle className="h-8 w-8 text-medical-teal-600" />
                        </div>
                        <DialogTitle className="text-xl font-bold">Return Request</DialogTitle>
                        <DialogDescription className="text-gray-600 pt-2">
                            Please contact our support team to initiate your return
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-3 mt-6">
                        <Button
                            className="bg-[#25D366] hover:bg-[#20ba5a] text-white h-14 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-none border-none"
                            onClick={() => window.open(`https://wa.me/919523015069?text=Hi, I want to return an item from my order OD${order.id}`, '_blank')}
                        >
                            <MessageCircle className="h-6 w-6 fill-white" />
                            WhatsApp
                        </Button>
                        <Button
                            className="bg-[#007AFF] hover:bg-[#0066d6] text-white h-14 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-none border-none"
                            onClick={() => window.location.href = 'tel:9523015069'}
                        >
                            <Phone className="h-6 w-6" />
                            Phone Call
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

function UserIcon({ className }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
        </svg>
    )
}

function HelpCircle({ className }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
    )
}
