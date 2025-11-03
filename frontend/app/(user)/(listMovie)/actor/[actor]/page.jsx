"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { GetphimbyActor } from '@/services/actor'; // Import API
import {
  CalendarDaysIcon,
  MapPinIcon,
  FilmIcon,
  StarIcon,
  TrophyIcon,
  HeartIcon,
  ShareIcon,
  PlayCircleIcon,
  EyeIcon,
  ClockIcon,
  GlobeAltIcon,
  UserGroupIcon,
  SparklesIcon,
  FireIcon,
  ChevronRightIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline';
import {
  StarIcon as StarIconSolid,
  HeartIcon as HeartIconSolid,
  BookmarkIcon as BookmarkIconSolid
} from '@heroicons/react/24/solid';

export default function ActorPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.actor;
  
  const [activeTab, setActiveTab] = useState('all');
  const [isFollowing, setIsFollowing] = useState(false);
  const [savedMovies, setSavedMovies] = useState([]);
  const [likedMovies, setLikedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State cho data từ API
  const [actorInfo, setActorInfo] = useState(null);
  const [movies, setMovies] = useState([]);
  const [totalMovies, setTotalMovies] = useState(0);

  // Fetch data từ API
  useEffect(() => {
    const fetchActorData = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const response = await GetphimbyActor(id);
        console.log('Actor data:', response);
        
        // Set actor info
        if (response.dienvien) {
          setActorInfo({
            id: response.dienvien.id,
            name: response.dienvien.ten || 'Đang cập nhật',
            englishName: 'Đang cập nhật',
            avatar: response.dienvien.anh || 'https://via.placeholder.com/400x600',
            birthDate: 'Đang cập nhật',
            birthPlace: 'Đang cập nhật', 
            nationality: 'Đang cập nhật',
            height: 'Đang cập nhật',
            profession: 'Diễn viên',
            yearsActive: 'Đang cập nhật',
            totalMovies: response.total || 0,
            awards: 'Đang cập nhật',
            rating: 4.5,
            followers: Math.floor(Math.random() * 100000) + 10000,
            viewCount: Math.floor(Math.random() * 1000000) + 100000,
            bio: 'Thông tin tiểu sử đang được cập nhật...',
            status: response.dienvien.status
          });
        }
        
        // Set movies
        if (response.phim && Array.isArray(response.phim)) {
          const mappedMovies = response.phim.map((movie, index) => ({
            id: movie.id,
            title: movie.ten || 'Đang cập nhật',
            englishTitle: movie.ten_tieng_anh || 'Updating...',
            poster: movie.anh_dai_dien 
              ? `http://localhost:5273/upload/anhdaidien/${movie.anh_dai_dien}`
              : 'https://via.placeholder.com/300x450',
            year: movie.ngay_phat_hanh,
            role: 'Đang cập nhật',
            rating: (Math.random() * 2 + 3).toFixed(1), // Random 3.0 - 5.0
            views: movie.luotxem || 0,
            duration: movie.thoi_luong || 0,
            quality: 'HD',
            type: movie.loai === 'bo' ? 'series' : 'movie',
            loai: movie.loai
          }));
          setMovies(mappedMovies);
        }
        
        setTotalMovies(response.total || 0);
      } catch (error) {
        console.error('Error fetching actor data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActorData();
  }, [id]);

  const handleSaveMovie = (e, movieId) => {
    e.stopPropagation();
    setSavedMovies(prev => 
      prev.includes(movieId) 
        ? prev.filter(id => id !== movieId)
        : [...prev, movieId]
    );
  };

  const handleLikeMovie = (e, movieId) => {
    e.stopPropagation();
    setLikedMovies(prev => 
      prev.includes(movieId) 
        ? prev.filter(id => id !== movieId)
        : [...prev, movieId]
    );
  };

  const filteredMovies = activeTab === 'all' 
    ? movies 
    : activeTab === 'series'
    ? movies.filter(m => m.type === 'series')
    : activeTab === 'movie'
    ? movies.filter(m => m.type === 'movie')
    : movies;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600 mx-auto"></div>
          <p className="text-white mt-4">Đang tải thông tin diễn viên...</p>
        </div>
      </div>
    );
  }

  // No data state
  if (!actorInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white">Không tìm thấy thông tin diễn viên</p>
          <button 
            onClick={() => router.back()}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Phim', value: actorInfo.totalMovies, icon: FilmIcon, color: 'from-blue-500 to-cyan-500' },
    { label: 'Đánh giá', value: actorInfo.rating, icon: StarIcon, color: 'from-purple-500 to-pink-500' },
    { label: 'Người theo dõi', value: actorInfo.followers > 1000 ? `${(actorInfo.followers / 1000).toFixed(0)}K` : actorInfo.followers, icon: UserGroupIcon, color: 'from-green-500 to-emerald-500' },
  ];

  return (
    <div className="min-h-screen page-container bg-gradient-to-b from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sidebar - Actor Info */}
          <div className="lg:col-span-4">
            <div className="sticky top-4 space-y-6">
              {/* Actor Card */}
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 overflow-hidden">
                {/* Cover Image */}
                <div className="relative h-96 bg-gradient-to-b from-transparent to-gray-900">
                  <img
                    src={actorInfo.avatar}
                    alt={actorInfo.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x600';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                  
                  {/* Follow Button */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button 
                      onClick={() => setIsFollowing(!isFollowing)}
                      className="p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors"
                    >
                      {isFollowing ? (
                        <HeartIconSolid className="h-6 w-6 text-red-500" />
                      ) : (
                        <HeartIcon className="h-6 w-6 text-white" />
                      )}
                    </button>
                    <button className="p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors">
                      <ShareIcon className="h-6 w-6 text-white" />
                    </button>
                  </div>

                  {/* Status Badge */}
                  {actorInfo.status && (
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-lg text-xs font-semibold backdrop-blur-sm ${
                        actorInfo.status === 'Hiển thị' 
                          ? 'bg-green-500/80 text-white' 
                          : 'bg-gray-500/80 text-white'
                      }`}>
                        {actorInfo.status}
                      </span>
                    </div>
                  )}

                  {/* Name Overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h1 className="text-3xl font-bold text-white mb-1">{actorInfo.name}</h1>
                    <p className="text-gray-300 text-sm">{actorInfo.englishName}</p>
                  </div>
                </div>

                {/* Actor Details */}
                <div className="p-6 space-y-4">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    {stats.map((stat, index) => {
                      const Icon = stat.icon;
                      return (
                        <div key={index} className="bg-gray-800/50 rounded-xl p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <div className={`p-1.5 rounded-lg bg-gradient-to-r ${stat.color}`}>
                              <Icon className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-2xl font-bold text-white">{stat.value}</span>
                          </div>
                          <p className="text-xs text-gray-400">{stat.label}</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Bio */}
                  <div>
                    <h3 className="text-white font-semibold mb-2">Tiểu sử</h3>
                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-4">
                      {actorInfo.bio}
                    </p>
                  </div>

                  {/* Personal Info */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CalendarDaysIcon className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Ngày sinh</p>
                        <p className="text-sm text-gray-300">{actorInfo.birthDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPinIcon className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Nơi sinh</p>
                        <p className="text-sm text-gray-300">{actorInfo.birthPlace}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <GlobeAltIcon className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Quốc tịch</p>
                        <p className="text-sm text-gray-300">{actorInfo.nationality}</p>
                      </div>
                    </div>
                  </div>

                  {/* Follow Button Full Width */}
                  <button
                    onClick={() => setIsFollowing(!isFollowing)}
                    className={`w-full py-3 rounded-xl font-semibold transition-all ${
                      isFollowing 
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg'
                    }`}
                  >
                    {isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Movies */}
          <div className="lg:col-span-8">
            {/* Tabs */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Phim tham gia</h2>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <FilmIcon className="h-5 w-5" />
                  <span>{totalMovies} phim</span>
                </div>
              </div>

              <div className="flex gap-2 p-1 bg-gray-800/50 rounded-xl">
                {[
                  { id: 'all', label: 'Tất cả', icon: FilmIcon, count: movies.length },
                  { id: 'movie', label: 'Phim lẻ', icon: SparklesIcon, count: movies.filter(m => m.type === 'movie').length },
                  { id: 'series', label: 'Phim bộ', icon: FireIcon, count: movies.filter(m => m.type === 'series').length }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                          : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                      <span className="text-xs">({tab.count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Movies Grid */}
            {filteredMovies.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filteredMovies.map((movie) => (
                  <div
                    key={movie.id}
                    className="group cursor-pointer"
                    onClick={() => router.push(`/movie?id=${movie.id}`)}
                  >
                    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden hover:border-gray-700 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10">
                      {/* Poster */}
                      <div className="relative aspect-[2/3] overflow-hidden">
                        <img
                          src={movie.poster}
                          alt={movie.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/300x450';
                          }}
                        />
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                          {/* Play Button */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <PlayCircleIcon className="h-16 w-16 text-white/90 transform scale-0 group-hover:scale-100 transition-transform duration-300" />
                          </div>
                          
                          {/* Movie Info on Hover */}
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <p className="text-white font-semibold mb-1">{movie.role}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-300">
                              <span className="flex items-center gap-1">
                                <StarIconSolid className="h-3.5 w-3.5 text-yellow-400" />
                                {movie.rating}
                              </span>
                              <span>•</span>
                              <span>{movie.year}</span>
                              {movie.duration > 0 && (
                                <>
                                  <span>•</span>
                                  <span>{movie.duration} phút</span>
                                </>
                              )}
                              <EyeIcon className="h-3 w-3" />
                              {movie.views.toLocaleString()} lượt xem
                            </div>
                          </div>
                        </div>

                        {/* Type Badge */}
                        <div className="absolute top-2 left-2 flex gap-2">
                          <span className={`px-2 py-1 backdrop-blur-sm text-white text-xs font-bold rounded ${
                            movie.loai === 'bo' 
                              ? 'bg-purple-600/90' 
                              : 'bg-blue-600/90'
                          }`}>
                            {movie.loai === 'bo' ? 'Phim bộ' : 'Phim lẻ'}
                          </span>
                          <span className="px-2 py-1 bg-red-600/90 backdrop-blur-sm text-white text-xs font-bold rounded">
                            {movie.quality}
                          </span>
                        </div>

                        
                      </div>

                      {/* Movie Info */}
                      <div className="p-4">
                        <h3 className="text-white font-semibold line-clamp-1 group-hover:text-blue-400 transition-colors">
                          {movie.title}
                        </h3>
                        <p className="text-gray-500 text-xs mt-1 line-clamp-1">
                          {movie.englishTitle}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs text-gray-400">Năm: {movie.year}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-900/50 rounded-2xl border border-gray-800">
                <FilmIcon className="h-20 w-20 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">Không có phim nào</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}