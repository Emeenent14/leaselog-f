import type { Metadata } from 'next'
import { Inter, Libre_Baskerville } from 'next/font/google'
import './globals.css'
import { Providers } from '@/providers'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

const libre = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-serif',
})

export const metadata: Metadata = {
  title: 'LeaseLog - Property Management Made Simple',
  description: 'Property management and accounting for landlords',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${libre.variable} font-sans bg-[#FBF9F6] text-[#2D2D2D] bg-noise`}>
        <Providers>
          <Navbar />
          <main className="relative z-10">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
