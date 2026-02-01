'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function AboutPage() {
    return (
        <div className="min-h-screen pt-20 pb-32">
            {/* Header */}
            <section className="px-6 py-20 text-center max-w-4xl mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-serif text-5xl md:text-6xl text-[#1A1A1A] mb-8"
                >
                    Building for peace of mind.
                </motion.h1>
                <p className="font-sans text-xl text-[#555555] leading-relaxed">
                    We started LeaseLog because we were tired of complex, clunky property management software.
                    We wanted something that felt human.
                </p>
            </section>

            {/* Story Section */}
            <section className="px-6 py-20 bg-white border-y border-[#E5E5E5]">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                    <div className="relative aspect-square rounded-sm overflow-hidden bg-[#F0F0F0]">
                        <Image
                            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
                            alt="Team working together"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div>
                        <h2 className="font-serif text-3xl text-[#1A1A1A] mb-6">Our Story</h2>
                        <div className="space-y-6 text-[#555555] font-sans text-lg leading-relaxed">
                            <p>
                                In 2024, our founders, experienced landlords themselves, realized that the tools available were designed for giant corporations, not for people who care about their properties and tenants.
                            </p>
                            <p>
                                They set out to build a platform that strips away the noise. No complicated menus, no hidden fees, just a beautiful, simple way to track what matters.
                            </p>
                            <p>
                                Today, LeaseLog helps thousands of landlords reclaim their time and sanity. We believe that when your management tools are calm, your business performs better.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="px-6 py-32 max-w-6xl mx-auto">
                <h2 className="font-serif text-4xl text-[#1A1A1A] mb-16 text-center">The team behind the screen</h2>
                <div className="grid md:grid-cols-3 gap-12">
                    {[
                        { name: "Elena Rodriguez", role: "Co-Founder & CEO", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop" },
                        { name: "David Chen", role: "Head of Product", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop" },
                        { name: "Sarah Miller", role: "Head of Customer Success", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop" },
                    ].map((member, i) => (
                        <div key={i} className="text-center group">
                            <div className="w-48 h-48 mx-auto rounded-full overflow-hidden mb-6 relative grayscale group-hover:grayscale-0 transition-all duration-500">
                                <Image
                                    src={member.img}
                                    alt={member.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <h3 className="font-serif text-xl text-[#1A1A1A] mb-1">{member.name}</h3>
                            <p className="font-sans text-sm tracking-wide uppercase text-[#666666]">{member.role}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}
