'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  HomeIcon,
  FilmIcon,
  RectangleStackIcon,
  UsersIcon,
  GlobeAltIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  TicketIcon,
  StarIcon,
  CalendarDaysIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { 
  HomeIcon as HomeIconSolid,
  FilmIcon as FilmIconSolid,
  RectangleStackIcon as RectangleStackIconSolid,
  UsersIcon as UsersIconSolid,
  GlobeAltIcon as GlobeAltIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
} from '@heroicons/react/24/solid';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { getRole } from '@/utils/auth';
import { ToastContainer } from 'react-toastify';

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: HomeIcon,
      iconSolid: HomeIconSolid,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Phim',
      href: '/admin/movie',
      icon: FilmIcon,
      iconSolid: FilmIconSolid,
      color: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Danh mục',
      href: '/admin/category',
      icon: RectangleStackIcon,
      iconSolid: RectangleStackIconSolid,
      color: 'from-green-500 to-emerald-500'
    },
    {
      name: 'Diễn viên',
      href: '/admin/actor',
      icon: UsersIcon,
      iconSolid: UsersIconSolid,
      color: 'from-orange-500 to-red-500'
    },
    {
      name: 'Quốc gia',
      href: '/admin/country',
      icon: GlobeAltIcon,
      iconSolid: GlobeAltIconSolid,
      color: 'from-indigo-500 to-purple-500'
    },
    {
      name: 'Lịch chiếu',
      href: '/admin/schedule',
      icon: CalendarDaysIcon,
      iconSolid: CalendarDaysIcon,
      color: 'from-teal-500 to-cyan-500'
    },
    {
      name: 'Thống kê',
      href: '/admin/analytics',
      icon: ChartBarIcon,
      iconSolid: ChartBarIcon,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      name: 'Cài đặt',
      href: '/admin/settings',
      icon: Cog6ToothIcon,
      iconSolid: Cog6ToothIconSolid,
      color: 'from-gray-500 to-gray-700'
    },
  ];
  const token = localStorage.getItem("token");
  const role = getRole();
  if (!token) {
    router.push("/login")
    return;
  }
  if (role === "User") {
    router.push("/")
    return;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`${isCollapsed ? 'w-20' : 'w-72'} sticky top-0 h-screen transition-all duration-300 bg-white shadow-2xl h-screen flex flex-col relative`}>
        {/* Header với gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
          <div className="flex items-center justify-between">
            <div className={`flex items-center space-x-3 ${isCollapsed ? 'justify-center' : ''}`}>
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl">
                <FilmIcon className="h-8 w-8 text-white" />
              </div>
              {!isCollapsed && (
                <div>
                  <h1 className="text-xl font-bold text-white">Movie Admin</h1>
                  <p className="text-xs text-blue-100">Quản trị hệ thống</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="px-4 py-6 border-b border-gray-100">
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-0.5">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <UserCircleIcon className="h-8 w-8 text-gray-600" />
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            {!isCollapsed && (
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">Admin User</p>
                <p className="text-xs text-gray-500">admin@movie.com</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = isActive ? item.iconSolid : item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center ${isCollapsed ? 'justify-center' : ''} px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 relative ${isActive
                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 shadow-md'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-r-full"></div>
                )}

                {/* Icon with gradient background for active state */}
                <div className={`relative ${!isCollapsed ? 'mr-3' : ''}`}>
                  <div className={`p-2 rounded-lg transition-all duration-200 ${isActive
                      ? `bg-gradient-to-r ${item.color} shadow-lg`
                      : 'bg-gray-100 group-hover:bg-gray-200'
                    }`}>
                    <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-600 group-hover:text-gray-800'}`} />
                  </div>
                  {isActive && (
                    <div className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-lg blur-xl opacity-40`}></div>
                  )}
                </div>

                {/* Text and badge */}
                {!isCollapsed && (
                  <>
                    <span className="flex-1">{item.name}</span>
                    {item.name === 'Phim' && (
                      <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">12</span>
                    )}
                    {item.name === 'Thống kê' && (
                      <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">New</span>
                    )}
                  </>
                )}

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50">
                    {item.name}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-4 border-r-gray-800"></div>
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Đăng xuất */}
        {/* <div className="border-t border-gray-100 p-4 space-y-2">
          {!isCollapsed && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-700">Storage Used</span>
                <span className="text-xs text-gray-500">75%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">7.5 GB of 10 GB</p>
            </div>
          )}

          <button className={`w-full flex items-center ${isCollapsed ? 'justify-center' : ''} px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group`}>
            <ArrowRightOnRectangleIcon className={`h-5 w-5 ${!isCollapsed ? 'mr-3' : ''} group-hover:scale-110 transition-transform`} />
            {!isCollapsed && <span>Đăng xuất</span>}
          </button>
        </div> */}

        {/* mở đóng thu nhỏ menu */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-24 bg-white border-2 border-gray-200 rounded-full p-1.5 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 z-50"
        >
          {isCollapsed ? (
            <ChevronRightIcon className="h-4 w-4 text-gray-600" />
          ) : (
            <ChevronLeftIcon className="h-4 w-4 text-gray-600" />
          )}
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      <ToastContainer/>
    </div>
  );
}
