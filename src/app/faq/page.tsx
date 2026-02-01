'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const faqs = [
  {
    question: "Is LeaseLog secure?",
    answer: "Yes. We use bank-level 256-bit encryption to protect all your data. Your financial information is never shared with third parties."
  },
  {
    question: "Can I manage multiple properties?",
    answer: "Absolutely. LeaseLog is designed to scale from a single unit to hundreds. Our dashboard gives you a unified view of your entire portfolio."
  },
  {
    question: "Do you support online rent collection?",
    answer: "Yes, currently in beta for US-based landlords. We partner with Stripe to process payments securely and deposit them directly into your bank account."
  },
  {
    question: "Is there a free trial?",
    answer: "We offer a 14-day free trial on all plans. No credit card required to start."
  },
  {
    question: "How do I export my data for taxes?",
    answer: "Generating a Schedule E-ready report takes just one click from the 'Reports' tab. You can export as PDF or CSV."
  }
]

export default function FAQPage() {
  return (
    <div className="min-h-screen pt-20 pb-32">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <h1 className="font-serif text-5xl text-[#1A1A1A] mb-8 text-center">Frequently Asked Questions</h1>
        <p className="font-sans text-xl text-[#555555] mb-16 text-center">
          Everything you need to know about LeaseLog.
        </p>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border border-[#E5E5E5] bg-white px-6">
              <AccordionTrigger className="font-serif text-lg text-[#1A1A1A] hover:no-underline py-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="font-sans text-[#555555] text-base pb-6 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}
