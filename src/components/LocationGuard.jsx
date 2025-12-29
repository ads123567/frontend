import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { checkPincode, checkLocation } from '@/api'

export function LocationGuard({ children }) {
    const [store, setStore] = useState(null)
    const [open, setOpen] = useState(false)
    const [pincode, setPincode] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        const savedStore = localStorage.getItem("store")
        if (savedStore) {
            setStore(JSON.parse(savedStore))
        } else {
            setOpen(true)
        }
    }, [])

    const handlePincodeSubmit = async () => {
        setLoading(true)
        setError("")
        try {
            const data = await checkPincode(pincode)
            if (data.store_id === 0) {
                throw new Error(data.message || "Service not available in this area.")
            }
            localStorage.setItem("store", JSON.stringify(data))
            setStore(data)
            setOpen(false)
        } catch (err) {
            setError("Service not available in this area.")
        } finally {
            setLoading(false)
        }
    }

    const handleLocationClick = () => {
        setLoading(true)
        setError("")
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                try {
                    const { latitude, longitude } = position.coords
                    const data = await checkLocation(latitude, longitude)
                    localStorage.setItem("store", JSON.stringify(data))
                    setStore(data)
                    setOpen(false)
                } catch (err) {
                    setError("Service not available in this area.")
                } finally {
                    setLoading(false)
                }
            }, (err) => {
                setError("Location access denied. Please enter pincode.")
                setLoading(false)
            })
        } else {
            setError("Geolocation is not supported by this browser.")
            setLoading(false)
        }
    }

    if (!store) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[425px]" onPointerDownOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
                    <DialogHeader>
                        <DialogTitle>Select Location</DialogTitle>
                        <DialogDescription>
                            We need your location to show available products.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <Button onClick={handleLocationClick} disabled={loading} className="w-full">
                            {loading ? "Detecting..." : "Use Current Location"}
                        </Button>
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">Or enter pincode</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Enter Pincode"
                                value={pincode}
                                onChange={(e) => setPincode(e.target.value)}
                            />
                            <Button onClick={handlePincodeSubmit} disabled={loading || pincode.length !== 6}>
                                Check
                            </Button>
                        </div>
                        {error && <p className="text-sm text-red-500">{error}</p>}
                    </div>
                </DialogContent>
            </Dialog>
        )
    }

    return children
}
