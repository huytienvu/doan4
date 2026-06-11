// components/Header.js
import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { getAllCategory } from '../../../services/category';
import { getAllCountry } from '../../../services/quocgia';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getuserName, getVip } from '@/utils/auth';
import { CrownIcon } from 'lucide-react';

const Header = () => {
  const [arrCategory, setarrCategory] = useState([]);
  const [arrCountry, setarrCountry] = useState([]);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  const [isVip, setIsVip] = useState(false);
  const menuRef = useRef(null);
  const router = useRouter();

  const fetdata = async () => {
    const cate = await getAllCategory();
    const country = await getAllCountry();
    setarrCategory(cate);
    setarrCountry(country);
    const vipStatus = getVip();
    setIsVip(vipStatus === true);
  };

  useEffect(() => {
    fetdata();
  }, []);

  // Xử lý scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMenu = () => {
    const token = localStorage.getItem('token');
    if (token == null) {
      router.push("/login");
    } else {
      setShowUserMenu(!showUserMenu);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${searchQuery}`);
    }
  };

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${isScrolled
      ? 'bg-black/95 backdrop-blur-lg shadow-2xl py-3'
      : 'bg-gradient-to-b from-black via-black/90 to-transparent py-5'
      }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="group">
              <div className="relative">
                <Image
                  src="/images/ava.svg"
                  alt="PhimMoi Logo"
                  width={140}
                  height={40}
                  className="cursor-pointer transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-red-500 to-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            <Link href="#" className="nav-item group">
              <span className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-white/10">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                <span className="text-white font-medium text-sm group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-red-400 group-hover:to-orange-400">
                  PHIM MỚI
                </span>
              </span>
            </Link>

            <Link href="/type/le" className="nav-item group">
              <span className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-white/10">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                <span className="text-white font-medium text-sm group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-red-400 group-hover:to-orange-400">
                  PHIM LẺ
                </span>
              </span>
            </Link>

            <Link href="/type/bo" className="nav-item group">
              <span className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-white/10">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
                <span className="text-white font-medium text-sm group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-red-400 group-hover:to-orange-400">
                  PHIM BỘ
                </span>
              </span>
            </Link>

            {/* THỂ LOẠI Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-white/10">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                </svg>
                <span className="text-white font-medium text-sm group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-red-400 group-hover:to-orange-400">
                  THỂ LOẠI
                </span>
                <svg className="w-3 h-3 text-white/70 group-hover:rotate-180 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <div className="absolute left-0 mt-2 w-[400px] bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 shadow-2xl rounded-xl p-4 
                          opacity-0 invisible group-hover:opacity-100 group-hover:visible
                          transform translate-y-2 group-hover:translate-y-0
                          transition-all duration-300">
                <div className="grid grid-cols-2 gap-2">
                  {arrCategory.map(cat => (
                    <Link
                      href={`/category/${cat.id}`}
                      key={cat.id}
                      className="px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-red-500/20 hover:to-orange-500/20 transition-all duration-200 text-sm"
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-gradient-to-r from-red-400 to-orange-400 rounded-full"></span>
                        Phim {cat.ten}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* QUỐC GIA Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-white/10">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                </svg>
                <span className="text-white font-medium text-sm group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-red-400 group-hover:to-orange-400">
                  QUỐC GIA
                </span>
                <svg className="w-3 h-3 text-white/70 group-hover:rotate-180 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <div className="absolute left-0 mt-2 w-[400px] bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 shadow-2xl rounded-xl p-4 
                          opacity-0 invisible group-hover:opacity-100 group-hover:visible
                          transform translate-y-2 group-hover:translate-y-0
                          transition-all duration-300">
                <div className="grid grid-cols-2 gap-2">
                  {arrCountry.map(cat => (
                    <Link
                      href={`/country/${cat.quocgia}`}
                      key={cat.id}
                      className="px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-red-500/20 hover:to-orange-500/20 transition-all duration-200 text-sm"
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-gradient-to-r from-red-400 to-orange-400 rounded-full"></span>
                        Phim {cat.quocgia}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* <Link href="#" className="nav-item group">
              <span className="px-3 py-2 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold text-sm shadow-lg hover:shadow-red-500/25 transition-all duration-300 hover:scale-105">
                TOP PHIM
              </span>
            </Link> */}
          </nav>

          {/* Search & User Section */}
          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex">
              <div className="relative group">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm phim, diễn viên..."
                  className="w-64 px-4 py-2.5 pl-10 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-full text-white placeholder-gray-400 
                           focus:outline-none focus:border-red-500/50 focus:bg-gray-800/70 transition-all duration-300"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
                <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full text-sm font-medium hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300">
                  Tìm
                </button>
              </div>
            </form>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {showMobileMenu ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* User Avatar */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={handleMenu}
                className="relative group"
              >
                <div className="relative">
                  <Image
                    src="https://cdn2.fptshop.com.vn/small/avatar_trang_1_cd729c335b.jpg"
                    alt="User Avatar"
                    width={42}
                    height={42}
                    className="rounded-full border-2 border-gray-600 hover:border-red-500 transition-all duration-300"
                  />

                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-black rounded-full"></div>

                  {isVip && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 p-1.5 rounded-full shadow-lg border-2 border-black">
                      <CrownIcon className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-3 w-56 bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-xl shadow-2xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-700/50">
                    <p className="text-sm text-gray-400">Xin chào!</p>
                    <p className="text-white font-medium truncate">{getuserName()}</p>
                  </div>
                  <ul className="py-2">
                    <li>
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-red-500/10 hover:to-orange-500/10 transition-all duration-200"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        Hồ sơ cá nhân
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/upgrade"
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-red-500/10 hover:to-orange-500/10 transition-all duration-200"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        Nâng cấp tài khoản
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/favorite"
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-red-500/10 hover:to-orange-500/10 transition-all duration-200"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                        Phim yêu thích
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/history"
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-red-500/10 hover:to-orange-500/10 transition-all duration-200"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        Lịch sử xem
                      </Link>
                    </li>
                    <li className="border-t border-gray-700/50 mt-2 pt-2">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          localStorage.removeItem('token');
                          router.push('/');
                        }}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                        </svg>
                        Đăng xuất
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-800 pt-4">
            <div className="flex flex-col space-y-2">
              <Link href="#" className="text-white hover:text-red-400 py-2 transition-colors">PHIM MỚI</Link>
              <Link href="/type/le" className="text-white hover:text-red-400 py-2 transition-colors">PHIM LẺ</Link>
              <Link href="/type/bo" className="text-white hover:text-red-400 py-2 transition-colors">PHIM BỘ</Link>
              <Link href="#" className="text-white hover:text-red-400 py-2 transition-colors">THỂ LOẠI</Link>
              <Link href="#" className="text-white hover:text-red-400 py-2 transition-colors">QUỐC GIA</Link>
              <Link href="#" className="text-red-400 font-bold py-2">TOP PHIM</Link>

              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="mt-3">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm phim..."
                    className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1">
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;