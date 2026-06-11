// app/admin/dashboard/page.jsx
'use client'

import { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { get_topRatting, get_topFavorite, getTop5_phim_nhieu_luot_xem } from '../../../services/admin/thongke';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

import {
  ChartBarIcon,
  UsersIcon,
  FilmIcon,
  CurrencyDollarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon,
  PlayCircleIcon,
  CalendarIcon,
  ClockIcon,
  StarIcon,
  UserGroupIcon,
  VideoCameraIcon,
  TicketIcon,
  DocumentChartBarIcon,
  CubeIcon,
  GlobeAltIcon,
  ServerIcon,
  BellIcon,
  Cog6ToothIcon,
  ArrowPathIcon,
  FunnelIcon,
  ChevronDownIcon,
  EllipsisVerticalIcon,
  ArrowsUpDownIcon
} from '@heroicons/react/24/outline';
import DoanhThuChart from '@/components/user/listMovie/bardt';


export default function AdminDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [selectedChart, setSelectedChart] = useState('revenue');
  const [top5movieview, setTop5movieview] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topRatting, setTopRatting] = useState(null);
  const [ratingView, setRatingView] = useState('cao'); // 'cao' or 'thap'
  const [topFavorite, setTopFavorite] = useState(null);

  // Chart data
  const chartData = {
    labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
    datasets: {
      revenue: [2500000, 2800000, 2600000, 3200000, 3500000, 3800000, 4200000],
      users: [450, 520, 480, 650, 780, 920, 1050],
      views: [12500, 15000, 13000, 18000, 22000, 25000, 28000],
      movies: [5, 8, 6, 12, 15, 18, 10]
    }
  };

  // Top content
  const topMovies = [
    {
      id: 1,
      rank: 1,
      rankChange: 'up',
      title: 'Oppenheimer',
      category: 'Phim lẻ',
      views: 125600,
      rating: 4.8,
      revenue: 15600000,
      trend: 15.5
    },
    {
      id: 2,
      rank: 2,
      rankChange: 'down',
      title: 'Avatar: The Way of Water',
      category: 'Phim lẻ',
      views: 98500,
      rating: 4.6,
      revenue: 12300000,
      trend: -5.2
    },
    {
      id: 3,
      rank: 3,
      rankChange: 'up',
      title: 'The Last of Us',
      category: 'Phim bộ',
      views: 89600,
      rating: 4.9,
      revenue: 10500000,
      trend: 22.3
    },
    {
      id: 4,
      rank: 4,
      rankChange: 'same',
      title: 'Spider-Man: No Way Home',
      category: 'Phim lẻ',
      views: 76800,
      rating: 4.7,
      revenue: 9200000,
      trend: 8.7
    },
    {
      id: 5,
      rank: 5,
      rankChange: 'up',
      title: 'Wednesday',
      category: 'Phim bộ',
      views: 65400,
      rating: 4.5,
      revenue: 7800000,
      trend: 18.9
    }
  ];

  // User activity
  const userActivity = [
    { hour: '00:00', active: 1200 },
    { hour: '03:00', active: 800 },
    { hour: '06:00', active: 1500 },
    { hour: '09:00', active: 2800 },
    { hour: '12:00', active: 3500 },
    { hour: '15:00', active: 3200 },
    { hour: '18:00', active: 4500 },
    { hour: '21:00', active: 5200 },
  ];

  // Device stats
  const deviceStats = [
    { device: 'Mobile', users: 58, color: 'bg-blue-500' },
    { device: 'Desktop', users: 30, color: 'bg-purple-500' },
    { device: 'Tablet', users: 8, color: 'bg-green-500' },
    { device: 'Smart TV', users: 4, color: 'bg-orange-500' }
  ];

  // Categories performance
  const categoryPerformance = [
    { name: 'Hành động', movies: 456, views: 890000, growth: 15.2 },
    { name: 'Tình cảm', movies: 342, views: 675000, growth: 8.5 },
    { name: 'Kinh dị', movies: 289, views: 560000, growth: 22.1 },
    { name: 'Hài hước', movies: 267, views: 520000, growth: -5.3 },
    { name: 'Khoa học', movies: 234, views: 480000, growth: 18.7 }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ratingData, favoriteData] = await Promise.all([
          get_topRatting(),
          get_topFavorite()
        ]);
        setTopRatting(ratingData);
        setTopFavorite(favoriteData);
        const data1 = await getTop5_phim_nhieu_luot_xem ();
        setTop5movieview(data1);
        console.log(data1);
        
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);
  };

  const formatNumber = (value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Thống Kê</h1>
              <p className="mt-2 text-gray-600">Xin chào Admin! Đây là tổng quan hệ thống hôm nay.</p>
            </div>
            <div className="mt-4 lg:mt-0 flex items-center gap-3">
              {/* Period Selector */}
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="today">Hôm nay</option>
                <option value="7days">7 ngày qua</option>
                <option value="30days">30 ngày qua</option>
                <option value="12months">12 tháng</option>
              </select>

              {/* Refresh Button */}
              <button className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                <ArrowPathIcon className="h-5 w-5 text-gray-600" />
              </button>

              {/* Export Button */}
              <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg transition-all">
                Xuất báo cáo
              </button>
            </div>
          </div>
        </div>


        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Biểu đồ thống kê doanh thu */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
            <DoanhThuChart />

            
          </div>

          {/* Top favorite */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Top yêu thích</h2>

            {/* Horizontal Bar Chart - Simple CSS */}
            {topFavorite && (
              <div className="space-y-3">
                {topFavorite.map((item, index) => {
                  const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500', 'bg-teal-500', 'bg-cyan-500'];
                  const maxFavorite = Math.max(...topFavorite.map(p => p.so_luot_yeu_thich));
                  const percentage = (item.so_luot_yeu_thich / maxFavorite) * 100;

                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded ${colors[index]}`}></div>
                          <span className="text-gray-600 font-medium">{index + 1}. {item.ten}</span>
                        </div>
                        <span className="font-semibold text-gray-900">{item.so_luot_yeu_thich.toLocaleString('vi-VN')} lượt thích</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full ${colors[index]} rounded-full transition-all duration-500 hover:opacity-80`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          


        </div>
                  {/* Top Movies & Device Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Top Movies Table */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Top phim xem nhiều</h2>
                  
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tên phim
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Lượt xem
                      </th>
                      
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {top5movieview.map((movie, index) => (
                      <tr key={movie.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className={`text-lg font-bold `}>
                              #{index + 1}
                            </span>
                            
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className=''>
                            <p className="text-sm font-medium text-gray-900">{movie.ten}</p>
                            <img src={`http://localhost:5273/upload/anhdaidien/${movie.anh_dai_dien}`} alt={movie.ten} className="w-16 h-24 object-cover rounded" />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <EyeIcon className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-900">{formatNumber(movie.luotxem)}</span>
                          </div>
                        </td>
                        
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top ratting */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Top rating</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setRatingView('cao')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${ratingView === 'cao'
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    Cao nhất
                  </button>
                  <button
                    onClick={() => setRatingView('thap')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${ratingView === 'thap'
                        ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    Thấp nhất
                  </button>
                </div>
              </div>

              {/* Pie Chart Top Rating */}
              {topRatting && (
                <div className="mt-4">
                  <div className="h-64 mb-4">
                    <Pie
                      data={{
                        labels: topRatting[ratingView].map(item => item.ten),
                        datasets: [{
                          label: 'Điểm rating trung bình',
                          data: topRatting[ratingView].map(item => parseFloat(item.diem_tb)),
                          backgroundColor: [
                            '#3B82F6',
                            '#10B981',
                            '#F59E0B',
                            '#EF4444',
                            '#8B5CF6'
                          ],
                          borderColor: '#ffffff',
                          borderWidth: 2
                        }]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom',
                            labels: {
                              padding: 15,
                              font: {
                                size: 11
                              },
                              generateLabels: function (chart) {
                                const data = chart.data;
                                if (data.labels.length && data.datasets.length) {
                                  const dataset = data.datasets[0];
                                  const total = dataset.data.reduce((a, b) => a + b, 0);
                                  return data.labels.map((label, i) => {
                                    const value = dataset.data[i];
                                    const percentage = ((value / total) * 100).toFixed(1);
                                    return {
                                      text: `${label.substring(0, 15)}${label.length > 15 ? '...' : ''} (${percentage}%)`,
                                      fillStyle: dataset.backgroundColor[i],
                                      hidden: false,
                                      index: i
                                    };
                                  });
                                }
                                return [];
                              }
                            }
                          },
                          tooltip: {
                            callbacks: {
                              label: function (context) {
                                const item = topRatting[ratingView][context.dataIndex];
                                return `${context.label}: ${context.parsed.toFixed(2)} sao (${item.so_luot} lượt)`;
                              }
                            }
                          }
                        }
                      }}
                    />
                  </div>

                  {/* Legend */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-700">
                      Top 5 phim rating {ratingView === 'cao' ? 'cao nhất' : 'thấp nhất'}:
                    </h3>
                    {topRatting[ratingView].map((item, index) => {
                      const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500'];
                      return (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded ${colors[index]}`}></div>
                            <span className="text-gray-600">{index + 1}. {item.ten}</span>
                          </div>
                          <span className="font-medium text-gray-900">{parseFloat(item.diem_tb).toFixed(2)} sao ({item.so_luot} lượt)</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
      </div>
    </div>
  );
}