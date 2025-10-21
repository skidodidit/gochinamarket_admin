'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { 
  Bell, 
  Search, 
  User, 
  Settings,
  LayoutDashboard,
  CreditCard,
  Users,
  Coins,
  DollarSign,
  FileText,
  ChevronRight
} from 'lucide-react';

// Route configuration with titles and descriptions
const routeConfig: Record<string, { title: string; description: string; icon: React.ComponentType<any> }> = {
  '/dashboard': { 
    title: 'Dashboard', 
    description: 'Overview of your admin panel',
    icon: LayoutDashboard 
  },
  '/dashboard/orders': { 
    title: 'Orders', 
    description: 'Manage and monitor all orders',
    icon: CreditCard 
  },
  '/dashboard/products': { 
    title: 'Products', 
    description: 'Products management',
    icon: Users 
  },
  '/dashboard/users': { 
    title: 'Users', 
    description: 'User management and administration',
    icon: Users 
  },
  '/dashboard/about': { 
    title: 'About Us Details', 
    description: 'Manage and edit about us details',
    icon: Users 
  },
  '/dashboard/contact': { 
    title: 'Contact Details', 
    description: 'Set Contact details to be reached on',
    icon: Users 
  },
  '/dashboard/settings': { 
    title: 'Settings', 
    description: 'Set app values',
    icon: Users 
  },
};

interface AdminHeaderProps {
  userName?: string;
  userRole?: string;
}

export default function AdminHeader({ userName = 'Admin', userRole = 'Administrator' }: AdminHeaderProps) {
  const pathname = usePathname();
  
  // Get current route info or default to dashboard
  const currentRoute = routeConfig[pathname] || routeConfig['/admin/dashboard'];
  const Icon = currentRoute?.icon;

  // Generate breadcrumb from pathname
  const generateBreadcrumb = () => {
    const segments = pathname.split('/').filter(Boolean);
    return segments.map((segment, index) => {
      const path = '/' + segments.slice(0, index + 1).join('/');
      const routeInfo = routeConfig[path];
      return {
        name: routeInfo ? routeInfo.title : segment.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        path,
        isLast: index === segments.length - 1
      };
    });
  };

  const breadcrumb = generateBreadcrumb();

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm fixed w-full top-0 z-20">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section - Title and Breadcrumb */}
          <div className="flex-1">
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
              {breadcrumb.map((item, index) => (
                <div key={item.path} className="flex items-center">
                  {index > 0 && <ChevronRight size={14} className="mx-2 text-gray-400" />}
                  <span className={item.isLast ? 'text-black font-medium' : 'hover:text-gray-700'}>
                    /{item.name}
                  </span>
                </div>
              ))}
            </nav>
            
            {/* Page Title */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                {/* <Icon size={24} className="text-black" /> */}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{currentRoute?.title}</h1>
                <p className="text-sm text-gray-600 mt-1">{currentRoute?.description}</p>
              </div>
            </div>
          </div>

          {/* Right Section - Search, Notifications, Profile */}
          <div className="flex items-center gap-2">
          </div>
        </div>
      </div>
    </header>
  );
}