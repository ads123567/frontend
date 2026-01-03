import { ArrowRight, ShieldCheck, Heart, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Footer } from '../components/Footer'

export default function About() {
    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Hero Section */}
            <div className="bg-medical-teal-50 py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Revolutionizing Healthcare Delivery
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                        We bridge the gap between pharmacies and patients, ensuring life-saving medications are just a click away.
                    </p>
                </div>
            </div>

            {/* Mission Section */}
            <div className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-8 rounded-2xl bg-white border border-gray-100 shadow-lg hover:shadow-xl transition-shadow text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <ShieldCheck className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-4">Trust & Safety</h3>
                            <p className="text-gray-600">
                                Every product is sourced from verified distributors. We prioritize your health with stringent quality checks.
                            </p>
                        </div>
                        <div className="p-8 rounded-2xl bg-white border border-gray-100 shadow-lg hover:shadow-xl transition-shadow text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Heart className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-4">Patient First</h3>
                            <p className="text-gray-600">
                                Your well-being is at the core of everything we do. Fast delivery and 24/7 support for your peace of mind.
                            </p>
                        </div>
                        <div className="p-8 rounded-2xl bg-white border border-gray-100 shadow-lg hover:shadow-xl transition-shadow text-center">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Users className="w-8 h-8 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-4">Community Focused</h3>
                            <p className="text-gray-600">
                                Building a network of local pharmacies to support small businesses while serving you better.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats/Story */}
            <div className="bg-gray-50 py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-8">Our Journey</h2>
                        <p className="text-lg text-gray-600 leading-relaxed mb-8">
                            Started in 2024, MedBlink was born from a simple idea: Healthcare should be accessible, instantaneous, and reliable. Today, we serve thousands of customers across the city, connecting them with the medicines they need, when they need them.
                        </p>
                        <Link to="/contact">
                            <button className="inline-flex items-center text-medical-teal-600 font-semibold hover:text-medical-teal-700">
                                Get in touch <ArrowRight className="ml-2 w-4 h-4" />
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}
