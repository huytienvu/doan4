// components/Header.js
import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { getAllCategory } from '../../../services/category';
import { getAllCountry } from '../../../services/quocgia';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Header = () => {
  const [arrCategory, setarrCategory] = useState([]);
  const [arrCountry, setarrCountry] = useState([]);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);
  const router = useRouter();

  const fetdata = async () => {
    const cate = await getAllCategory();
    const country = await getAllCountry();
    setarrCategory(cate);
    setarrCountry(country);
  };
  useEffect(() => {

    fetdata();
  }, []);
  const hanldemenu = () => {


    const token = localStorage.getItem('token');
    if (token == null) {
      router.push("/login")

    }
    else {
      setShowUserMenu(!showUserMenu);
    }


  }

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
    <header className="bg-black py-4">
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/">
            <Image
              src="/images/logo.jpg"
              alt="PhimMoi Logo"
              width={140}
              height={40}
              className="mr-2 cursor-pointer"
            />
          </Link>
        </div>

        {/* Navbar */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="#" className="text-white hover:text-yellow-500">PHIM MỚI</Link>
          <Link href={`/type/le`} className="text-white hover:text-yellow-500">PHIM LẺ</Link>
          <Link href={`/type/bo`} className="text-white hover:text-yellow-500">PHIM BỘ</Link>

          {/* THỂ LOẠI */}
          <div className="relative group">
            <a href="#" className="text-white hover:text-yellow-500 cursor-pointer">
              THỂ LOẠI
            </a>
            <div
              className="absolute left-0 mt-2 w-96 bg-black shadow-lg rounded-md p-4 
                     opacity-0 invisible 
                     group-hover:opacity-100 group-hover:visible
                     transition-all duration-300 
                     grid grid-cols-2 gap-y-2 text-sm z-10"
            >
              {arrCategory.map(cat => (
                <Link
                  href={`/category/${cat.id}`}
                  key={cat.id}
                  className="text-white hover:text-yellow-500"
                >
                  Phim {cat.ten}
                </Link>
              ))}
            </div>
          </div>

          {/* QUỐC GIA */}
          <div className="relative group">
            <a href="#" className="text-white hover:text-yellow-500 cursor-pointer">
              QUỐC GIA
            </a>
            <div
              className="absolute left-0 mt-2 w-96 bg-black shadow-lg rounded-md p-4 
                     opacity-0 invisible 
                     group-hover:opacity-100 group-hover:visible
                     transition-all duration-300 
                     grid grid-cols-2 gap-y-2 text-sm z-10"
            >
              {arrCountry.map(cat => (
                <Link
                  href={`/country/${cat.quocgia}`}
                  key={cat.id}
                  className="text-white hover:text-yellow-500"
                >
                  Phim {cat.quocgia}
                </Link>
              ))}
            </div>
          </div>

          <Link href="#" className="text-white hover:text-yellow-500">NĂM PHÁT HÀNH</Link>
          <Link href="#" className="text-white hover:text-yellow-500">PHIM CHIẾU RẠP</Link>
          <Link href="#" className="text-white hover:text-yellow-500">TRAILER</Link>
          <Link href="#" className="text-yellow-500 font-bold hover:text-yellow-500">TOP PHIM</Link>
        </nav>

        {/* Search + User */}
        <div className="flex items-center gap-4 relative" ref={menuRef}>
          {/* Ô tìm kiếm */}
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Tìm tên phim, diễn viên..."
              className="bg-gray-800 text-white px-4 py-2 rounded-l-md focus:outline-none"
            />
            <button className="bg-gray-700 text-white px-4 py-2 rounded-r-md hover:bg-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {/* Avatar người dùng */}
          <div className="relative">
            <button
              onClick={hanldemenu}
              className="flex items-center focus:outline-none"
            >
              <Image
                src="https://cdn2.fptshop.com.vn/small/avatar_trang_1_cd729c335b.jpg"
                alt="User Avatar"
                width={40}
                height={40}
                className="rounded-full border border-gray-500 hover:scale-105 transition-transform"
              />
            </button>

            {/* Menu người dùng */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-md shadow-lg z-50">
                <ul className="text-sm text-white">
                  <li>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 hover:bg-gray-800"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Hồ sơ
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/favorite"
                      className="block px-4 py-2 hover:bg-gray-800"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Phim yêu thích
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/history"
                      className="block px-4 py-2 hover:bg-gray-800"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Lịch sử xem
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        localStorage.removeItem('token');
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-800 text-red-400"
                    >
                      Đăng xuất
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
