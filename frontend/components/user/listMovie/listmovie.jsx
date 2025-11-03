"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IMAGE_URL } from '@/config/config';
import MovieFilter from '../Filter/filter';
import {
  MagnifyingGlassIcon,
  FilmIcon,
  UserIcon,
  StarIcon,
  CalendarDaysIcon,
  PlayCircleIcon,
  HeartIcon,
  BookmarkIcon,
  EyeIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import {
  StarIcon as StarIconSolid,
  HeartIcon as HeartIconSolid,
  BookmarkIcon as BookmarkIconSolid
} from '@heroicons/react/24/solid';

const MovieList = ({ movies = [], actors = [], search = false, searchQuery = '' }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('movies');
  const [savedMovies, setSavedMovies] = useState([]);
  const [likedMovies, setLikedMovies] = useState([]);

  // Mock data for actors (nếu cần test)
  const mockActors = actors.length > 0 ? actors : [
    { id: 1, ten: 'Tom Cruise', anh_dai_dien: 'actor1.jpg', so_phim: 45, quoc_tich: 'Mỹ' },
    { id: 2, ten: 'Scarlett Johansson', anh_dai_dien: 'actor2.jpg', so_phim: 38, quoc_tich: 'Mỹ' },
    { id: 3, ten: 'Robert Downey Jr.', anh_dai_dien: 'actor3.jpg', so_phim: 52, quoc_tich: 'Mỹ' },
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Search Mode UI */}
        {search === true ? (
          <div className="page-container mb-8">
            {/* Search Header */}
            <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-red-500/20 rounded-xl">
                    <MagnifyingGlassIcon className="h-6 w-6 text-red-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Kết quả tìm kiếm</h2>
                    {searchQuery && (
                      <p className="text-gray-400 mt-1">
                        Từ khóa: <span className="text-red-400 font-semibold">"{searchQuery}"</span>
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span className="px-3 py-1 bg-gray-800 rounded-full">
                    {activeTab === 'movies' ? movies.length : actors.length} kết quả
                  </span>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="flex gap-2 p-1">
                <button
                  onClick={() => setActiveTab('movies')}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    activeTab === 'movies'
                      ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  <FilmIcon className="h-5 w-5" />
                  <span>Phim</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    activeTab === 'movies' 
                      ? 'bg-white/20 text-white' 
                      : 'bg-gray-700 text-gray-400'
                  }`}>
                    {movies.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('actors')}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    activeTab === 'actors'
                      ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  <UserIcon className="h-5 w-5" />
                  <span>Diễn viên</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    activeTab === 'actors' 
                      ? 'bg-white/20 text-white' 
                      : 'bg-gray-700 text-gray-400'
                  }`}>
                    {mockActors.length}
                  </span>
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'movies' ? (
              // Movies Grid
              <div>
                {movies.length === 0 ? (
                  <div className="text-center py-16 bg-gray-900/50 rounded-2xl border border-gray-800">
                    <FilmIcon className="h-20 w-20 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2 text-gray-300">Không tìm thấy phim nào</h3>
                    <p className="text-gray-500 mb-6">Thử tìm kiếm với từ khóa khác</p>
                    <button
                      onClick={() => window.history.back()}
                      className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      Quay lại
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {movies.map(movie => (
                      <div
                        key={movie.id}
                        className="relative group cursor-pointer"
                        onClick={() => router.push(`/movie?id=${movie.id}`)}
                      >
                        <div className="relative overflow-hidden rounded-xl bg-gray-900 border border-gray-800 group-hover:border-red-500 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-red-500/20">
                          {/* Poster */}
                          <div className="relative aspect-[3/4] overflow-hidden">
                            <img
                              src={`${IMAGE_URL}/${movie.anh_dai_dien}`}
                              alt={movie.ten}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            
                            {/* Overlay with actions */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                              {/* Play button */}
                              <div className="absolute inset-0 flex items-center justify-center">
                                <PlayCircleIcon className="h-16 w-16 text-white/90 transform scale-0 group-hover:scale-100 transition-transform duration-300" />
                              </div>

                              
                            </div>

                            {/* Quality badge */}
                            <div className="absolute top-2 left-2">
                              <span className="px-2 py-1 bg-red-600/90 backdrop-blur-sm text-white text-xs font-bold rounded">
                                HD
                              </span>
                            </div>

                            {/* Views */}
                            {movie.luot_xem && (
                              <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-1 bg-black/70 backdrop-blur-sm rounded text-xs text-gray-300">
                                <EyeIcon className="h-3 w-3" />
                                {movie.luot_xem}
                              </div>
                            )}
                          </div>

                          {/* Title */}
                          <div className="p-3">
                            <h3 className="text-white font-semibold text-sm line-clamp-1 group-hover:text-red-400 transition-colors">
                              {movie.ten}
                            </h3>
                            <p className="text-gray-500 text-xs mt-1 line-clamp-1">
                              {movie.ten_tieng_anh}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // Actors Grid
              <div>
                {actors.length === 0 ? (
                  <div className="text-center py-16 bg-gray-900/50 rounded-2xl border border-gray-800">
                    <UserIcon className="h-20 w-20 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2 text-gray-300">Không tìm thấy diễn viên nào</h3>
                    <p className="text-gray-500 mb-6">Thử tìm kiếm với từ khóa khác</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {actors.map(actor => (
                      <div
                        key={actor.id}
                        className="group cursor-pointer"
                        onClick={() => router.push(`/actor/${actor.id}`)}
                      >
                        <div className="relative overflow-hidden rounded-xl bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-800 group-hover:border-red-500 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-red-500/20">
                          {/* Actor Photo */}
                          <div className="relative aspect-square overflow-hidden">
                            <img
                              src={`${actor.anh}`}
                              alt={actor.ten}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
                              }}
                            />
                            
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            

                          </div>

                          {/* Actor Name */}
                          <div className="p-4 text-center">
                            <h3 className="text-white font-semibold group-hover:text-red-400 transition-colors">
                              {actor.ten}
                            </h3>
                          
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          // Normal Mode (without search)
          <>
            <MovieFilter />
            
            {movies.length === 0 ? (
              <div className="text-center py-16 bg-gray-900/50 rounded-2xl border border-gray-800">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-300">Không tìm thấy phim nào</h3>
                <button
                  onClick={() => window.history.back()}
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Quay lại
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
                {movies.map(movie => (
                  <div
                    key={movie.id}
                    className="relative group cursor-pointer"
                    onClick={() => router.push(`/movie?id=${movie.id}`)}
                  >
                    <div className="relative overflow-hidden rounded-xl bg-gray-900 border border-gray-800 group-hover:border-red-500 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-red-500/20">
                      <div className="relative aspect-[3/4] overflow-hidden">
                        <img
                          src={`${IMAGE_URL}/${movie.anh_dai_dien}`}
                          alt={movie.ten}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <PlayCircleIcon className="h-16 w-16 text-white/90 transform scale-0 group-hover:scale-100 transition-transform duration-300" />
                          </div>
                        </div>

                        <div className="absolute top-2 left-2">
                          <span className="px-2 py-1 bg-red-600/90 backdrop-blur-sm text-white text-xs font-bold rounded">
                            HD
                          </span>
                        </div>
                      </div>

                      <div className="p-3">
                        <h3 className="text-white font-semibold text-sm line-clamp-1 group-hover:text-red-400 transition-colors">
                          {movie.ten}
                        </h3>
                        <p className="text-gray-500 text-xs mt-1 line-clamp-1">
                          {movie.ten_tieng_anh}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MovieList;