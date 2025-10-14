"use client"
import React from 'react';
import { Filter } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { IMAGE_URL } from '@/config/config';

const MovieList = ({ movies = [] }) => {
  const router = useRouter();

  const genres = [
    { value: 'all', label: 'Tất cả thể loại' },
    { value: 'action', label: 'Hành động' },
    { value: 'drama', label: 'Chính kịch' },
    { value: 'scifi', label: 'Khoa học viễn tưởng' },
  ];

  const years = [
    { value: 'all', label: 'Tất cả năm' },
    { value: '2020s', label: '2020+' },
    { value: '2010s', label: '2010-2019' },
    { value: '2000s', label: '2000-2009' },
    { value: '1990s', label: '1990-1999' },
  ];

  return (
    <div className="min-h-screen bg-black text-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Bộ lọc */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8 border border-gray-800">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-red-600" />
            <h2 className="text-xl font-semibold text-white">Bộ lọc</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Thể loại</label>
              <select className="w-full bg-black text-white border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600">
                {genres.map(genre => (
                  <option key={genre.value} value={genre.value}>{genre.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Năm phát hành</label>
              <select className="w-full bg-black text-white border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600">
                {years.map(year => (
                  <option key={year.value} value={year.value}>{year.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Sắp xếp theo</label>
              <select className="w-full bg-black text-white border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600">
                <option value="popular">Phổ biến nhất</option>
                <option value="rating">Đánh giá cao</option>
                <option value="newest">Mới nhất</option>
                <option value="oldest">Cũ nhất</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lưới phim */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          {movies.map(movie => (
            <div
              key={movie.id}
              className="bg-black-900 rounded-lg overflow-hidden border border-gray-800 hover:border-red-600 transition-all duration-300 hover:scale-105 cursor-pointer group"
              onClick={() => router.push(`/movie?id=${movie.id}`)}
            >
              <div className="relative overflow-hidden aspect-[3/4]">
                <img
                  src={`${IMAGE_URL}/${movie.anh_dai_dien}`}
                  alt={movie.ten}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              <div className="p-4">
                <h3 className="text-center text-white font-semibold mb-2 line-clamp-2">{movie.ten}</h3>
                <div className="flex justify-center items-center gap-1 text-gray-400 text-sm">
                  <span>{movie.ten_tieng_anh}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default MovieList;
