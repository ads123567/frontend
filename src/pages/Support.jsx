import { HelpCircle, Phone, Mail, FileQuestion } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Footer } from '../components/Footer'

export default function Support() {
    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Header */}
            <div className="bg-medical-teal-600 py-16 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold mb-4">How can we help you?</h1>
                    <p className="text-medical-teal-100 text-lg">Search our help center or reach out to our support team.</p>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="py-16 container mx-auto px-4 max-w-3xl">
                <div className="flex items-center gap-3 mb-8">
                    <HelpCircle className="w-6 h-6 text-medical-teal-600" />
                    <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
                </div>

                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>How do I track my order?</AccordionTrigger>
                        <AccordionContent>
                            You can track your order status in real-time from the 'Orders' section in your profile. We also send SMS updates at every step.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>What is the return policy?</AccordionTrigger>
                        <AccordionContent>
                            We accept returns for damaged or incorrect medicines within 2 days of delivery. Please ensure the packaging is intact.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>Do you deliver 24/7?</AccordionTrigger>
                        <AccordionContent>
                            Our standard delivery hours are 8 AM to 11 PM. However, emergency services are available in select pincodes 24/7.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                        <AccordionTrigger>Can I upload a prescription online?</AccordionTrigger>
                        <AccordionContent>
                            Yes! You can upload your doctor's prescription directly through the app before checkout for verification.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>

            {/* Contact Cards */}
            <div className="bg-gray-50 py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold text-center mb-12">Still need help?</h2>
                    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4">
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <Phone className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-1">Call Support</h3>
                                <p className="text-gray-500 text-sm mb-3">Speak directly to our customer care executives.</p>
                                <a href="tel:+1800123456" className="text-blue-600 font-medium hover:underline">+91 1800-123-456</a>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4">
                            <div className="p-3 bg-green-50 rounded-lg">
                                <Mail className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-1">Email Us</h3>
                                <p className="text-gray-500 text-sm mb-3">Send us your query and we'll respond within 24 hours.</p>
                                <a href="mailto:support@medblink.com" className="text-green-600 font-medium hover:underline">support@medblink.com</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}
