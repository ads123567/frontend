import { FOOTER_LINKS, TRUST_BADGES } from "@/data/mockData"
import { Facebook, Instagram, Twitter } from "lucide-react"

export function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
            {/* Trust Strip */}
            <div className="container mx-auto px-4 mb-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {TRUST_BADGES.map((badge) => (
                        <div key={badge.id} className="bg-gray-800 rounded-lg p-4 flex items-center gap-3">
                            <span className="text-2xl">{badge.icon}</span>
                            <span className="font-semibold text-white text-sm">{badge.text}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-gray-800 pt-12">
                {/* Useful Links */}
                <div>
                    <h4 className="text-white font-bold mb-4">Useful Links</h4>
                    <ul className="space-y-2 text-sm">
                        {FOOTER_LINKS.useful.map(link => (
                            <li key={link}><a href="#" className="hover:text-medical-teal-400 transition-colors">{link}</a></li>
                        ))}
                    </ul>
                </div>

                {/* Company */}
                <div>
                    <h4 className="text-white font-bold mb-4">Company</h4>
                    <ul className="space-y-2 text-sm">
                        {FOOTER_LINKS.company.map(link => (
                            <li key={link}><a href="#" className="hover:text-medical-teal-400 transition-colors">{link}</a></li>
                        ))}
                    </ul>
                </div>

                {/* Categories */}
                <div>
                    <h4 className="text-white font-bold mb-4">Categories</h4>
                    <ul className="space-y-2 text-sm">
                        {FOOTER_LINKS.categories.map(link => (
                            <li key={link}><a href="#" className="hover:text-medical-teal-400 transition-colors">{link}</a></li>
                        ))}
                    </ul>
                </div>

                {/* Social & App */}
                <div>
                    <h4 className="text-white font-bold mb-4">Follow Us</h4>
                    <div className="flex gap-4 mb-6">
                        <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-medical-teal-600 cursor-pointer transition-colors">
                            <Facebook className="h-5 w-5" />
                        </div>
                        <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-medical-teal-600 cursor-pointer transition-colors">
                            <Instagram className="h-5 w-5" />
                        </div>
                        <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-medical-teal-600 cursor-pointer transition-colors">
                            <Twitter className="h-5 w-5" />
                        </div>
                    </div>
                    <h4 className="text-white font-bold mb-4">Download App</h4>
                    <div className="flex flex-col gap-2">
                        <div className="h-10 bg-gray-800 rounded border border-gray-700 flex items-center justify-center text-xs font-bold cursor-pointer hover:border-medical-teal-500">
                            Get it on Google Play
                        </div>
                        <div className="h-10 bg-gray-800 rounded border border-gray-700 flex items-center justify-center text-xs font-bold cursor-pointer hover:border-medical-teal-500">
                            Download on App Store
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-12 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
                © 2025 MedBlink Technologies Pvt Ltd. All rights reserved.
            </div>
        </footer>
    )
}
