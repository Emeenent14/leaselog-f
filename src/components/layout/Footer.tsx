import Link from 'next/link'
import { Building2 } from 'lucide-react'

export function Footer() {
    return (
        <footer className="py-20 px-6 bg-[#FBF9F6] border-t border-[#E5E5E5]">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div className="flex items-center gap-2 font-serif font-bold text-lg text-[#1A1A1A]">
                    <Building2 className="h-5 w-5" /> LeaseLog
                </div>
                <div className="flex gap-8 text-sm font-sans text-[#666666]">
                    <Link href="/about" className="hover:text-[#1A1A1A]">About</Link>
                    <Link href="/features" className="hover:text-[#1A1A1A]">Features</Link>
                    <Link href="/pricing" className="hover:text-[#1A1A1A]">Pricing</Link>
                    <Link href="/contact" className="hover:text-[#1A1A1A]">Contact</Link>
                    <Link href="/privacy" className="hover:text-[#1A1A1A]">Privacy</Link>
                    <Link href="/terms" className="hover:text-[#1A1A1A]">Terms</Link>
                </div>
                <div className="text-sm font-sans text-[#999999]">
                    © 2026 LeaseLog Inc.
                </div>
            </div>
        </footer>
    )
}
