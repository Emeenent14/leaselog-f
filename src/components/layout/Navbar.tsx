'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Building2 } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

export function Navbar() {
    const pathname = usePathname()
    const isAuthPage = pathname?.startsWith('/login') || pathname?.startsWith('/register')

    if (isAuthPage) return null

    return (
        <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-6">
            <motion.nav
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="bg-white/80 backdrop-blur-md border border-[#E5E5E5]/50 rounded-full px-6 h-14 flex items-center shadow-sm shadow-[#000000]/5 max-w-5xl w-full justify-between"
            >
                <Link href="/" className="font-serif text-lg font-bold tracking-tight flex items-center gap-2 text-[#1A1A1A]">
                    <Building2 className="h-5 w-5" />
                    LeaseLog
                </Link>
                <div className="hidden md:flex items-center gap-6 text-sm font-medium text-[#555555]">
                    <Link href="/about" className="hover:text-[#1A1A1A] transition-colors">About</Link>
                    <Link href="/features" className="hover:text-[#1A1A1A] transition-colors">Features</Link>
                    <Link href="/pricing" className="hover:text-[#1A1A1A] transition-colors">Pricing</Link>
                    <Link href="/faq" className="hover:text-[#1A1A1A] transition-colors">FAQ</Link>
                    <Link href="/contact" className="hover:text-[#1A1A1A] transition-colors">Contact</Link>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/login" className="text-sm font-medium text-[#555555] hover:text-[#1A1A1A] transition-colors hidden sm:block">Log in</Link>
                    <Link href="/register">
                        <Button className="rounded-full bg-[#1A1A1A] hover:bg-[#000000] text-white transition-all hover:scale-105 h-9 px-5 text-xs tracking-wide uppercase font-semibold">
                            Start Trial
                        </Button>
                    </Link>
                </div>
            </motion.nav>
        </div>
    )
}
