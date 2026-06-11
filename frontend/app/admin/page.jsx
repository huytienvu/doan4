// app/admin/page.jsx
'use client';

import { useState, useEffect } from 'react';
import {
  FilmIcon,
  UsersIcon,
  EyeIcon,
  PlayCircleIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
  StarIcon,
  ClockIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  VideoCameraIcon,
  TicketIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { getThongke_top_phim_Category_Country_Actor, getTongquan, getTop5_phim_nhieu_luot_xem, get_created_at } from '@/services/admin/thongke';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [selectedChart, setSelectedChart] = useState('views');

  // Mock data thống kê
  const stats = {
    totalMovies: 1856,
    moviesGrowth: 12.5,
    totalUsers: 45678,
    usersGrowth: 8.3,
    totalViews: 2456789,
    viewsGrowth: 25.6,
    totalActors: 3234,
    actorsGrowth: 5.2,
    totalCategories: 42,
    totalCountries: 25,
    averageRating: 4.3,
    totalComments: 15678,
    onlineUsers: 245,
    watchingNow: 156,
    todayNewUsers: 89,
    todayNewMovies: 5
  };

  // Mock data cho biểu đồ
  const chartData = {
    labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
    views: [12500, 15000, 13000, 18000, 22000, 25000, 28000],
    users: [450, 520, 480, 650, 780, 920, 1050],
    revenue: [5.2, 6.1, 5.5, 7.8, 9.2, 10.5, 12.3]
  };

  // Top movies
  const topMovies = [
    { id: 1, title: 'Oppenheimer', views: 45678, rating: 4.8, trend: 'up', change: 15 },
    { id: 2, title: 'Avatar 2', views: 38456, rating: 4.6, trend: 'up', change: 8 },
    { id: 3, title: 'The Batman', views: 32100, rating: 4.5, trend: 'down', change: -5 },
    { id: 4, title: 'Dune 2', views: 28900, rating: 4.7, trend: 'up', change: 22 },
    { id: 5, title: 'John Wick 4', views: 25600, rating: 4.4, trend: 'stable', change: 0 }
  ];

  // Top actors
  const topActors = [
    { id: 1, name: 'Tom Cruise', movies: 45, views: 125000, fans: 8900 },
    { id: 2, name: 'Scarlett Johansson', movies: 38, views: 98000, fans: 7600 },
    { id: 3, name: 'Robert Downey Jr.', movies: 52, views: 89000, fans: 9200 },
    { id: 4, name: 'Emma Stone', movies: 32, views: 76000, fans: 6800 }
  ];

  // Recent activities
  const recentActivities = [
    { id: 1, type: 'movie', action: 'Phim mới được thêm', title: 'Spider-Man: No Way Home', time: '5 phút trước', icon: FilmIcon, color: 'blue' },
    { id: 2, type: 'user', action: 'Người dùng mới đăng ký', title: 'Nguyễn Văn A', time: '10 phút trước', icon: UsersIcon, color: 'green' },
    { id: 3, type: 'comment', action: 'Bình luận mới', title: 'Avatar 2 - "Phim rất hay!"', time: '15 phút trước', icon: ChatBubbleLeftRightIcon, color: 'purple' },
    { id: 4, type: 'rating', action: 'Đánh giá mới', title: 'Oppenheimer - 5 sao', time: '20 phút trước', icon: StarIcon, color: 'yellow' }
  ];

  const [tongquan, setTongquan] = useState({});
  const [countphim, setCountphim] = useState({});
  const [top5phimnhieuluotxem, setTop5phimnhieuluotxem] = useState([]);
  const [getcreatedat, setGetCreatedat] = useState({})
  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getTongquan();
      setTongquan(data);
      const data2 = await getThongke_top_phim_Category_Country_Actor();
      setCountphim(data2);
      const data3 = await getTop5_phim_nhieu_luot_xem();
      setTop5phimnhieuluotxem(data3);
      const data4 = await get_created_at();
      setGetCreatedat(data4)
      console.log(data4);

    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-gray-700 rounded-full"></div>
            <div className="w-20 h-20 border-4 border-red-500 rounded-full animate-spin absolute top-0 left-0 border-t-transparent"></div>
          </div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Dashboard Quản Trị
            </h1>
            <p className="text-gray-600 mt-2">Chào mừng trở lại! Đây là tổng quan hệ thống phim của bạn</p>
          </div>
          <div className="flex items-center gap-4">
            
          </div>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Movies */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <FilmIcon className="h-8 w-8 text-blue-600" />
            </div>
            
          </div>
          <h3 className="text-3xl font-bold mb-1 text-gray-900">{tongquan.phim}</h3>
          <p className="text-gray-600 text-sm">Tổng số phim</p>
          <div className="mt-3 pt-3 border-t border-gray-100">
            
          </div>
        </div>

        {/* Total Users */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-xl">
              <UsersIcon className="h-8 w-8 text-green-600" />
            </div>
            
          </div>
          <h3 className="text-3xl font-bold mb-1 text-gray-900">{tongquan.user}</h3>
          <p className="text-gray-600 text-sm">Tổng người dùng</p>
          <div className="mt-3 pt-3 border-t border-gray-100">
            {/* <span className="text-xs text-gray-500">Mới hôm nay: 99</span> */}
          </div>
        </div>

        {/* Total Views */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 rounded-xl">
              <EyeIcon className="h-8 w-8 text-purple-600" />
            </div>
            
          </div>
          <h3 className="text-3xl font-bold mb-1 text-gray-900">{tongquan.luotxem}</h3>
          <p className="text-gray-600 text-sm">Tổng lượt xem</p>
          <div className="mt-3 pt-3 border-t border-gray-100">
            {/* <span className="text-xs text-gray-500">Đang xem: 99</span> */}
          </div>
        </div>

        {/* Total Actors */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-50 rounded-xl">
              <UsersIcon className="h-8 w-8 text-orange-600" />
            </div>
            
          </div>
          <h3 className="text-3xl font-bold mb-1 text-gray-900">{tongquan.dienvien}</h3>
          <p className="text-gray-600 text-sm">Tổng diễn viên</p>
          <div className="mt-3 pt-3 border-t border-gray-100">
            {/* <span className="text-xs text-gray-500">Rating TB: 99/5</span> */}
          </div>
        </div>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Thống kê Top 5 phim nhiều lượt xem</h3>

          </div>

          {/* Chart Area */}
          <div className="h-80 relative">
            {/* Simple Bar Chart Visualization */}
            <div className="flex items-end justify-between h-full gap-4">
              {top5phimnhieuluotxem.map((phim, index) => {
                const height = (phim.luotxem / top5phimnhieuluotxem.reduce((acc, curr) => acc + curr.luotxem, 0)) * 100;

                return (
                  <div key={phim.id} className="flex-1 flex flex-col items-center">
                    <div className="w-full flex flex-col items-center justify-end h-64 relative group">
                      <div
                        className="w-full bg-gradient-to-t from-blue-500 to-purple-600 rounded-t-lg transition-all duration-300 hover:from-blue-400 hover:to-purple-500 relative"
                        style={{ height: `${height}%` }}
                      >
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          {phim.luotxem.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 mt-2">{phim.ten}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Real-time Stats */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          
        </div>
      </div>

      {/* Top Movies and Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Movies */}
        {/* <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Top phim xem nhiều</h3>
            <button className="text-sm text-blue-400 hover:text-blue-300">Xem tất cả</button>
          </div>
          <div className="space-y-3">
            {topMovies.map((movie, index) => (
              <div key={movie.id} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-xl hover:bg-gray-900/70 transition-all">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-gray-600">#{index + 1}</span>
                  <div>
                    <p className="font-semibold">{movie.title}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                      <span className="flex items-center gap-1">
                        <EyeIcon className="h-3 w-3" />
                        {movie.views.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <StarIconSolid className="h-3 w-3 text-yellow-400" />
                        {movie.rating}
                      </span>
                    </div>
                  </div>
                </div>
                <div className={`flex items-center gap-1 text-sm ${movie.trend === 'up' ? 'text-green-400' : movie.trend === 'down' ? 'text-red-400' : 'text-gray-400'}`}>
                  
                  {movie.change !== 0 && `${Math.abs(movie.change)}%`}
                </div>
              </div>
            ))}
          </div>
        </div> */}

        {/* Category Distribution */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Phân bố thể loại</h3>
            <span className="text-sm text-gray-500">Tổng: {countphim.theloai.length} thể loại</span>
          </div>
          <div className="space-y-3">
            {countphim.theloai.map((category, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>{category.ten}</span>
                  <span className="text-gray-400">{category.total} phim   ({Math.round(category.total / countphim.theloai.reduce((acc, curr) => acc + curr.total, 0) * 100)}%)</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${category.total / countphim.theloai.reduce((acc, curr) => acc + curr.total, 0) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Phân bố quốc gia</h3>
            <span className="text-sm text-gray-400">Tổng: {countphim.quoc_gia.length} quốc gia</span>
          </div>
          <div className="space-y-3">
            {countphim.quoc_gia.map((quocgia, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>{quocgia.quocgia}</span>
                  <span className="text-gray-400">{quocgia.total} phim   ({Math.round(quocgia.total / countphim.quoc_gia.reduce((acc, curr) => acc + curr.total, 0) * 100)}%)</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${quocgia.total / countphim.quoc_gia.reduce((acc, curr) => acc + curr.total, 0) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities and Top Actors */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Hoạt động gần đây</h3>
          <div className="space-y-3">

            <div className="flex items-center gap-4 p-3 bg-white/50 rounded-xl hover:bg-white/70 transition-all">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <FilmIcon className="h-5 w-5 bg-blue-500/20" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Phim mới được thêm</p>
                <p className="text-xs text-gray-400 mt-1">{getcreatedat.phim.ten}</p>
              </div>
              <span className="text-xs text-gray-500">1 phút trước</span>
            </div>

            <div className="flex items-center gap-4 p-3 bg-white/50 rounded-xl hover:bg-white/70 transition-all">
              <div className="p-2 rounded-lg bg-green-300/20">
                <UsersIcon className="h-5 w-5 bg-green-300/10" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Người dùng mới đăng ký</p>
                <p className="text-xs text-gray-400 mt-1">{getcreatedat.user.ho_ten}</p>
              </div>
              <span className="text-xs text-gray-500">1 phút trước</span>
            </div>

          </div>
        </div>

        {/* Top Actors */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Top diễn viên</h3>
          <div className="space-y-4">
            {countphim.dien_vien.map((actor, index) => (
              <div key={actor.id} className="flex items-center gap-3">
                <span className="text-lg font-bold text-gray-400 w-6">#{index + 1}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <img src={actor.anh.startsWith('http') ? actor.anh : `http://localhost:5273/upload/dienvien/${actor.anh}`} alt={`actor`} className="w-10 h-10 object-cover rounded-lg" />
                    <div>
                      <p className="font-semibold text-sm">{actor.ten}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                        <span>{actor.total} phim</span>
                        <span>{Math.round(actor.total / countphim.dien_vien.reduce((acc, curr) => acc + curr.total, 0) * 100)}%</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}