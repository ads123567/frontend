import { Pill, Baby, Activity, Stethoscope, Thermometer, HeartPulse, Dumbbell, Sparkles } from "lucide-react";

export const CATEGORIES = [
    { id: 1, name: "Medicines", icon: Pill, color: "bg-blue-100 text-blue-600" },
    { id: 2, name: "Baby Care", icon: Baby, color: "bg-pink-100 text-pink-600" },
    { id: 3, name: "Lab Tests", icon: Activity, color: "bg-purple-100 text-purple-600" },
    { id: 4, name: "Devices", icon: Stethoscope, color: "bg-teal-100 text-teal-600" },
    { id: 5, name: "Wellness", icon: HeartPulse, color: "bg-red-100 text-red-600" },
    { id: 6, name: "Ayurveda", icon: Sparkles, color: "bg-green-100 text-green-600" },
    { id: 7, name: "Fitness", icon: Dumbbell, color: "bg-orange-100 text-orange-600" },
    { id: 8, name: "First Aid", icon: Thermometer, color: "bg-yellow-100 text-yellow-600" },
];

export const BANNERS = [
    {
        id: 1,
        title: "Bulk Discount",
        desc: "Flat 15% OFF on orders above ₹5000",
        cta: "Order Now",
        bg: "bg-gradient-to-r from-teal-50 to-teal-100",
        icon: "📦"
    },
    {
        id: 2,
        title: "GST Invoice",
        desc: "Get input tax credit on all orders",
        cta: "Learn More",
        bg: "bg-gradient-to-r from-blue-50 to-blue-100",
        icon: "📄"
    },
    {
        id: 3,
        title: "Hospital Supply",
        desc: "Surgicals & Disposables",
        cta: "View Catalog",
        bg: "bg-gradient-to-r from-pink-50 to-pink-100",
        icon: "🏥"
    }
];

export const PRODUCT_SECTIONS = [
    {
        title: "Recommended for you",
        products: [
            { id: 101, name: "Dolo 650mg Tablet", category: "Fever", price: 30, oldPrice: 35, discount: "14% OFF", image: "https://placehold.co/200x200?text=Dolo+650" },
            { id: 102, name: "Vicks VapoRub 50g", category: "Cold & Cough", price: 145, oldPrice: 160, discount: "9% OFF", image: "https://placehold.co/200x200?text=Vicks" },
            { id: 103, name: "Digene Gel Mint 200ml", category: "Acidity", price: 120, oldPrice: 135, discount: "11% OFF", image: "https://placehold.co/200x200?text=Digene" },
            { id: 104, name: "Crocin Pain Relief", category: "Pain", price: 55, oldPrice: 60, discount: "8% OFF", image: "https://placehold.co/200x200?text=Crocin" },
        ]
    },
    {
        title: "Health Essentials under ₹299",
        products: [
            { id: 201, name: "Dettol Antiseptic Liquid", category: "First Aid", price: 180, oldPrice: 195, discount: "8% OFF", image: "https://placehold.co/200x200?text=Dettol" },
            { id: 202, name: "Cotton Roll 500g", category: "First Aid", price: 220, oldPrice: 250, discount: "12% OFF", image: "https://placehold.co/200x200?text=Cotton" },
            { id: 203, name: "Band-Aid (Pack of 10)", category: "First Aid", price: 45, oldPrice: 50, discount: "10% OFF", image: "https://placehold.co/200x200?text=Band-Aid" },
            { id: 204, name: "Hand Sanitizer 100ml", category: "Hygiene", price: 50, oldPrice: 60, discount: "16% OFF", image: "https://placehold.co/200x200?text=Sanitizer" },
        ]
    },
    {
        title: "Baby & Mother Care",
        products: [
            { id: 301, name: "Pampers Diapers (M)", category: "Baby Care", price: 899, oldPrice: 1099, discount: "18% OFF", image: "https://placehold.co/200x200?text=Pampers" },
            { id: 302, name: "Johnson's Baby Oil", category: "Baby Care", price: 250, oldPrice: 280, discount: "10% OFF", image: "https://placehold.co/200x200?text=Baby+Oil" },
            { id: 303, name: "Cerelac Wheat Apple", category: "Baby Food", price: 320, oldPrice: 340, discount: "6% OFF", image: "https://placehold.co/200x200?text=Cerelac" },
            { id: 304, name: "Himalaya Baby Wipes", category: "Hygiene", price: 180, oldPrice: 200, discount: "10% OFF", image: "https://placehold.co/200x200?text=Wipes" },
        ]
    }
];

export const TRUST_BADGES = [
    { id: 1, text: "100% Genuine Medicines", icon: "✅" },
    { id: 2, text: "Fast Delivery in 10 mins", icon: "⚡" },
    { id: 3, text: "Pharmacist Verified", icon: "👨‍⚕️" },
    { id: 4, text: "Secure Payments", icon: "🔒" },
];

export const FOOTER_LINKS = {
    useful: ["Blog", "FAQs", "Contact", "Support", "Security", "Refund Policy"],
    company: ["About Us", "Careers", "Partner with us", "Investor Relations"],
    categories: ["Medicines", "OTC & Wellness", "Baby Care", "Devices", "Ayurveda", "Fitness"]
};
