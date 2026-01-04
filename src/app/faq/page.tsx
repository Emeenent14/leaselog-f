'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Spotlight } from '@/components/ui/spotlight'
import { FAQ } from '@/components/ui/faq'
import {
  Building2,
  ArrowRight,
} from 'lucide-react'

const faqCategories = [
  {
    title: "Getting Started",
    items: [
      {
        question: "How long is the free trial?",
        answer: "You get 14 days to try LeaseLog completely free. No credit card required to start. You'll have full access to all features during the trial period.",
      },
      {
        question: "How do I get started?",
        answer: "Simply click 'Start Free Trial', create your account, and you're ready to go. You can add your first property in under 2 minutes. We also have video tutorials to help you get the most out of LeaseLog.",
      },
      {
        question: "Can I import my existing data?",
        answer: "Yes! You can import properties, tenants, and lease information from spreadsheets (CSV/Excel). We also offer free migration assistance for larger portfolios.",
      },
      {
        question: "Do I need to install anything?",
        answer: "No! LeaseLog is completely web-based. Access it from any device with a web browser - desktop, laptop, tablet, or phone. Your data syncs automatically across all devices.",
      },
    ],
  },
  {
    title: "Pricing & Billing",
    items: [
      {
        question: "How does pricing work?",
        answer: "We charge a flat monthly fee based on the number of properties you manage. Starter ($9/mo) covers up to 5 properties, Pro ($29/mo) up to 25 properties, and Business ($79/mo) is unlimited.",
      },
      {
        question: "Can I change plans later?",
        answer: "Yes, you can upgrade or downgrade your plan at any time. If you upgrade, you'll be prorated for the remainder of the billing period. If you downgrade, the change takes effect at the next billing cycle.",
      },
      {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards (Visa, MasterCard, American Express, Discover) and can also accommodate ACH payments for annual Business plans.",
      },
      {
        question: "Can I cancel anytime?",
        answer: "Yes, you can cancel your subscription at any time. No long-term contracts, no cancellation fees. Your data remains accessible for 30 days after cancellation.",
      },
      {
        question: "Do you offer annual billing?",
        answer: "Yes! Pay annually and get 2 months free. That's $90/year for Starter (save $18), $290/year for Pro (save $58), and $790/year for Business (save $158).",
      },
    ],
  },
  {
    title: "Features & Functionality",
    items: [
      {
        question: "Can I track multiple properties?",
        answer: "Absolutely. LeaseLog is designed for landlords with multiple properties. Track single-family homes, duplexes, apartments, or commercial properties all in one place.",
      },
      {
        question: "Does LeaseLog handle rent collection?",
        answer: "LeaseLog tracks rent payments and calculates late fees, but we don't process payments directly. You can record payments as they come in via your existing methods (checks, Venmo, Zelle, etc.).",
      },
      {
        question: "Can I send rent reminders to tenants?",
        answer: "Yes! The Pro and Business plans include automated rent reminders. You can customize when reminders are sent and what they say.",
      },
      {
        question: "What reports can I generate?",
        answer: "Income statements, expense reports, profit/loss by property, rent roll, vacancy reports, and more. All reports can be exported to PDF or CSV.",
      },
      {
        question: "Can tenants access their information?",
        answer: "Yes, with the tenant portal feature (Pro and Business plans), tenants can view their lease details, payment history, and submit maintenance requests.",
      },
    ],
  },
  {
    title: "Security & Privacy",
    items: [
      {
        question: "Is my data secure?",
        answer: "Absolutely. We use bank-level 256-bit SSL encryption, and your data is stored on secure AWS servers with daily backups. We never share or sell your information.",
      },
      {
        question: "Who can access my data?",
        answer: "Only you and any team members you explicitly add (Business plan). Our support team can only access your data with your permission when helping resolve issues.",
      },
      {
        question: "What happens to my data if I cancel?",
        answer: "Your data remains accessible for 30 days after cancellation, giving you time to export anything you need. After 30 days, your data is permanently deleted from our servers.",
      },
      {
        question: "Do you backup my data?",
        answer: "Yes, we perform daily backups of all data. Backups are stored securely and can be used to restore your account if needed.",
      },
    ],
  },
  {
    title: "Support",
    items: [
      {
        question: "How do I get help?",
        answer: "All plans include email support. Pro and Business plans include priority support with faster response times. We typically respond within 24 hours (often much faster).",
      },
      {
        question: "Do you offer phone support?",
        answer: "Business plan customers have access to scheduled phone support. For all other plans, we provide email support and comprehensive documentation.",
      },
      {
        question: "Is there documentation or tutorials?",
        answer: "Yes! We have extensive documentation, video tutorials, and a knowledge base covering everything from getting started to advanced features.",
      },
      {
        question: "Can you help migrate my existing data?",
        answer: "Yes! We offer free migration assistance for all customers. Just send us your spreadsheets and we'll help get your data into LeaseLog.",
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">LeaseLog</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/features" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
                Features
              </Link>
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
                Pricing
              </Link>
              <Link href="/faq" className="text-blue-600 text-sm font-medium">
                FAQ
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button>Start Free</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative py-24 overflow-hidden bg-gray-950">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl font-bold text-white"
            >
              Frequently Asked Questions
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6 text-xl text-gray-400"
            >
              Everything you need to know about LeaseLog.
              Can't find what you're looking for? Contact our support team.
            </motion.p>
          </div>
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </section>

      {/* FAQ Sections */}
      {faqCategories.map((category, categoryIndex) => (
        <section
          key={category.title}
          className={`py-16 ${categoryIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
        >
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl font-bold text-gray-900 mb-8"
            >
              {category.title}
            </motion.h2>
            <FAQ items={category.items} />
          </div>
        </section>
      ))}

      {/* Contact CTA */}
      <section className="py-24 bg-gray-950 relative overflow-hidden">
        <Spotlight className="-top-40 -left-20" fill="rgba(59, 130, 246, 0.3)" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl font-bold text-white">
            Still have questions?
          </h2>
          <p className="mt-4 text-lg text-gray-400">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="text-base px-8 bg-white text-gray-900 hover:bg-gray-100">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-base px-8 border-gray-700 text-gray-300 hover:bg-gray-800">
              Contact Support
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-gray-400" />
              <span className="text-lg font-semibold text-gray-400">LeaseLog</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <Link href="/features" className="hover:text-gray-300 transition-colors">Features</Link>
              <Link href="/pricing" className="hover:text-gray-300 transition-colors">Pricing</Link>
              <Link href="/faq" className="hover:text-gray-300 transition-colors">FAQ</Link>
            </div>
            <div className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} LeaseLog
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
