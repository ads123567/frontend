import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { User, Store, FileText, Phone, Mail, Edit2, MapPin, Package, Plus, HelpCircle, LogOut } from "lucide-react"
import { getAddresses, addAddress, getOrders, getPincodes } from "@/api"

export function Profile() {
    const [searchParams] = useSearchParams()
    const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "profile")
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)

    // Data states
    const [addresses, setAddresses] = useState([])
    const [orders, setOrders] = useState([])
    const [pincodes, setPincodes] = useState([])

    // Loading/Error states
    const [loading, setLoading] = useState(false)

    // Address Form state
    const [showAddAddress, setShowAddAddress] = useState(false)
    const [newAddress, setNewAddress] = useState({
        address_line: "",
        landmark: "",
        pincode_id: "",
        is_default: false
    })

    // Edit states
    const [isEditingGeneral, setIsEditingGeneral] = useState(false)
    const [generalForm, setGeneralForm] = useState({})

    // Sensitive edit states
    const [sensitiveEditType, setSensitiveEditType] = useState(null) // 'phone' or 'email'
    const [newValue, setNewValue] = useState("")
    const [otp, setOtp] = useState("")
    const [otpSent, setOtpSent] = useState(false)

    useEffect(() => {
        const tab = searchParams.get("tab")
        if (tab) setActiveTab(tab)
    }, [searchParams])

    useEffect(() => {
        const savedUser = localStorage.getItem("user")
        const savedToken = localStorage.getItem("token") || "mock-token"
        if (savedUser) {
            const parsed = JSON.parse(savedUser)
            setUser(parsed)
            setGeneralForm(parsed)
            setToken(savedToken)
        }

        getPincodes().then(setPincodes).catch(console.error)
    }, [])

    useEffect(() => {
        if (!token) return

        if (activeTab === "addresses") {
            setLoading(true)
            getAddresses(token)
                .then(setAddresses)
                .catch(err => console.error("Failed to load addresses"))
                .finally(() => setLoading(false))
        } else if (activeTab === "orders") {
            setLoading(true)
            getOrders(token)
                .then(setOrders)
                .catch(err => console.error("Failed to load orders"))
                .finally(() => setLoading(false))
        }
    }, [activeTab, token])

    const handleGeneralSave = () => {
        const updatedUser = { ...user, ...generalForm }
        setUser(updatedUser)
        localStorage.setItem("user", JSON.stringify(updatedUser))
        setIsEditingGeneral(false)
    }

    const handleSensitiveUpdate = () => {
        if (otp.length !== 6) {
            alert("Please enter a valid 6-digit OTP")
            return
        }
        const updatedUser = { ...user, [sensitiveEditType]: newValue }
        setUser(updatedUser)
        localStorage.setItem("user", JSON.stringify(updatedUser))
        setSensitiveEditType(null)
        setNewValue("")
        setOtp("")
        setOtpSent(false)
    }

    const handleAddAddress = async () => {
        if (!newAddress.address_line || !newAddress.pincode_id) {
            alert("Please fill required fields")
            return
        }
        try {
            await addAddress(token, {
                ...newAddress,
                pincode_id: parseInt(newAddress.pincode_id)
            })
            setShowAddAddress(false)
            setNewAddress({ address_line: "", landmark: "", pincode_id: "", is_default: false })
            const updated = await getAddresses(token)
            setAddresses(updated)
        } catch (err) {
            alert("Failed to add address")
        }
    }

    if (!user) return <div className="p-8 text-center">Please login to view profile</div>

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">My Account</h1>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar / Tabs */}
                <div className="w-full md:w-64 shrink-0 space-y-2">
                    <Button
                        variant={activeTab === "profile" ? "default" : "ghost"}
                        className={`w-full justify-start ${activeTab === "profile" ? "bg-medical-teal-600 hover:bg-medical-teal-700" : ""}`}
                        onClick={() => setActiveTab("profile")}
                    >
                        <User className="mr-2 h-4 w-4" /> Profile
                    </Button>
                    <Button
                        variant={activeTab === "orders" ? "default" : "ghost"}
                        className={`w-full justify-start ${activeTab === "orders" ? "bg-medical-teal-600 hover:bg-medical-teal-700" : ""}`}
                        onClick={() => setActiveTab("orders")}
                    >
                        <Package className="mr-2 h-4 w-4" /> Orders
                    </Button>
                    <Button
                        variant={activeTab === "addresses" ? "default" : "ghost"}
                        className={`w-full justify-start ${activeTab === "addresses" ? "bg-medical-teal-600 hover:bg-medical-teal-700" : ""}`}
                        onClick={() => setActiveTab("addresses")}
                    >
                        <MapPin className="mr-2 h-4 w-4" /> Addresses
                    </Button>
                    <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => alert("Help Center coming soon!")}
                    >
                        <HelpCircle className="mr-2 h-4 w-4" /> Help Center
                    </Button>
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => {
                            localStorage.removeItem("user")
                            localStorage.removeItem("token")
                            window.location.href = "/"
                        }}
                    >
                        <LogOut className="mr-2 h-4 w-4" /> Logout
                    </Button>
                </div>

                {/* Content Area */}
                <div className="flex-1">
                    {activeTab === "profile" && (
                        <div className="space-y-6">
                            {/* General Details Section */}
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle className="text-xl">General Details</CardTitle>
                                        <CardDescription>Manage your basic account information</CardDescription>
                                    </div>
                                    {!isEditingGeneral && (
                                        <Button variant="outline" size="sm" onClick={() => setIsEditingGeneral(true)}>
                                            <Edit2 className="h-4 w-4 mr-2" /> Edit
                                        </Button>
                                    )}
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label>Full Name</Label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                <Input
                                                    value={isEditingGeneral ? generalForm.name : user.name}
                                                    onChange={(e) => setGeneralForm({ ...generalForm, name: e.target.value })}
                                                    disabled={!isEditingGeneral}
                                                    className="pl-9"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Shop Name</Label>
                                            <div className="relative">
                                                <Store className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                <Input
                                                    value={isEditingGeneral ? generalForm.shop_name : user.shop_name}
                                                    onChange={(e) => setGeneralForm({ ...generalForm, shop_name: e.target.value })}
                                                    disabled={!isEditingGeneral}
                                                    className="pl-9"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>GST Number</Label>
                                            <div className="relative">
                                                <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                <Input
                                                    value={isEditingGeneral ? generalForm.gstnum : user.gstnum}
                                                    onChange={(e) => setGeneralForm({ ...generalForm, gstnum: e.target.value })}
                                                    disabled={!isEditingGeneral}
                                                    className="pl-9"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {isEditingGeneral && (
                                        <div className="flex justify-end gap-3 pt-4 border-t">
                                            <Button variant="outline" onClick={() => {
                                                setIsEditingGeneral(false)
                                                setGeneralForm(user)
                                            }}>Cancel</Button>
                                            <Button onClick={handleGeneralSave} className="bg-medical-teal-600 hover:bg-medical-teal-700">Save Changes</Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Sensitive Details Section */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-xl">Contact Information</CardTitle>
                                    <CardDescription>Manage your verified contact details</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                                    <Phone className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Phone Number</p>
                                                    <p className="font-semibold">{user.phone}</p>
                                                </div>
                                            </div>
                                            <Button variant="ghost" className="text-medical-teal-600 hover:text-medical-teal-700 hover:bg-medical-teal-50" onClick={() => setSensitiveEditType('phone')}>
                                                Update
                                            </Button>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                                                    <Mail className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Email Address</p>
                                                    <p className="font-semibold">{user.email || "Not set"}</p>
                                                </div>
                                            </div>
                                            <Button variant="ghost" className="text-medical-teal-600 hover:text-medical-teal-700 hover:bg-medical-teal-50" onClick={() => setSensitiveEditType('email')}>
                                                Update
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {activeTab === "addresses" && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold">Saved Addresses</h2>
                                <Button onClick={() => setShowAddAddress(true)} size="sm" className="bg-medical-teal-600">
                                    <Plus className="h-4 w-4 mr-2" /> Add New
                                </Button>
                            </div>

                            {loading ? <p>Loading...</p> : addresses.length === 0 ? (
                                <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed">
                                    <MapPin className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                                    <p className="text-gray-500 font-medium">No address found</p>
                                </div>
                            ) : (
                                <div className="grid gap-4">
                                    {addresses.map(addr => (
                                        <Card key={addr.id}>
                                            <CardContent className="p-4">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <p className="font-medium">{addr.address_line}</p>
                                                        {addr.landmark && <p className="text-sm text-gray-500">Landmark: {addr.landmark}</p>}
                                                        <p className="text-sm text-gray-500">Pincode: {pincodes.find(p => p.id === addr.pincode_id)?.code || addr.pincode_id}</p>
                                                    </div>
                                                    {addr.is_default && <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">Default</span>}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "orders" && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold">Order History</h2>
                            {loading ? <p>Loading...</p> : orders.length === 0 ? (
                                <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed">
                                    <Package className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                                    <p className="text-gray-500 font-medium">No record found</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {orders.map(order => (
                                        <Card key={order.id}>
                                            <CardHeader className="p-4 pb-2">
                                                <div className="flex justify-between">
                                                    <CardTitle className="text-base">Order #{order.id}</CardTitle>
                                                    <span className="text-sm font-medium capitalize px-2 py-1 bg-gray-100 rounded">{order.status}</span>
                                                </div>
                                                <CardDescription>{new Date(order.created_at).toLocaleDateString()}</CardDescription>
                                            </CardHeader>
                                            <CardContent className="p-4 pt-2">
                                                <p className="font-bold">Total: ₹{order.total_amount}</p>
                                                <p className="text-sm text-gray-500">{order.items?.length || 0} items</p>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Add Address Dialog */}
            <Dialog open={showAddAddress} onOpenChange={setShowAddAddress}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Address</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Address Line</Label>
                            <Input
                                value={newAddress.address_line}
                                onChange={e => setNewAddress({ ...newAddress, address_line: e.target.value })}
                                placeholder="Shop No, Street, Area"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Landmark</Label>
                            <Input
                                value={newAddress.landmark}
                                onChange={e => setNewAddress({ ...newAddress, landmark: e.target.value })}
                                placeholder="Near..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Pincode</Label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={newAddress.pincode_id}
                                onChange={e => setNewAddress({ ...newAddress, pincode_id: e.target.value })}
                            >
                                <option value="">Select Pincode</option>
                                {pincodes.map(p => (
                                    <option key={p.id} value={p.id}>{p.code} - {p.area_name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleAddAddress} className="bg-medical-teal-600">Save Address</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Sensitive Update Modal */}
            <Dialog open={!!sensitiveEditType} onOpenChange={(open) => !open && setSensitiveEditType(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update {sensitiveEditType === 'phone' ? 'Phone Number' : 'Email Address'}</DialogTitle>
                        <DialogDescription>
                            Enter your new {sensitiveEditType} below. We'll send an OTP to verify.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>New {sensitiveEditType === 'phone' ? 'Phone Number' : 'Email'}</Label>
                            <Input
                                value={newValue}
                                onChange={(e) => setNewValue(e.target.value)}
                                placeholder={sensitiveEditType === 'phone' ? "9876543210" : "name@example.com"}
                            />
                        </div>

                        {otpSent && (
                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                <Label>Enter OTP</Label>
                                <Input
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="123456"
                                    maxLength={6}
                                />
                                <p className="text-xs text-muted-foreground">Enter 123456 for demo</p>
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        {!otpSent ? (
                            <Button onClick={() => setOtpSent(true)} disabled={!newValue}>
                                Send OTP
                            </Button>
                        ) : (
                            <Button onClick={handleSensitiveUpdate} className="bg-medical-teal-600 hover:bg-medical-teal-700">
                                Verify & Update
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
