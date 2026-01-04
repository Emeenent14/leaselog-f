'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Spotlight } from '@/components/ui/spotlight'
import {
  Building2,
  CheckCircle2,
  ArrowRight,
  X,
} from 'lucide-react'

const plans = [
  {
    name: "Starter",
    price: 9,
    description: "Perfect for landlords just getting started",
    properties: "Up to 5 properties",
    featured: false,
    features: [
      { name: "Property & unit management", included: true },
      { name: "Unlimited tenants", included: true },
      { name: "Lease tracking", included: true },
      { name: "Rent payment tracking", included: true },
      { name: "Expense logging", included: true },
      { name: "Late fee calculations", included: true },
      { name: "Basic reports", included: true },
      { name: "Email support", included: true },
      { name: "Document storage", included: false },
      { name: "Advanced reports", included: false },
      { name: "Export to PDF/CSV", included: false },
      { name: "Multi-user access", included: false },
      { name: "API access", included: false },
      { name: "Priority support", included: false },
    ],
  },
  {
    name: "Pro",
    price: 29,
    description: "For growing portfolios that need more power",
    properties: "Up to 25 properties",
    featured: true,
    features: [
      { name: "Property & unit management", included: true },
      { name: "Unlimited tenants", included: true },
      { name: "Lease tracking", included: true },
      { name: "Rent payment tracking", included: true },
      { name: "Expense logging", included: true },
      { name: "Late fee calculations", included: true },
      { name: "Basic reports", included: true },
      { name: "Email support", included: true },
      { name: "Document storage", included: true },
      { name: "Advanced reports", included: true },
      { name: "Export to PDF/CSV", included: true },
      { name: "Multi-user access", included: false },
      { name: "API access", included: false },
      { name: "Priority support", included: true },
    ],
  },
  {
    name: "Business",
    price: 79,
    description: "For property managers with large portfolios",
    properties: "Unlimited properties",
    featured: false,
    features: [
      { name: "Property & unit management", included: true },
      { name: "Unlimited tenants", included: true },
      { name: "Lease tracking", included: true },
      { name: "Rent payment tracking", included: true },
      { name: "Expense logging", included: true },
      { name: "Late fee calculations", included: true },
      { name: "Basic reports", included: true },
      { name: "Email support", included: true },
      { name: "Document storage", included: true },
      { name: "Advanced reports", included: true },
      { name: "Export to PDF/CSV", included: true },
      { name: "Multi-user access", included: true },
      { name: "API access", included: true },
      { name: "Priority support", included: true },
    ],
  },
]

export default function PricingPage() {
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
              <Link href="/pricing" className="text-blue-600 text-sm font-medium">
                Pricing
              </Link>
              <Link href="/faq" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
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
              Simple, transparent pricing
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6 text-xl text-gray-400"
            >
              Pay based on how many properties you manage. No hidden fees, no surprises.
              All plans include a 14-day free trial.
            </motion.p>
          </div>
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </section>

      {/* Pricing Cards */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-2xl p-8 ${
                  plan.featured
                    ? "bg-gray-900 text-white ring-2 ring-blue-500"
                    : "bg-white border border-gray-200"
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-blue-600 text-white text-sm font-medium px-4 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-xl font-semibold">{plan.name}</div>
                <div className={`text-sm mt-1 ${plan.featured ? 'text-gray-400' : 'text-gray-600'}`}>
                  {plan.description}
                </div>

                <div className="mt-6">
                  <span className="text-5xl font-bold">${plan.price}</span>
                  <span className={plan.featured ? 'text-gray-400' : 'text-gray-600'}>/month</span>
                </div>

                <div className={`text-sm mt-2 ${plan.featured ? 'text-gray-400' : 'text-gray-600'}`}>
                  {plan.properties}
                </div>

                <Link href="/register" className="block mt-8">
                  <Button
                    size="lg"
                    className={`w-full ${
                      plan.featured
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-gray-900 hover:bg-gray-800"
                    }`}
                  >
                    Start Free Trial
                  </Button>
                </Link>

                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <div className={`text-sm font-medium mb-4 ${plan.featured ? 'text-white' : 'text-gray-900'}`}>
                    What's included:
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature.name} className="flex items-center gap-3 text-sm">
                        {feature.included ? (
                          <CheckCircle2 className={`h-5 w-5 flex-shrink-0 ${plan.featured ? 'text-blue-400' : 'text-green-500'}`} />
                        ) : (
                          <X className="h-5 w-5 flex-shrink-0 text-gray-400" />
                        )}
                        <span className={feature.included
                          ? (plan.featured ? 'text-gray-300' : 'text-gray-600')
                          : 'text-gray-400'
                        }>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-gray-600 mb-2">All plans include a 14-day free trial. No credit card required.</p>
            <p className="text-gray-500 text-sm">Cancel anytime. No long-term contracts.</p>
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Questions about pricing?</h2>
          <p className="mt-4 text-lg text-gray-600">
            Check out our FAQ for answers to common questions about billing, features, and more.
          </p>
          <div className="mt-8">
            <Link href="/faq">
              <Button variant="outline" size="lg">
                View FAQ
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
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
