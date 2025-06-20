'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { 
  LogOut, 
  Menu, 
  X, 
  CreditCard, 
  Users, 
  Coins, 
  DollarSign, 
  FileText,
  LayoutDashboard 
} from 'lucide-react';

type JwtPayload = {
  exp: number;
  [key: string]: any;
};

const links = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Transactions', href: '/dashboard/transactions', icon: CreditCard },
  { name: 'Users', href: '/dashboard/users', icon: Users },
  { name: 'Crypto Currencies', href: '/dashboard/crypto_currencies', icon: Coins },
  { name: 'Currencies', href: '/dashboard/currencies', icon: DollarSign },
  { name: 'Account Details', href: '/dashboard/account_details', icon: FileText },
];

export default function AdminNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/');
      return;
    }

    try {
      const decoded = jwtDecode(token) as JwtPayload;
      const isExpired = decoded.exp * 1000 < Date.now();

      if (isExpired) {
        localStorage.removeItem('token');
        router.push('/');
      }
    } catch (err) {
      console.error('Invalid token:', err);
      localStorage.removeItem('token');
      router.push('/');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-green-900 text-white px-4 py-3 flex justify-between items-center shadow-lg">
        <h2 className="text-lg font-bold">Admin Dashboard</h2>
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-green-800 transition-colors"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <nav
        className={`fixed left-0 top-0 h-full w-64 bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 text-white shadow-2xl transform transition-transform duration-300 z-50 lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-green-700/50 bg-green-800/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <LayoutDashboard size={18} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Admin Panel</h2>
                <p className="text-green-200 text-xs">Management Console</p>
              </div>
            </div>
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-lg hover:bg-green-700/50 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 px-4 py-6 overflow-y-auto">
          <ul className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                      isActive
                        ? 'bg-emerald-600/80 text-white shadow-lg backdrop-blur-sm border border-emerald-500/30'
                        : 'text-green-100 hover:bg-green-700/60 hover:text-white hover:shadow-md'
                    }`}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-0 w-1 h-full bg-emerald-400 rounded-r-full"></div>
                    )}
                    <Icon
                      size={19}
                      className={`transition-all duration-200 ${
                        isActive ? 'text-emerald-200 scale-110' : 'text-green-300 group-hover:text-green-200 group-hover:scale-105'
                      }`}
                    />
                    <span className="font-medium text-sm">{link.name}</span>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-green-700/50 bg-green-800/20">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3.5 text-red-300 hover:bg-red-900/30 hover:text-red-200 rounded-xl transition-all duration-200 group border border-transparent hover:border-red-500/30"
          >
            <LogOut
              size={19}
              className="text-red-400 group-hover:text-red-300 transition-all duration-200 group-hover:scale-105"
            />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </nav>

      {/* Main Content Spacer for Desktop */}
      <div className="lg:w-64 lg:flex-shrink-0"></div>
    </>
  );
}