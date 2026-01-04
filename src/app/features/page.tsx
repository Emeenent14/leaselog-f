'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Spotlight } from '@/components/ui/spotlight'
import {
  Building2,
  Users,
  FileText,
  DollarSign,
  BarChart3,
  ArrowRight,
  Bell,
  Receipt,
  Calendar,
  Shield,
  Zap,
  Download,
  CheckCircle2,
  Clock,
  PieChart,
  FolderOpen,
  Mail,
  Calculator,
} from 'lucide-react'

const allFeatures = [
  {
    category: "Property Management",
    items: [
      {
        icon: Building2,
        title: "Multi-Property Support",
        description: "Manage single-family homes, duplexes, apartments, and commercial properties all in one place. Each property can have multiple units with individual tracking.",
      },
      {
        icon: FolderOpen,
        title: "Unit Management",
        description: "Track each unit separately with its own rent amount, tenant, lease terms, and maintenance history. Perfect for multi-unit buildings.",
      },
      {
        icon: Calendar,
        title: "Vacancy Tracking",
        description: "Monitor vacant units, track days on market, and plan for turnovers. Never lose track of empty units again.",
      },
    ],
  },
  {
    category: "Tenant Management",
    items: [
      {
        icon: Users,
        title: "Tenant Profiles",
        description: "Store all tenant information in one place: contact details, emergency contacts, employment info, and rental history.",
      },
      {
        icon: Mail,
        title: "Tenant Portal",
        description: "Give tenants a portal to view their lease, payment history, and submit maintenance requests. Reduce back-and-forth communication.",
      },
      {
        icon: FileText,
        title: "Document Storage",
        description: "Store leases, applications, ID copies, and other important documents securely. Access them anytime from anywhere.",
      },
    ],
  },
  {
    category: "Lease Management",
    items: [
      {
        icon: FileText,
        title: "Lease Tracking",
        description: "Track lease start dates, end dates, rent amounts, security deposits, and special terms. All your lease details in one view.",
      },
      {
        icon: Bell,
        title: "Expiration Alerts",
        description: "Get notified 30, 60, or 90 days before a lease expires. Never miss a renewal opportunity again.",
      },
      {
        icon: Clock,
        title: "Renewal Management",
        description: "Track renewal status, proposed rent increases, and tenant decisions. Streamline your renewal process.",
      },
    ],
  },
  {
    category: "Financial Tracking",
    items: [
      {
        icon: DollarSign,
        title: "Rent Collection",
        description: "Record rent payments as they come in. See payment status for all units at a glance. Track partial payments and balances.",
      },
      {
        icon: Calculator,
        title: "Late Fee Automation",
        description: "Automatically calculate late fees based on your rules. Track grace periods and fee amounts per property.",
      },
      {
        icon: Receipt,
        title: "Expense Tracking",
        description: "Log repairs, maintenance, property taxes, insurance, utilities, and more. Categorize by property for easy reporting.",
      },
      {
        icon: PieChart,
        title: "Income & Expenses",
        description: "See your total income and expenses across all properties. Understand your cash flow at a glance.",
      },
    ],
  },
  {
    category: "Reporting & Analytics",
    items: [
      {
        icon: BarChart3,
        title: "Financial Reports",
        description: "Generate income statements, expense reports, and profit/loss statements by property, month, quarter, or year.",
      },
      {
        icon: Download,
        title: "Export Options",
        description: "Export reports to PDF or CSV for your accountant, tax preparation, or your own records.",
      },
      {
        icon: PieChart,
        title: "Portfolio Analytics",
        description: "See collection rates, occupancy rates, and performance metrics across your entire portfolio.",
      },
    ],
  },
  {
    category: "Security & Access",
    items: [
      {
        icon: Shield,
        title: "Bank-Level Security",
        description: "256-bit SSL encryption protects your data in transit. Your information is stored on secure AWS servers with daily backups.",
      },
      {
        icon: Users,
        title: "Multi-User Access",
        description: "Add team members with different permission levels (Business plan). Control who can view, edit, or manage your properties.",
      },
      {
        icon: Zap,
        title: "Fast & Reliable",
        description: "99.9% uptime guarantee. Access your data anytime, from any device. Works on desktop, tablet, and mobile.",
      },
    ],
  },
]

export default function FeaturesPage() {
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
              <Link href="/features" className="text-blue-600 text-sm font-medium">
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
              Everything you need to manage properties
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6 text-xl text-gray-400"
            >
              Powerful features designed specifically for self-managing landlords.
              No complexity, no learning curve.
            </motion.p>
          </div>
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </section>

      {/* Features by Category */}
      {allFeatures.map((category, categoryIndex) => (
        <section
          key={category.category}
          className={`py-24 ${categoryIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-gray-900 mb-12"
            >
              {category.category}
            </motion.h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {category.items.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all"
                >
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-6">
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
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="py-24 bg-gray-950 relative overflow-hidden">
        <Spotlight className="-top-40 -left-20" fill="rgba(59, 130, 246, 0.3)" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Ready to simplify your property management?
          </h2>
          <p className="mt-4 text-lg text-gray-400">
            Start your 14-day free trial today. No credit card required.
          </p>
          <div className="mt-8">
            <Link href="/register">
              <Button size="lg" className="text-base px-8 bg-white text-gray-900 hover:bg-gray-100">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
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
