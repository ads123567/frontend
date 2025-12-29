import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Search, Crosshair } from "lucide-react"
import { checkPincode, checkLocation } from '@/api'

export function LocationModal({ open, onOpenChange, onLocationSelect }) {
    const [pincode, setPincode] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handlePincodeSubmit = async () => {
        setLoading(true)
        setError("")
        try {
            const data = await checkPincode(pincode)
            onLocationSelect(data)
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
                    onLocationSelect(data)
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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden gap-0">
                <div className="bg-medical-teal-50 p-6 text-center border-b">
                    <h2 className="text-2xl font-bold text-medical-teal-700 mb-2">Welcome to medblink</h2>
                    <p className="text-sm text-medical-teal-600">
                        Please provide your delivery location to see medicines and health products available near you.
                    </p>
                </div>

                <div className="p-6 space-y-6">
                    {/* Detect Location Button */}
                    <div className="flex items-center gap-4">
                        <div className="bg-medical-teal-100 p-3 rounded-full">
                            <MapPin className="h-6 w-6 text-medical-teal-600" />
                        </div>
                        <div className="flex-1">
                            <Button
                                onClick={handleLocationClick}
                                disabled={loading}
                                className="w-full bg-medical-teal-600 hover:bg-medical-teal-700 text-white h-12 text-base"
                            >
                                {loading ? "Detecting..." : "Detect my location"}
                                {!loading && <Crosshair className="ml-2 h-4 w-4" />}
                            </Button>
                        </div>
                    </div>

                    <div className="relative flex items-center justify-center">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative bg-background px-4 text-xs uppercase text-muted-foreground font-medium">
                            OR
                        </div>
                    </div>

                    {/* Search Location Input */}
                    <div className="space-y-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Enter Pincode (e.g. 110001)"
                                value={pincode}
                                onChange={(e) => setPincode(e.target.value)}
                                className="pl-9 h-11"
                            />
                            <Button
                                onClick={handlePincodeSubmit}
                                disabled={loading || pincode.length !== 6}
                                className="absolute right-1 top-1 h-9"
                                size="sm"
                                variant="ghost"
                            >
                                Check
                            </Button>
                        </div>
                        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
