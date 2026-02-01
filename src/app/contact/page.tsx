'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export default function ContactPage() {
    return (
        <div className="min-h-screen pt-20 pb-32">
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 py-20">
                <div>
                    <h1 className="font-serif text-5xl text-[#1A1A1A] mb-8">Get in touch</h1>
                    <p className="font-sans text-xl text-[#555555] mb-12">
                        Have a question? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>

                    <div className="space-y-8">
                        <div>
                            <h3 className="font-serif text-xl text-[#1A1A1A] mb-2">Office</h3>
                            <p className="font-sans text-[#666666]">
                                123 Innovation Drive<br />
                                Suite 400<br />
                                San Francisco, CA 94103
                            </p>
                        </div>
                        <div>
                            <h3 className="font-serif text-xl text-[#1A1A1A] mb-2">Email</h3>
                            <p className="font-sans text-[#666666]">
                                hello@leaselog.com<br />
                                support@leaselog.com
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-8 md:p-12 border border-[#E5E5E5]">
                    <form className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[#1A1A1A]">First Name</label>
                                <Input className="rounded-none border-[#E5E5E5] bg-[#FAFAFA] h-12" placeholder="Jane" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[#1A1A1A]">Last Name</label>
                                <Input className="rounded-none border-[#E5E5E5] bg-[#FAFAFA] h-12" placeholder="Doe" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[#1A1A1A]">Email</label>
                            <Input type="email" className="rounded-none border-[#E5E5E5] bg-[#FAFAFA] h-12" placeholder="jane@example.com" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[#1A1A1A]">Message</label>
                            <Textarea className="rounded-none border-[#E5E5E5] bg-[#FAFAFA] min-h-[150px]" placeholder="How can we help?" />
                        </div>

                        <Button className="w-full h-12 rounded-none bg-[#2D2D2D] text-white hover:bg-black uppercase tracking-wide text-xs font-semibold">
                            Send Message
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}
