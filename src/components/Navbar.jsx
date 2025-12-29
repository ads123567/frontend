import { Search, ShoppingCart, User, ChevronDown, MapPin, LogOut, UserCircle, Package, HelpCircle, Map } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/context/CartContext"
import { Link, useNavigate } from "react-router-dom"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState, useEffect } from "react"

export function Navbar({ location, onLocationClick, onCartClick }) {
    const { cart } = useCart()
    const navigate = useNavigate()
    const [user, setUser] = useState(null)

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0)
    const cartTotal = cart.reduce((acc, item) => acc + (item.selling_price_with_gst || item.price || 0) * item.quantity, 0)

    useEffect(() => {
        const checkUser = () => {
            const savedUser = localStorage.getItem("user")
            if (savedUser) {
                setUser(JSON.parse(savedUser))
            } else {
                setUser(null)
            }
        }

        checkUser()
        window.addEventListener('login-success', checkUser)
        window.addEventListener('storage', checkUser)

        return () => {
            window.removeEventListener('login-success', checkUser)
            window.removeEventListener('storage', checkUser)
        }
    }, [])

    const handleLogout = () => {
        localStorage.removeItem("user")
        localStorage.removeItem("token")
        setUser(null)
        navigate("/")
    }

    return (
        <nav className="sticky top-0 z-40 w-full bg-white border-b shadow-sm">
            <div className="container mx-auto px-4 h-20 flex items-center gap-4 lg:gap-8">
                {/* Logo */}
                <Link to="/" className="flex flex-col shrink-0">
                    <div className="flex items-center gap-1">
                        <span className="text-2xl font-extrabold text-medical-teal-600 tracking-tight">medblink</span>
                        <div className="h-2 w-2 bg-yellow-400 rounded-full animate-pulse" />
                    </div>
                    <span className="text-[10px] font-medium text-gray-500 -mt-1 tracking-wider">1-DAY DELIVERY • B2B</span>
                </Link>

                {/* Location Selector (Desktop) */}
                <div
                    className="hidden lg:flex flex-col cursor-pointer min-w-[200px] max-w-[300px]"
                    onClick={onLocationClick}
                >
                    <span className="text-[10px] font-bold text-gray-500 uppercase">
                        {location?.distance_km ? `Nearest Store (${location.distance_km} km)` : "Select Location"}
                    </span>
                    <div className="flex items-center gap-1 text-sm font-semibold text-gray-700 truncate">
                        <span className="truncate">{location?.city ? `${location.city} - ${location.store_id}` : "Detect Location"}</span>
                        <ChevronDown className="h-4 w-4 shrink-0 text-medical-teal-600" />
                    </div>
                </div>

                {/* Search Bar */}
                <div className="flex-1 max-w-2xl relative">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search medicines, health products, brands..."
                            className="w-full pl-10 bg-gray-50 border-gray-200 focus:bg-white focus:border-medical-teal-500 transition-all h-11 rounded-lg"
                        />
                    </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-3 shrink-0">
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-medical-teal-100 text-medical-teal-700">
                                        <User className="h-6 w-6" />
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{user.name || "User"}</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {user.phone}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => navigate("/profile?tab=profile")}>
                                    <UserCircle className="mr-2 h-4 w-4" />
                                    <span>Edit Profile</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigate("/profile?tab=orders")}>
                                    <Package className="mr-2 h-4 w-4" />
                                    <span>Orders</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigate("/profile?tab=addresses")}>
                                    <MapPin className="mr-2 h-4 w-4" />
                                    <span>Addresses</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <HelpCircle className="mr-2 h-4 w-4" />
                                    <span>Help Center</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Logout</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Link to="/login">
                            <Button variant="ghost" className="hidden sm:flex text-gray-600 hover:text-medical-teal-600">
                                Login / Sign up
                            </Button>
                        </Link>
                    )}

                    <Button
                        className="bg-medical-teal-600 hover:bg-medical-teal-700 text-white h-11 px-4 rounded-lg flex items-center gap-2 relative"
                        onClick={onCartClick}
                    >
                        <div className="relative">
                            <ShoppingCart className="h-5 w-5" />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-yellow-400 text-medical-teal-900 text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </div>
                        <div className="hidden sm:flex flex-col items-start text-xs ml-1">
                            <span className="font-medium opacity-90">Cart</span>
                            {cartTotal > 0 && <span className="font-bold">₹{cartTotal.toFixed(0)}</span>}
                        </div>
                    </Button>
                </div>
            </div>

            {/* Mobile Location Bar */}
            <div className="lg:hidden bg-medical-teal-50 px-4 py-2 flex items-center gap-2 text-xs font-medium text-medical-teal-800 border-b border-medical-teal-100" onClick={onLocationClick}>
                <MapPin className="h-3 w-3" />
                <span className="truncate">{location?.city ? `Delivering to: ${location.city}` : "Select your delivery location"}</span>
                <ChevronDown className="h-3 w-3 ml-auto" />
            </div>
        </nav>
    )
}
