"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import {
  LogOut,
  Menu,
  X,
  CreditCard,
  Users,
  Settings,
  Box,
  Phone,
  LayoutDashboard,
  Group,
  List
} from "lucide-react";

type JwtPayload = {
  exp: number;
  [key: string]: any;
};

const links = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Orders", href: "/dashboard/orders", icon: CreditCard },
  { name: "Products", href: "/dashboard/products", icon: Box },
  { name: "Users", href: "/dashboard/users", icon: Users },
  { name: "About Details", href: "/dashboard/about", icon: Group },
  { name: "Contact Details", href: "/dashboard/contact", icon: Phone },
  { name: "Categories", href: "/dashboard/categories", icon: List },
  { name: "Website Settings", href: "/dashboard/settings", icon: Settings },
];

export default function AdminNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/");
      return;
    }

    try {
      const decoded = jwtDecode(token) as JwtPayload;
      const isExpired = decoded.exp * 1000 < Date.now();

      if (isExpired) {
        localStorage.removeItem("token");
        router.push("/");
      }
    } catch (err) {
      console.error("Invalid token:", err);
      localStorage.removeItem("token");
      router.push("/");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-primary text-black p-1 flex justify-between items-center rounded-lg fixed z-40 right-2 top-8">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-opacity-60 transition-colors"
        >
          <Menu size={16} />
        </button>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <nav
        className={`fixed left-0 top-0 h-full w-64 bg-gradient-to-br from-primary via-primary to-primary text-white shadow-2xl transform transition-transform duration-300 z-50 lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/60 bg-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <LayoutDashboard size={18} className="text-black" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-black">Admin Panel</h2>
                <p className="text-black text-xs">Management Console</p>
              </div>
            </div>
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-lg hover:bg-primary/50 transition-colors"
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
                        ? "bg-white/20 text-black shadow-lg backdrop-blur-sm border border-white/60"
                        : "text-black hover:bg-white/60 hover:text-black hover:shadow-md"
                    }`}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-0 w-1 h-full bg-black rounded-r-full"></div>
                    )}
                    <Icon
                      size={19}
                      className={`transition-all duration-200 ${
                        isActive
                          ? "text-black scale-110"
                          : "text-black group-hover:text-black group-hover:scale-105"
                      }`}
                    />
                    <span className="font-medium text-sm">{link.name}</span>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-black rounded-full animate-pulse"></div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-white/70 bg-white/20">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3.5 text-red-300 hover:bg-red-900/30 hover:text-red-200 rounded-xl transition-all duration-200 group border border-transparent hover:border-red-500/30"
          >
            <LogOut
              size={19}
              className="text-red-800 group-hover:text-red-300 transition-all duration-200 group-hover:scale-105"
            />
            <span className="font-medium text-sm text-red-500">Logout</span>
          </button>
        </div>
      </nav>

      {/* Main Content Spacer for Desktop */}
      <div className="lg:w-64 lg:flex-shrink-0"></div>
    </>
  );
}
