'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Building,
  Users,
  FileText,
  DollarSign,
  CreditCard,
  BarChart3,
  Settings,
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Properties', href: '/properties', icon: Building },
  { name: 'Tenants', href: '/tenants', icon: Users },
  { name: 'Leases', href: '/leases', icon: FileText },
  { name: 'Rent', href: '/rent', icon: DollarSign },
  { name: 'Transactions', href: '/transactions', icon: CreditCard },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
]

const secondaryNavigation = [
  { name: 'Settings', href: '/settings', icon: Settings },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r flex flex-col',
        className
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <Building className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">LeaseLog</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <item.icon className={cn('mr-3 h-5 w-5', isActive ? 'text-primary-600' : 'text-gray-400')} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Secondary Navigation */}
      <div className="px-3 py-4 border-t">
        {secondaryNavigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <item.icon className={cn('mr-3 h-5 w-5', isActive ? 'text-primary-600' : 'text-gray-400')} />
              {item.name}
            </Link>
          )
        })}
      </div>
    </aside>
  )
}
