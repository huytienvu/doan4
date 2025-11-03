"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
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

export default function ActorPage({ actorId }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');
  const [isFollowing, setIsFollowing] = useState(false);
  const [savedMovies, setSavedMovies] = useState([]);
  const [likedMovies, setLikedMovies] = useState([]);

  // Mock data - thay bằng API call thực tế
  const actorInfo = {
    id: 1,
    name: 'Robert Downey Jr.',
    englishName: 'Robert John Downey Jr.',
    avatar: 'https://via.placeholder.com/400x600',
    birthDate: '4 tháng 4, 1965',
    birthPlace: 'Manhattan, New York, Mỹ',
    nationality: 'Mỹ',
    height: '174 cm',
    profession: 'Diễn viên, Nhà sản xuất',
    yearsActive: '1970 - nay',
    totalMovies: 95,
    awards: 42,
    rating: 4.8,
    followers: 125000,
    viewCount: 5680000,
    bio: 'Robert John Downey Jr. là một diễn viên và nhà sản xuất phim người Mỹ. Ông nổi tiếng với vai Tony Stark / Iron Man trong Vũ trụ Điện ảnh Marvel, và được coi là một trong những diễn viên có doanh thu phòng vé cao nhất mọi thời đại.',
    socialMedia: {
      instagram: '@robertdowneyjr',
      twitter: '@RobertDowneyJr',
      facebook: 'robertdowneyjr'
    }
  };

  const movies = [
    {
      id: 1,
      title: 'Avengers: Endgame',
      englishTitle: 'Avengers: Endgame',
      poster: 'https://via.placeholder.com/300x450',
      year: 2019,
      role: 'Tony Stark / Iron Man',
      rating: 4.9,
      views: 2800000,
      duration: 181,
      quality: '4K',
      type: 'movie'
    },
    {
      id: 2,
      title: 'Iron Man',
      englishTitle: 'Iron Man',
      poster: 'https://via.placeholder.com/300x450',
      year: 2008,
      role: 'Tony Stark / Iron Man',
      rating: 4.7,
      views: 1500000,
      duration: 126,
      quality: 'HD',
      type: 'movie'
    },
    {
      id: 3,
      title: 'Sherlock Holmes',
      englishTitle: 'Sherlock Holmes',
      poster: 'https://via.placeholder.com/300x450',
      year: 2009,
      role: 'Sherlock Holmes',
      rating: 4.5,
      views: 980000,
      duration: 128,
      quality: 'FHD',
      type: 'movie'
    },
    {
      id: 4,
      title: 'Oppenheimer',
      englishTitle: 'Oppenheimer',
      poster: 'https://via.placeholder.com/300x450',
      year: 2023,
      role: 'Lewis Strauss',
      rating: 4.8,
      views: 1200000,
      duration: 180,
      quality: '4K',
      type: 'movie'
    },
    // Add more movies...
  ];

  const awards = [
    { year: 2024, name: 'Oscar', category: 'Nam diễn viên phụ xuất sắc', movie: 'Oppenheimer' },
    { year: 2020, name: 'Saturn Award', category: 'Nam diễn viên chính xuất sắc', movie: 'Avengers: Endgame' },
    { year: 2010, name: 'Golden Globe', category: 'Nam diễn viên chính xuất sắc', movie: 'Sherlock Holmes' },
  ];

  const stats = [
    { label: 'Phim', value: actorInfo.totalMovies, icon: FilmIcon, color: 'from-blue-500 to-cyan-500' },
    { label: 'Giải thưởng', value: actorInfo.awards, icon: TrophyIcon, color: 'from-yellow-500 to-orange-500' },
    { label: 'Đánh giá', value: actorInfo.rating, icon: StarIcon, color: 'from-purple-500 to-pink-500' },
    { label: 'Người theo dõi', value: `${(actorInfo.followers / 1000).toFixed(0)}K`, icon: UserGroupIcon, color: 'from-green-500 to-emerald-500' },
  ];

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
    : activeTab === 'recent'
    ? movies.filter(m => m.year >= 2020)
    : activeTab === 'popular'
    ? [...movies].sort((a, b) => b.views - a.views).slice(0, 6)
    : movies;

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
                    fill
                    className="object-cover"
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
                    <button className="text-blue-400 text-sm mt-2 hover:text-blue-300">
                      Xem thêm →
                    </button>
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

              {/* Awards */}
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-6">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <TrophyIcon className="h-5 w-5 text-yellow-400" />
                  Giải thưởng nổi bật
                </h3>
                <div className="space-y-3">
                  {awards.slice(0, 3).map((award, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="p-2 bg-yellow-500/20 rounded-lg mt-1">
                        <TrophyIcon className="h-4 w-4 text-yellow-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">{award.name} - {award.year}</p>
                        <p className="text-xs text-gray-400">{award.category}</p>
                        <p className="text-xs text-blue-400 mt-1">{award.movie}</p>
                      </div>
                    </div>
                  ))}
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
                  <span>{movies.length} phim</span>
                </div>
              </div>

              <div className="flex gap-2 p-1 bg-gray-800/50 rounded-xl">
                {[
                  { id: 'all', label: 'Tất cả', icon: FilmIcon },
                  { id: 'recent', label: 'Mới nhất', icon: SparklesIcon },
                  { id: 'popular', label: 'Phổ biến', icon: FireIcon }
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
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Movies Grid */}
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
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                        {/* Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <PlayCircleIcon className="h-16 w-16 text-white/90 transform scale-0 group-hover:scale-100 transition-transform duration-300" />
                        </div>
                        
                        {/* Actions */}
                        <div className="absolute top-2 right-2 flex flex-col gap-2">
                          <button
                            onClick={(e) => handleSaveMovie(e, movie.id)}
                            className="p-2 bg-black/50 backdrop-blur-sm rounded-lg hover:bg-black/70 transition-colors"
                          >
                            {savedMovies.includes(movie.id) ? (
                              <BookmarkIconSolid className="h-5 w-5 text-blue-500" />
                            ) : (
                              <BookmarkIcon className="h-5 w-5 text-white" />
                            )}
                          </button>
                          <button
                            onClick={(e) => handleLikeMovie(e, movie.id)}
                            className="p-2 bg-black/50 backdrop-blur-sm rounded-lg hover:bg-black/70 transition-colors"
                          >
                            {likedMovies.includes(movie.id) ? (
                              <HeartIconSolid className="h-5 w-5 text-red-500" />
                            ) : (
                              <HeartIcon className="h-5 w-5 text-white" />
                            )}
                          </button>
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
                            <span>•</span>
                            <span>{movie.duration} phút</span>
                          </div>
                        </div>
                      </div>

                      {/* Quality Badge */}
                      <div className="absolute top-2 left-2">
                        <span className="px-2 py-1 bg-red-600/90 backdrop-blur-sm text-white text-xs font-bold rounded">
                          {movie.quality}
                        </span>
                      </div>

                      {/* Views */}
                      <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-1 bg-black/70 backdrop-blur-sm rounded text-xs text-gray-300">
                        <EyeIcon className="h-3 w-3" />
                        {(movie.views / 1000000).toFixed(1)}M
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
                        <p className="text-xs text-gray-400">Vai: {movie.role}</p>
                        <span className="text-xs text-gray-500">{movie.year}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            <div className="mt-8 text-center">
              <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300">
                Xem thêm phim
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}