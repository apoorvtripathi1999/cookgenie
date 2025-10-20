'use client';

import React from 'react';
import Link from 'next/link';
import { ChefHat, Home, Package, BookOpen, Heart, Settings } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const Navbar: React.FC = () => {
  const pathname = usePathname();
  
  const navItems = [
    { href: '/', label: 'Dashboard', icon: Home },
    { href: '/inventory', label: 'Inventory', icon: Package },
    { href: '/recipes', label: 'Recipes', icon: BookOpen },
    { href: '/favorites', label: 'Favorites', icon: Heart },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];
  
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-2 rounded-lg">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">CookGenie</span>
          </Link>
          
          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all',
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            {/* Add mobile menu later if needed */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

