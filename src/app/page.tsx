'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import { Spotlight } from '@/components/ui/spotlight'
import { FlipWords } from '@/components/ui/flip-words'
import { InfiniteMovingCards } from '@/components/ui/infinite-moving-cards'
import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card'
import { FAQ } from '@/components/ui/faq'
import {
  Building2,
  Users,
  FileText,
  DollarSign,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Bell,
  Receipt,
  TrendingUp,
} from 'lucide-react'

const testimonials = [
  {
    quote: "I used to spend hours every month tracking rent payments in Excel. Now it takes me 5 minutes. LeaseLog paid for itself the first month.",
    name: "David R.",
    title: "12 units in Chicago",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  },
  {
    quote: "The lease expiration alerts alone are worth it. I almost lost a great tenant because I forgot to start the renewal conversation. Never again.",
    name: "Sarah M.",
    title: "6 units in Austin",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
  },
  {
    quote: "Tax time used to be a nightmare. Now I just export my income and expenses report and hand it to my accountant. Done in 10 minutes.",
    name: "Michael T.",
    title: "8 units in Denver",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  },
  {
    quote: "Finally, a property management tool that doesn't require a PhD to use. Simple, clean, and does exactly what I need.",
    name: "Jennifer K.",
    title: "15 units in Seattle",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
  },
  {
    quote: "I manage properties across three states. LeaseLog keeps everything organized in one place. Can't imagine going back to spreadsheets.",
    name: "Robert L.",
    title: "22 units across TX, OK, AR",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
  },
]

const faqItems = [
  {
    question: "How long is the free trial?",
    answer: "You get 14 days to try LeaseLog completely free. No credit card required to start. You'll have full access to all features during the trial period.",
  },
  {
    question: "Can I import my existing data?",
    answer: "Yes! You can import properties, tenants, and lease information from spreadsheets (CSV/Excel). We also offer free migration assistance for larger portfolios.",
  },
  {
    question: "Is my data secure?",
    answer: "Absolutely. We use bank-level 256-bit SSL encryption, and your data is stored on secure AWS servers with daily backups. We never share or sell your information.",
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes, you can cancel your subscription at any time. No long-term contracts, no cancellation fees. Your data remains accessible for 30 days after cancellation.",
  },
  {
    question: "Do you offer support?",
    answer: "Yes! All plans include email support. Pro and Business plans include priority support with faster response times. We also have extensive documentation and video tutorials.",
  },
  {
    question: "Can multiple people access my account?",
    answer: "The Business plan includes multi-user access, allowing you to add team members with different permission levels. Starter and Pro plans are single-user.",
  },
]

const features = [
  {
    icon: Building2,
    title: "Properties & Units",
    description: "Add single-family homes, duplexes, or apartment buildings. Track each unit separately.",
    color: "bg-blue-500",
  },
  {
    icon: Users,
    title: "Tenant Records",
    description: "Store contact info, lease terms, payment history, and notes all in one place.",
    color: "bg-green-500",
  },
  {
    icon: FileText,
    title: "Lease Management",
    description: "Track dates, rent amounts, and terms. Get alerts before leases expire.",
    color: "bg-amber-500",
  },
  {
    icon: DollarSign,
    title: "Rent Tracking",
    description: "See who's paid, who's late, and who owes what. Automatic late fee calculations.",
    color: "bg-blue-500",
  },
  {
    icon: Receipt,
    title: "Expense Logging",
    description: "Log repairs, maintenance, taxes, and insurance. Categorize by property.",
    color: "bg-red-500",
  },
  {
    icon: BarChart3,
    title: "Financial Reports",
    description: "Income statements, expense breakdowns, and profit/loss. Export to PDF or CSV.",
    color: "bg-green-500",
  },
]

export default function LandingPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuthStore()
  const [showPage, setShowPage] = useState(false)

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.push('/dashboard')
      } else {
        setShowPage(true)
      }
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading || !showPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  const flipWords = ["spreadsheets", "sticky notes", "mental math", "chaos"]

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

      {/* Hero Section with Spotlight */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gray-950">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-gray-800 text-gray-300 text-sm font-medium px-4 py-2 rounded-full mb-8"
            >
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              Built for landlords who self-manage
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white tracking-tight leading-tight"
            >
              Stop chasing rent.
              <span className="block text-blue-400 mt-2">Start tracking it.</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 text-xl text-gray-400"
            >
              <span>LeaseLog replaces your </span>
              <FlipWords words={flipWords} className="text-blue-400" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto"
            >
              Track every property, tenant, and payment in one place.
              Know exactly who owes what, when leases expire, and where your money goes.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto text-base px-8 bg-blue-600 hover:bg-blue-700">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/features">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-8 border-gray-700 text-gray-300 hover:bg-gray-800">
                  See Features
                </Button>
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-4 text-sm text-gray-600"
            >
              No credit card required. Set up in 5 minutes.
            </motion.p>
          </div>
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </section>

      {/* Property Types with 3D Cards */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Manage any type of rental property
            </h2>
            <p className="mt-4 text-lg text-gray-600">From single-family homes to apartment buildings</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <CardContainer className="py-6">
              <CardBody className="bg-gray-50 relative group/card border-gray-200 w-auto h-auto rounded-xl p-6 border">
                <CardItem translateZ="50" className="text-xl font-bold text-gray-900">
                  Single-Family Homes
                </CardItem>
                <CardItem as="p" translateZ="60" className="text-gray-500 text-sm max-w-sm mt-2">
                  Track one property or twenty. Perfect for individual landlords.
                </CardItem>
                <CardItem translateZ="100" className="w-full mt-4">
                  <Image
                    src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop"
                    height={400}
                    width={600}
                    className="h-48 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                    alt="Single family home"
                  />
                </CardItem>
              </CardBody>
            </CardContainer>

            <CardContainer className="py-6">
              <CardBody className="bg-gray-50 relative group/card border-gray-200 w-auto h-auto rounded-xl p-6 border">
                <CardItem translateZ="50" className="text-xl font-bold text-gray-900">
                  Duplexes & Triplexes
                </CardItem>
                <CardItem as="p" translateZ="60" className="text-gray-500 text-sm max-w-sm mt-2">
                  Separate units, one dashboard. Track each unit independently.
                </CardItem>
                <CardItem translateZ="100" className="w-full mt-4">
                  <Image
                    src="https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=600&h=400&fit=crop"
                    height={400}
                    width={600}
                    className="h-48 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                    alt="Duplex"
                  />
                </CardItem>
              </CardBody>
            </CardContainer>

            <CardContainer className="py-6">
              <CardBody className="bg-gray-50 relative group/card border-gray-200 w-auto h-auto rounded-xl p-6 border">
                <CardItem translateZ="50" className="text-xl font-bold text-gray-900">
                  Apartment Buildings
                </CardItem>
                <CardItem as="p" translateZ="60" className="text-gray-500 text-sm max-w-sm mt-2">
                  Scale to any portfolio size. Built to grow with you.
                </CardItem>
                <CardItem translateZ="100" className="w-full mt-4">
                  <Image
                    src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop"
                    height={400}
                    width={600}
                    className="h-48 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                    alt="Apartment building"
                  />
                </CardItem>
              </CardBody>
            </CardContainer>
          </div>
        </div>
      </section>

      {/* Features Section - Clean Grid */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Everything in one place
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              No more juggling spreadsheets, apps, and paper trails.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all"
              >
                <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-6`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/features">
              <Button variant="outline" size="lg">
                View All Features
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Your dashboard shows what matters
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Open LeaseLog and immediately see who's late on rent, which leases
                are expiring, and how your properties are performing.
              </p>

              <div className="mt-10 space-y-6">
                {[
                  { icon: TrendingUp, title: "Collection rate at a glance", desc: "See what percentage of rent you've collected this month" },
                  { icon: Bell, title: "Alerts that matter", desc: "Late payments, expiring leases, and overdue tasks front and center" },
                  { icon: BarChart3, title: "Income vs expenses", desc: "Monthly breakdown of cash flow across all properties" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{item.title}</div>
                      <div className="text-gray-600">{item.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Mock Dashboard */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gray-900 rounded-2xl p-6 shadow-2xl"
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-800 rounded-lg">
                  <div>
                    <div className="text-gray-400 text-sm">December 2025</div>
                    <div className="text-2xl font-bold text-white">$12,450</div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-400 text-sm">Outstanding</div>
                    <div className="text-xl font-semibold text-red-400">$2,100</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-gray-300">Unit 2A - Johnson</span>
                  </div>
                  <span className="text-green-400 text-sm">Paid</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-gray-300">Unit 3B - Martinez</span>
                  </div>
                  <span className="text-green-400 text-sm">Paid</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-gray-300">Unit 1C - Williams</span>
                  </div>
                  <span className="text-red-400 text-sm">5 days late</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    <span className="text-gray-300">Unit 4D - Chen</span>
                  </div>
                  <span className="text-yellow-400 text-sm">Due today</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Trusted by landlords everywhere
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Join thousands of property owners who simplified their management
            </p>
          </div>

          <InfiniteMovingCards
            items={testimonials}
            direction="right"
            speed="slow"
          />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Frequently asked questions
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Everything you need to know about LeaseLog
            </p>
          </div>

          <FAQ items={faqItems} />

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <Link href="/faq">
              <Button variant="outline">
                View All FAQs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Simple pricing
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Pay based on how many properties you manage. That's it.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { name: "Starter", price: 9, properties: "5", featured: false },
              { name: "Pro", price: 29, properties: "25", featured: true },
              { name: "Business", price: 79, properties: "Unlimited", featured: false },
            ].map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
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
                <div className="text-lg font-medium">{plan.name}</div>
                <div className="mt-4">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className={plan.featured ? "text-gray-400" : "text-gray-600"}>/mo</span>
                </div>
                <div className={`text-sm mt-2 ${plan.featured ? "text-gray-400" : "text-gray-600"}`}>
                  Up to {plan.properties} properties
                </div>
                <ul className="mt-8 space-y-4">
                  {["Unlimited tenants", "Rent & expense tracking", "Lease alerts", "Reports"].map((feature, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className={`h-5 w-5 ${plan.featured ? "text-blue-400" : "text-green-500"}`} />
                      <span className={plan.featured ? "text-gray-300" : "text-gray-600"}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/register" className="block mt-8">
                  <Button
                    className={`w-full ${
                      plan.featured
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-gray-900 hover:bg-gray-800"
                    }`}
                  >
                    Get Started
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-500 mb-4">All plans include a 14-day free trial. No credit card required.</p>
            <Link href="/pricing">
              <Button variant="outline">
                Compare All Plans
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gray-950 relative overflow-hidden">
        <Spotlight className="-top-40 -left-20" fill="rgba(59, 130, 246, 0.3)" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-white"
          >
            Stop managing properties in your head
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="mt-4 text-lg text-gray-400"
          >
            LeaseLog keeps track so you don't have to. Start your free trial today.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-8"
          >
            <Link href="/register">
              <Button size="lg" className="text-base px-8 bg-white text-gray-900 hover:bg-gray-100">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="h-6 w-6 text-gray-400" />
                <span className="text-lg font-semibold text-gray-400">LeaseLog</span>
              </div>
              <p className="text-sm text-gray-500">
                Property management made simple for landlords who self-manage.
              </p>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-300 mb-4">Product</div>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link href="/features" className="hover:text-gray-300 transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-gray-300 transition-colors">Pricing</Link></li>
                <li><Link href="/faq" className="hover:text-gray-300 transition-colors">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-300 mb-4">Company</div>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#" className="hover:text-gray-300 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-gray-300 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-gray-300 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-300 mb-4">Legal</div>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#" className="hover:text-gray-300 transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-gray-300 transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} LeaseLog. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
