"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-black/95 border-t border-gray-800">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="inline-block group">
              <div className="relative">
                <Image
                  src="/images/ava.svg"
                  alt="PhimMoi Logo"
                  width={140}
                  height={40}
                  className="transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-red-500 to-orange-500"></div>
              </div>
            </Link>
            <p className="mt-4 text-sm text-gray-400 leading-relaxed">
              Xem phim trực tuyến chất lượng cao. Cập nhật liên tục phim mới, phim lẻ, phim bộ, trailer và tin tức điện ảnh.
            </p>
            <div className="mt-4 flex items-center gap-3 text-gray-400">
              <a href="#" aria-label="Facebook" className="hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12a10 10 0 10-11.5 9.9v-7h-2v-3h2v-2.3c0-2 1.2-3.1 3-3.1.9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.2V12h2.3l-.4 3h-1.9v7A10 10 0 0022 12z"/></svg>
              </a>
              <a href="#" aria-label="YouTube" className="hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.6 3.5 12 3.5 12 3.5s-7.6 0-9.4.6A3 3 0 00.5 6.2 31.7 31.7 0 000 12a31.7 31.7 0 00.5 5.8 3 3 0 002.1 2.1c1.8.6 9.4.6 9.4.6s7.6 0 9.4-.6a3 3 0 002.1-2.1A31.7 31.7 0 0024 12a31.7 31.7 0 00-.5-5.8zM9.6 15.5v-7L16 12l-6.4 3.5z"/></svg>
              </a>
              <a href="#" aria-label="Twitter" className="hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.25 4.25 0 001.86-2.35 8.49 8.49 0 01-2.68 1.03A4.23 4.23 0 0015.5 4a4.24 4.24 0 00-4.24 4.24c0 .33.04.65.1.96A12 12 0 013 5.15a4.24 4.24 0 001.31 5.66 4.2 4.2 0 01-1.92-.53v.05A4.24 4.24 0 006.2 14a4.26 4.26 0 01-1.9.07 4.25 4.25 0 003.96 2.94A8.5 8.5 0 012 19.54 12 12 0 008.29 21c7.55 0 11.68-6.26 11.68-11.68v-.53A8.35 8.35 0 0022.46 6z"/></svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Khám phá</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/type/le" className="hover:text-white transition-colors">Phim lẻ</Link></li>
              <li><Link href="/type/bo" className="hover:text-white transition-colors">Phim bộ</Link></li>
              <li><Link href="/category/1" className="hover:text-white transition-colors">Hành động</Link></li>
              <li><Link href="/category/2" className="hover:text-white transition-colors">Tình cảm</Link></li>
              <li><Link href="/category/3" className="hover:text-white transition-colors">Kinh dị</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quốc gia</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/country/VietNam" className="hover:text-white transition-colors">Việt Nam</Link></li>
              <li><Link href="/country/Korea" className="hover:text-white transition-colors">Hàn Quốc</Link></li>
              <li><Link href="/country/China" className="hover:text-white transition-colors">Trung Quốc</Link></li>
              <li><Link href="/country/US-UK" className="hover:text-white transition-colors">Âu - Mỹ</Link></li>
              <li><Link href="/country/Japan" className="hover:text-white transition-colors">Nhật Bản</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Thông tin</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/about" className="hover:text-white transition-colors">Giới thiệu</Link></li>
              <li><Link href="/policy" className="hover:text-white transition-colors">Chính sách</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Liên hệ</Link></li>
              <li><Link href="/upgrade" className="hover:text-white transition-colors">Nâng cấp tài khoản</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">© {new Date().getFullYear()} PhimMoi. All rights reserved.</p>
          <div className="text-xs text-gray-500">
            <span className="mr-2">Made with</span>
            <span className="text-red-500">❤</span>
            <span className="ml-2">for movie lovers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
