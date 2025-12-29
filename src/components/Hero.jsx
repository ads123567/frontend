import { Button } from "@/components/ui/button"
import { BANNERS } from "@/data/mockData"
import { ArrowRight } from "lucide-react"

export function Hero() {
    return (
        <div className="bg-gradient-to-b from-medical-teal-50 to-white pb-8 pt-6">
            <div className="container mx-auto px-4">
                {/* Hero Main */}
                <div className="flex flex-col md:flex-row items-center justify-between bg-medical-teal-600 rounded-2xl p-8 md:p-12 text-white shadow-lg overflow-hidden relative mb-10">
                    {/* Decorative Circles */}
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-medical-teal-500 opacity-50 blur-3xl" />
                    <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-medical-teal-400 opacity-30 blur-2xl" />

                    <div className="relative z-10 max-w-xl space-y-6">
                        <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                            B2B Medical Supply <br /> Wholesale Rates
                        </h1>
                        <p className="text-medical-teal-50 text-lg">
                            Bulk orders for Retailers, Hospitals & Clinics. 1-Day Delivery Guaranteed.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Button size="lg" className="bg-white text-medical-teal-700 hover:bg-gray-100 font-semibold h-12 px-8">
                                Call or whatsapp for bulk orders
                            </Button>
                            <Button size="lg" variant="outline" className="border-white text-white hover:bg-medical-teal-700 h-12 px-8 bg-transparent">
                                Explore Catalog
                            </Button>
                        </div>
                    </div>

                    {/* Hero Image Placeholder */}
                    <div className="relative z-10 mt-8 md:mt-0 hidden md:block">
                        <div className="w-80 h-64 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 flex items-center justify-center">
                            <div className="text-center">
                                <span className="text-6xl">💊</span>
                                <p className="mt-4 font-medium text-white/80">Pharmacy at your doorstep</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Promo Banners */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {BANNERS.map((banner) => (
                        <div
                            key={banner.id}
                            className={`${banner.bg} p-5 rounded-xl border border-transparent hover:border-medical-teal-200 transition-all cursor-pointer group`}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-800 group-hover:text-medical-teal-700 transition-colors">
                                        {banner.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">{banner.desc}</p>
                                    <div className="mt-4 flex items-center text-xs font-bold text-gray-800 uppercase tracking-wide">
                                        {banner.cta} <ArrowRight className="ml-1 h-3 w-3" />
                                    </div>
                                </div>
                                <span className="text-4xl group-hover:scale-110 transition-transform duration-300">{banner.icon}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
