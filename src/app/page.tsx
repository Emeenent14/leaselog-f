'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  Check
} from 'lucide-react'
import { useState, useRef } from 'react'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const fadeInUp: any = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.8,
      ease: [0.2, 0.65, 0.3, 0.9],
    },
  }),
}

const letterAnim: any = {
  hidden: { y: "100%" },
  visible: (i: number) => ({
    y: 0,
    transition: {
      delay: i * 0.03,
      duration: 0.5,
      ease: [0.33, 1, 0.68, 1],
    },
  }),
}

export default function LandingPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuthStore()
  const [showPage, setShowPage] = useState(false)
  const containerRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"])

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
      <div className="min-h-screen flex items-center justify-center bg-[#FBF9F6]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1A1A1A]" />
      </div>
    )
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-[#FBF9F6] text-[#2D2D2D] selection:bg-[#2D2D2D] selection:text-[#FBF9F6] pt-20 overflow-hidden">

      {/* Hero Section - Split Layout with Staggered Type */}
      <section className="px-6 py-12 md:py-20 lg:py-32 min-h-[90vh] flex items-center">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-24 items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            custom={0}
            variants={fadeInUp}
          >
            <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl leading-[1.05] text-[#1A1A1A] mb-8 tracking-tighter overflow-hidden">
              <span className="block overflow-hidden">
                <motion.span variants={letterAnim} custom={0} className="block">Quietly powerful</motion.span>
              </span>
              <span className="block overflow-hidden italic text-[#6B6B6B]">
                <motion.span variants={letterAnim} custom={10} className="block">property management.</motion.span>
              </span>
            </h1>

            <motion.p
              variants={fadeInUp}
              custom={3}
              className="font-sans text-lg md:text-xl text-[#555555] leading-relaxed mb-10 max-w-lg"
            >
              LeaseLog brings clarity to your rental business. Track payments,
              manage tenants, and organize expenses—all in one place that feels like home.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              custom={4}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/register">
                <Button className="h-14 w-full sm:w-auto px-10 rounded-full bg-[#1A1A1A] hover:bg-black text-[#FBF9F6] font-sans text-xs tracking-widest uppercase font-semibold transition-transform hover:scale-105">
                  Try LeaseLog
                </Button>
              </Link>
              <Link href="/features">
                <Button variant="ghost" className="h-14 w-full sm:w-auto px-10 rounded-full hover:bg-[#E5E5E5] text-[#1A1A1A] font-sans text-xs tracking-widest font-semibold flex items-center justify-center gap-2 group">
                  How it works <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              custom={5}
              className="mt-12 flex items-center gap-6 text-[#666666] text-sm font-medium"
            >
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[#FBF9F6] bg-gray-200 overflow-hidden relative shadow-sm">
                    <Image
                      src={`https://images.unsplash.com/photo-${[
                        '1534528741775-53994a69daeb',
                        '1506794778202-cad84cf45f1d',
                        '1507003211169-0a1dd7228f2d',
                        '1438761681033-6461ffad8d80'
                      ][i - 1]}?w=100&h=100&fit=crop&crop=faces`}
                      alt="User"
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-1 items-center">
                <span className="text-[#1A1A1A] font-bold">2,000+</span>
                <span>landlords trust us</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Parallax Lifestyle Image */}
          <motion.div
            style={{ y }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.2, 0.65, 0.3, 0.9] }}
            className="relative aspect-[4/5] md:aspect-square rounded-2xl overflow-hidden shadow-2xl shadow-[#1A1A1A]/5"
          >
            <Image
              src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=2070&auto=format&fit=crop"
              alt="Modern living room interior"
              fill
              className="object-cover scale-110" // scale for subtle zoom
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent mix-blend-multiply" />
          </motion.div>
        </div>
      </section>

      {/* Intro Section - Human Connection */}
      <section className="py-32 px-6 bg-white border-t border-[#E5E5E5]/50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="font-serif text-3xl md:text-5xl text-[#1A1A1A] mb-8 leading-tight tracking-tight"
          >
            Software that feels as comfortable as your favorite chair.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-sans text-lg md:text-xl text-[#555555] leading-relaxed max-w-2xl mx-auto"
          >
            We believe property management shouldn't feel like a chore. That's why we designed LeaseLog to be inviting, simple, and calm. It's not just a tool; it's a better way to live your work.
          </motion.p>
        </div>
      </section>

      {/* Dashboard Preview - Floating Glass */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="rounded-3xl border border-[#E5E5E5] bg-[#FAFAFA] p-4 md:p-8 shadow-2xl shadow-black/5"
          >
            {/* Simple Abstract Interface Overlaying a Desk Image */}
            <div className="relative aspect-[16/9] w-full bg-[#FAFAFA] rounded-xl overflow-hidden border border-[#E5E5E5]">
              <Image
                src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop"
                alt="Office Desk"
                fill
                className="object-cover opacity-20 hover:scale-105 transition-transform duration-[20s]"
              />
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="bg-white/95 backdrop-blur-xl shadow-xl p-12 max-w-3xl w-full border border-white/50 rounded-2xl text-center space-y-8 hover:-translate-y-1 transition-transform duration-500">
                  <div className="font-serif text-3xl text-[#1A1A1A]">Good morning, Sarah</div>
                  <div className="grid grid-cols-3 gap-8 text-[#2D2D2D]">
                    <div className="p-6 bg-[#FBF9F6] rounded-xl border border-[#F0F0F0]">
                      <div className="text-[10px] uppercase tracking-widest text-[#666666] mb-2 font-bold">Properties</div>
                      <div className="text-4xl font-serif">12</div>
                    </div>
                    <div className="p-6 bg-[#FBF9F6] rounded-xl border border-[#F0F0F0]">
                      <div className="text-[10px] uppercase tracking-widest text-[#666666] mb-2 font-bold">Tenants</div>
                      <div className="text-4xl font-serif">24</div>
                    </div>
                    <div className="p-6 bg-[#FBF9F6] rounded-xl border border-[#F0F0F0]">
                      <div className="text-[10px] uppercase tracking-widest text-[#666666] mb-2 font-bold">Revenue</div>
                      <div className="text-4xl font-serif">$28k</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features - Bento Grid Style */}
      <section className="py-32 px-6 border-t border-[#E5E5E5] bg-[#FBF9F6]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20 items-start mb-20">
            <div>
              <h2 className="font-serif text-5xl text-[#1A1A1A] mb-8 leading-tight">
                Everything you need,<br />nothing you don't.
              </h2>
              <p className="font-sans text-lg text-[#555555] leading-relaxed max-w-md">
                We stripped away the clutter found in traditional software.
                What's left is a tool that feels as simple as pen and paper, but works like magic.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Tenant Tracking", desc: "A single source of truth for every lease.", icon: "📝" },
              { title: "Financial Reports", desc: "Tax-ready income statements in one click.", icon: "📊" },
              { title: "Automatic Alerts", desc: "Never miss a renewal or late payment.", icon: "🔔" },
              { title: "Document Storage", desc: "Keep all your contracts safe and sound.", icon: "🗂️" },
              { title: "Maintenance", desc: "Track repairs and vendor contacts easily.", icon: "🔧" },
              { title: "Mobile Ready", desc: "Manage your portfolio from anywhere.", icon: "📱" },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white p-8 rounded-2xl border border-[#E5E5E5]/60 hover:border-[#1A1A1A]/10 hover:shadow-lg hover:shadow-black/5 transition-all duration-300"
              >
                <div className="text-3xl mb-6">{feature.icon}</div>
                <h3 className="font-serif text-xl text-[#1A1A1A] mb-3 group-hover:text-black transition-colors">{feature.title}</h3>
                <p className="font-sans text-[#666666] text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-32 px-6 bg-white border-t border-[#E5E5E5]">
        <div className="max-w-5xl mx-auto text-center">
          <div className="mb-10 text-[#2D2D2D] opacity-20">
            <span className="text-6xl font-serif">“</span>
          </div>
          <h3 className="font-serif text-4xl md:text-6xl text-[#1A1A1A] leading-tight mb-16 tracking-tight">
            It used to take me hours to reconcile my books. With LeaseLog, I'm done in minutes. It's the calmest part of my month.
          </h3>
          <div className="flex flex-col items-center justify-center gap-6">
            <div className="w-20 h-20 rounded-full overflow-hidden relative border-4 border-[#FBF9F6] shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face"
                alt="Sarah Jenkins"
                fill
                className="object-cover"
              />
            </div>
            <div className="text-center">
              <div className="font-serif text-xl text-[#1A1A1A] font-bold mb-1">Sarah Jenkins</div>
              <div className="font-sans text-xs tracking-widest uppercase text-[#666666]">Owner, 12 Units</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing - Clean Cards */}
      <section className="py-32 px-6 bg-[#FBF9F6] border-t border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Starter", price: "$9", units: "Up to 5 units" },
              { name: "Pro", price: "$29", units: "Up to 25 units", active: true },
              { name: "Business", price: "$79", units: "Unlimited units" },
            ].map((plan, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -8 }}
                className={`flex flex-col justify-between p-10 rounded-2xl border transition-all duration-300 ${plan.active ? 'bg-[#1A1A1A] text-[#FBF9F6] border-[#1A1A1A] shadow-2xl shadow-[#1A1A1A]/20' : 'bg-white text-[#1A1A1A] border-[#E5E5E5] hover:border-[#1A1A1A]/20'}`}
              >
                <div>
                  <h4 className={`font-serif text-2xl mb-2 ${plan.active ? 'text-white' : 'text-[#1A1A1A]'}`}>{plan.name}</h4>
                  <div className={`font-sans text-sm mb-10 ${plan.active ? 'text-gray-400' : 'text-[#666666]'}`}>{plan.units}</div>
                  <div className="font-serif text-6xl mb-10 tracking-tighter">{plan.price}<span className={`text-lg font-sans ${plan.active ? 'text-gray-500' : 'text-gray-400'}`}>/mo</span></div>
                  <ul className="space-y-4">
                    {["Tenant Portal", "Expense Tracking", "Lease Alerts"].map((f, j) => (
                      <li key={j} className={`flex items-center gap-3 text-sm ${plan.active ? 'text-gray-300' : 'text-[#444444]'}`}>
                        <Check className={`h-4 w-4 ${plan.active ? 'text-white' : 'text-[#1A1A1A]'}`} /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href="/register" className="mt-12">
                  <Button variant={plan.active ? 'secondary' : 'outline'} className={`w-full h-12 rounded-full tracking-wide text-xs uppercase font-bold transition-transform active:scale-95 ${plan.active ? 'bg-white text-black hover:bg-gray-200' : 'border-[#E5E5E5] hover:bg-[#1A1A1A] hover:text-white'}`}>
                    Choose {plan.name}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
