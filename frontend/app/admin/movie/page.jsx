"use client"
import React, { useEffect, useState, useRef } from 'react';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  FilmIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlayCircleIcon,
  EyeIcon,
  StarIcon,
  UserIcon,
  TagIcon,
  CloudArrowUpIcon,
  DocumentTextIcon,
  PhotoIcon,
  PlayIcon
} from '@heroicons/react/24/outline';
import {
  LockClosedIcon,
  LockOpenIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { getListMovie, getMoviebyId, CreateMovie, UpdateMovie, StateMovie } from '../../../services/admin/movie';
import { getAllCategory } from '../../../services/category';
import { getAllActor } from '../../../services/actor';
import { getAllCountry } from '../../../services/quocgia';
import { APIUploadImage, APIUploadVideo } from '../../../services/upload';

const MovieAdminInterface = () => {
  const [phim, setPhim] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [activeTab, setActiveTab] = useState('info');

  // Form data
  const [currentMovie, setCurrentMovie] = useState({
    title: '',
    tentienganh: '',
    daodien: '',
    mota: '',
    type: 'single',
    genres: [],
    actors: [],
    releaseYear: new Date().getFullYear(),
    duration: 0,
    poster: '',
    video_url: '',
    country: '',
    episodes: []
  });

  // Selected IDs for API
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [selectedActorIds, setSelectedActorIds] = useState([]);

  // Options from API
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [actorOptions, setActorOptions] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);

  // Search states for dropdowns
  const [categorySearch, setCategorySearch] = useState('');
  const [actorSearch, setActorSearch] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showActorDropdown, setShowActorDropdown] = useState(false);

  // Upload states
  const [uploadingPoster, setUploadingPoster] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  // Refs for click outside
  const categoryDropdownRef = useRef(null);
  const actorDropdownRef = useRef(null);

  // Fetch movies
  const fetchMovies = async () => {
    try {
      const movies = await getListMovie();
      setPhim(Array.isArray(movies) ? movies : []);
    } catch (e) {
      console.error(e);
      setPhim([]);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  // Load options when modal opens
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [cats, acts, couns] = await Promise.all([
          getAllCategory(),
          getAllActor(),
          getAllCountry(),
        ]);
        setCategoryOptions(Array.isArray(cats) ? cats : []);
        setActorOptions(Array.isArray(acts) ? acts : []);
        setCountryOptions(Array.isArray(couns) ? couns : []);
      } catch (e) {
        console.error(e);
      }
    };
    if (isModalOpen) {
      loadOptions();
    }
  }, [isModalOpen]);

  // Click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setShowCategoryDropdown(false);
      }
      if (actorDropdownRef.current && !actorDropdownRef.current.contains(event.target)) {
        setShowActorDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter categories for dropdown
  const filteredCategories = categoryOptions.filter(cat =>
    cat && cat.ten &&
    cat.ten.toLowerCase().includes(categorySearch.toLowerCase()) &&
    !selectedCategoryIds.includes(cat.id)
  );

  // Filter actors for dropdown
  const filteredActors = actorOptions.filter(actor =>
    actor && actor.ten &&
    actor.ten.toLowerCase().includes(actorSearch.toLowerCase()) &&
    !selectedActorIds.includes(actor.id)
  );

  // Filter movies for display
  const filteredMovies = phim.filter(movie => {
    const matchSearch = movie.ten?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const matchType = filterType === 'all' ||
      (filterType === 'single' && movie.loai === 'le') ||
      (filterType === 'series' && movie.loai === 'bo');
    return matchSearch && matchType;
  });

  // Handle upload poster
  const handleUploadPoster = async (file) => {
    if (!file) return;
    setUploadingPoster(true);
    try {
      const res = await APIUploadImage(file);
      const url = res?.url || '';
      const filename = url.split('/').pop() || '';
      setCurrentMovie({ ...currentMovie, poster: filename });
    } catch (e) {
      console.error(e);
      alert('Upload ảnh thất bại');
    } finally {
      setUploadingPoster(false);
    }
  };

  // Handle upload video for single movie
  const handleUploadSingleVideo = async (file) => {
    if (!file) return;
    setUploadingVideo(true);
    try {
      const res = await APIUploadVideo(file);
      const url = res?.url || '';
      const filename = url.split('/').pop() || '';
      setCurrentMovie({ ...currentMovie, video_url: filename });
    } catch (e) {
      console.error(e);
      alert('Upload video thất bại');
    } finally {
      setUploadingVideo(false);
    }
  };

  // Handle upload episode video
  const handleUploadEpisodeVideo = async (file, episodeId) => {
    if (!file) return;
    try {
      const res = await APIUploadVideo(file);
      const url = res?.url || '';
      const filename = url.split('/').pop() || '';
      setCurrentMovie(prev => ({
        ...prev,
        episodes: prev.episodes.map(ep =>
          ep.id === episodeId ? { ...ep, video_url: filename } : ep
        )
      }));
    } catch (e) {
      console.error(e);
      alert('Upload video tập thất bại');
    }
  };

  // Add category
  const addCategory = (category) => {
    if (!selectedCategoryIds.includes(category.id)) {
      setSelectedCategoryIds([...selectedCategoryIds, category.id]);
      setCurrentMovie({
        ...currentMovie,
        genres: [...currentMovie.genres, { id: category.id, ten: category.ten }]
      });
    }
    setCategorySearch('');
    setShowCategoryDropdown(false);
  };

  // Remove category
  const removeCategory = (categoryId) => {
    setSelectedCategoryIds(selectedCategoryIds.filter(id => id !== categoryId));
    setCurrentMovie({
      ...currentMovie,
      genres: currentMovie.genres.filter(g => g.id !== categoryId)
    });
  };

  // Add actor
  const addActor = (actor) => {
    if (!selectedActorIds.includes(actor.id)) {
      setSelectedActorIds([...selectedActorIds, actor.id]);
      setCurrentMovie({
        ...currentMovie,
        actors: [...currentMovie.actors, { id: actor.id, ten: actor.ten }]
      });
    }
    setActorSearch('');
    setShowActorDropdown(false);
  };

  // Remove actor
  const removeActor = (actorId) => {
    setSelectedActorIds(selectedActorIds.filter(id => id !== actorId));
    setCurrentMovie({
      ...currentMovie,
      actors: currentMovie.actors.filter(a => a.id !== actorId)
    });
  };

  // Add episode
  const addEpisode = () => {
    const newEpisode = {
      id: Date.now(),
      episode: currentMovie.episodes.length + 1,
      video_url: '',
      duration: 0
    };
    setCurrentMovie({
      ...currentMovie,
      episodes: [...currentMovie.episodes, newEpisode]
    });
  };

  // Remove episode
  const removeEpisode = (episodeId) => {
    setCurrentMovie({
      ...currentMovie,
      episodes: currentMovie.episodes.filter(ep => ep.id !== episodeId)
    });
  };

  // Open add modal
  const openAddModal = () => {
    setCurrentMovie({
      title: '',
      tentienganh: '',
      daodien: '',
      mota: '',
      type: 'single',
      genres: [],
      actors: [],
      releaseYear: new Date().getFullYear(),
      duration: 0,
      poster: '',
      video_url: '',
      country: '',
      episodes: []
    });
    setSelectedCategoryIds([]);
    setSelectedActorIds([]);
    setEditingMovie(null);
    setActiveTab('info');
    setIsModalOpen(true);
  };

  // Open edit modal
  const openEditModal = async (movieId) => {
    try {
      setIsModalOpen(true);
      setEditingMovie(movieId);
      const res = await getMoviebyId(movieId);
      const detail = Array.isArray(res?.phim) ? res.phim[0] : res;

      // Map API data to form
      const genres = Array.isArray(detail?.theloai) ? detail.theloai.map(g => ({
        id: g.id,
        ten: typeof g === 'object' ? g.ten : String(g)
      })) : [];

      const actors = Array.isArray(detail?.dienvien) ? detail.dienvien.map(a => ({
        id: a.id,
        ten: typeof a === 'object' ? a.ten : String(a)
      })) : [];

      const episodes = Array.isArray(detail?.tapphim) ? detail.tapphim.map((ep, index) => ({
        id: Date.now() + index,
        episode: ep.so_tap || index + 1,
        video_url: ep.video_url || '',
        duration: 0
      })) : [];

      setCurrentMovie({
        title: detail?.ten || '',
        tentienganh: detail?.ten_tieng_anh || '',
        daodien: detail?.daodien || '',
        mota: detail?.mota || '',
        type: detail?.loai === 'bo' ? 'series' : 'single',
        genres,
        actors,
        releaseYear: detail?.ngay_phat_hanh || new Date().getFullYear(),
        duration: Number(detail?.thoi_luong || 0),
        poster: detail?.anh_dai_dien || '',
        video_url: detail?.video_url || '',
        country: detail?.quocgia || '',
        episodes
      });

      setSelectedCategoryIds(genres.map(g => g.id).filter(Boolean));
      setSelectedActorIds(actors.map(a => a.id).filter(Boolean));
      setActiveTab('info');
    } catch (e) {
      console.error(e);
      alert('Không thể tải thông tin phim');
    }
  };

  // Save movie
  const handleSaveMovie = async () => {
    if (!currentMovie.title.trim()) {
      alert('Vui lòng nhập tên phim!');
      return;
    }

    const loai = currentMovie.type === 'series' ? 'bo' : 'le';
    const payload = {
      ten: currentMovie.title,
      ten_tieng_anh: currentMovie.tentienganh || '',
      mota: currentMovie.mota || '',
      anh_dai_dien: currentMovie.poster || '',
      daodien: currentMovie.daodien || '',
      quocgia: currentMovie.country || '',
      ngay_phat_hanh: currentMovie.releaseYear,
      trang_thai: '',
      loai,
      thoi_luong: loai === 'le' ? (currentMovie.duration || null) : null,
      video_url: loai === 'le' ? (currentMovie.video_url || null) : null,
      nhan_dan: '',
      tap_phim: loai === 'bo'
        ? currentMovie.episodes
          .filter(ep => ep.video_url)
          .map(ep => ({
            so_tap: ep.episode,
            video_url: ep.video_url
          }))
        : [],
      theloai_ids: selectedCategoryIds,
      dienvien_ids: selectedActorIds,
    };

    try {
      if (editingMovie) {
        await UpdateMovie(editingMovie, payload);
      } else {
        await CreateMovie(payload);
      }
      await fetchMovies();
      closeModal();
    } catch (e) {
      console.error(e);
      alert(editingMovie ? 'Cập nhật phim thất bại' : 'Thêm phim thất bại');
    }
  };

  // Delete movie
  const handleDeleteMovie = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phim này?')) {
      alert("Chức năng xóa sẽ được cập nhật");
    }
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMovie(null);
    setCurrentMovie({
      title: '',
      tentienganh: '',
      daodien: '',
      mota: '',
      type: 'single',
      genres: [],
      actors: [],
      releaseYear: new Date().getFullYear(),
      duration: 0,
      poster: '',
      video_url: '',
      country: '',
      episodes: []
    });
    setSelectedCategoryIds([]);
    setSelectedActorIds([]);
    setCategorySearch('');
    setActorSearch('');
    setActiveTab('info');
  };

  const handleToggleStatus = async (movieId, currentStatus) => {
    const newStatus = currentStatus === 'Khóa' || currentStatus === 'khoa' ? 'Hiển thị' : 'Khóa';

    // Hiển thị confirm dialog
    const action = newStatus === 'Khóa' ? 'khóa' : 'mở khóa';
    const confirmed = confirm(`Bạn có chắc chắn muốn ${action} phim này?`);

    if (!confirmed) return;

    try {
      // Call API update status
      // await updateMovieStatus(movieId, newStatus);

      // Update local state
      // setPhim(prevMovies =>
      //   prevMovies.map(movie =>
      //     movie.id === movieId
      //       ? { ...movie, status: newStatus }
      //       : movie
      //   )
      // );
      await StateMovie({
        state : newStatus,
        id : movieId
      })
      await fetchMovies();

      // Show success notification
      alert(`Đã ${action} phim thành công!`);
    } catch (error) {
      console.error('Error updating movie status:', error);
      alert(`Không thể ${action} phim. Vui lòng thử lại!`);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-xl">
                <FilmIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Quản Lý Phim
                </h1>
                <p className="text-gray-500 mt-1">Quản lý kho phim và series của bạn</p>
              </div>
            </div>
            <button
              onClick={openAddModal}
              className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Thêm Phim Mới</span>
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-transparent rounded-xl focus:border-purple-400 focus:outline-none focus:bg-white transition-all duration-200"
                  placeholder="Tìm kiếm phim..."
                />
              </div>
            </div>

            <div className="flex gap-3">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl font-medium text-gray-700 border border-gray-200 focus:outline-none focus:border-purple-400"
              >
                <option value="all">Tất cả</option>
                <option value="single">Phim lẻ</option>
                <option value="series">Phim bộ</option>
              </select>

              <button className="px-5 py-3 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 rounded-xl font-medium text-gray-700 transition-all duration-200 flex items-center space-x-2 border border-gray-200">
                <FunnelIcon className="h-5 w-5" />
                <span>Bộ lọc</span>
              </button>
            </div>
          </div>

          {searchTerm && (
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                Tìm thấy <span className="font-semibold text-purple-600">{filteredMovies.length}</span> phim
              </p>
            </div>
          )}
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMovies.map((movie) => {
            // Giả định movie.trang_thai có thể là 'active' hoặc 'locked'
            const isLocked = movie.status === "Khóa";

            return (
              <div key={movie.id} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200 overflow-hidden group relative">


                {/* Poster */}
                <div className="relative aspect-[2/3] bg-gray-100">
                  <img
                    src={movie.anh_dai_dien ? `http://localhost:5273/upload/anhdaidien/${movie.anh_dai_dien}` : 'https://via.placeholder.com/300x450'}
                    alt={movie.ten}
                    className={`w-full h-full object-cover ${isLocked ? 'opacity-50 grayscale' : ''}`}
                  />

                  {/* Overlay with actions */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-white text-sm mb-1">{movie.ngay_phat_hanh} • {movie.quocgia}</p>
                          <h3 className="text-white text-lg font-bold line-clamp-1">{movie.ten}</h3>
                        </div>
                        <div className="flex space-x-2">
                          {/* Toggle Status Button */}
                          <button
                            onClick={() => handleToggleStatus(movie.id, movie.status)}
                            className={`${isLocked
                              ? 'bg-green-500/80 hover:bg-green-600'
                              : 'bg-yellow-500/80 hover:bg-yellow-600'
                              } backdrop-blur-sm text-white p-2 rounded-lg transition-colors`}
                            title={isLocked ? 'Mở khóa phim' : 'Khóa phim'}
                          >
                            {isLocked ? (
                              <LockOpenIcon className="h-4 w-4" />
                            ) : (
                              <LockClosedIcon className="h-4 w-4" />
                            )}
                          </button>

                          <button
                            onClick={() => openEditModal(movie.id)}
                            className="bg-blue-500/80 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteMovie(movie.id)}
                            className="bg-red-500/80 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge - Top Right */}
                  <div className="absolute top-4 right-4">
                    {isLocked ? (
                      <div className="flex items-center gap-1 px-2 py-1 bg-red-500/90 backdrop-blur-sm text-white text-xs font-semibold rounded-lg shadow-lg">
                        <LockClosedIcon className="h-3 w-3" />
                        <span>Đã khóa</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 px-2 py-1 bg-green-500/90 backdrop-blur-sm text-white text-xs font-semibold rounded-lg shadow-lg">
                        <CheckCircleIcon className="h-3 w-3" />
                        <span>Hiển thị</span>
                      </div>
                    )}
                  </div>

                  {/* Type badge - Top Left */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-lg text-xs font-semibold backdrop-blur-sm ${movie.loai === 'bo'
                      ? 'bg-purple-500/80 text-white'
                      : 'bg-blue-500/80 text-white'
                      }`}>
                      {movie.loai === 'bo' ? 'Phim bộ' : 'Phim lẻ'}
                    </span>
                  </div>

                  {/* View Count - Bottom Left */}
                  {movie.luot_xem && (
                    <div className="absolute bottom-4 left-4">
                      <div className="flex items-center gap-1 px-2 py-1 bg-black/70 backdrop-blur-sm text-white text-xs rounded">
                        <EyeIcon className="h-3 w-3" />
                        <span>{movie.luot_xem.toLocaleString()} lượt xem</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  {/* Status Indicator Bar */}
                  {/* <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${isLocked ? 'bg-red-500' : 'bg-green-500'} animate-pulse`}></div>
                      <span className={`text-xs font-medium ${isLocked ? 'text-red-600' : 'text-green-600'}`}>
                        {isLocked ? 'Không công khai' : 'Đang công khai'}
                      </span>
                    </div>

                  </div> */}

                  {/* Categories */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {(movie.theloai || []).slice(0, 2).map((cat, index) => (
                      <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                        {typeof cat === 'object' ? cat.ten : cat}
                      </span>
                    ))}
                    {(movie.theloai || []).length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{movie.theloai.length - 2}
                      </span>
                    )}
                  </div>

                  <h3 className={`font-bold mb-2 line-clamp-1 ${isLocked ? 'text-gray-500' : 'text-gray-800'}`}>
                    {movie.ten}
                  </h3>

                  {/* Actors */}
                  <p className="text-xs text-gray-500 mb-2 line-clamp-1">
                    {(movie.dienvien || []).slice(0, 2).map(dv =>
                      typeof dv === 'object' ? dv.ten : dv
                    ).join(', ')}
                    {(movie.dienvien || []).length > 2 && ` +${movie.dienvien.length - 2}`}
                  </p>

                  {/* Additional Info */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      {movie.chat_luong && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                          {movie.chat_luong}
                        </span>
                      )}
                      {movie.nam_phat_hanh && (
                        <span className="text-xs text-gray-400">
                          {movie.nam_phat_hanh}
                        </span>
                      )}
                    </div>
                    {movie.thoi_luong && (
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <ClockIcon className="h-3 w-3" />
                        {movie.thoi_luong} phút
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {filteredMovies.length === 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <FilmIcon className="h-20 w-20 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Không tìm thấy phim nào</p>
            <p className="text-gray-400 mt-2">Thử tìm kiếm với từ khóa khác hoặc thêm phim mới</p>
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Tổng phim</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{phim.length}</p>
              </div>
              <FilmIcon className="h-10 w-10 text-purple-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Phim lẻ</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {phim.filter(m => m.loai === 'le').length}
                </p>
              </div>
              <PlayCircleIcon className="h-10 w-10 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-pink-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Phim bộ</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {phim.filter(m => m.loai === 'bo').length}
                </p>
              </div>
              <DocumentTextIcon className="h-10 w-10 text-pink-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Đạo diễn</p>
                <p className="text-xl font-bold text-gray-800 mt-2">
                  {new Set(phim.map(m => m.daodien).filter(Boolean)).size}
                </p>
              </div>
              <UserIcon className="h-10 w-10 text-green-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Modal Add/Edit Movie */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  {editingMovie ? 'Chỉnh Sửa Phim' : 'Thêm Phim Mới'}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 bg-gray-50">
              <div className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('info')}
                  className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'info'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                  Thông tin phim
                </button>
                {currentMovie.type === 'series' && (
                  <button
                    onClick={() => setActiveTab('episodes')}
                    className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'episodes'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    Danh sách tập ({currentMovie.episodes.length})
                  </button>
                )}
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {activeTab === 'info' ? (
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Tên phim <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={currentMovie.title}
                        onChange={(e) => setCurrentMovie({ ...currentMovie, title: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                        placeholder="Nhập tên phim..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Tên tiếng Anh
                      </label>
                      <input
                        type="text"
                        value={currentMovie.tentienganh}
                        onChange={(e) => setCurrentMovie({ ...currentMovie, tentienganh: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                        placeholder="Nhập tên tiếng Anh..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Loại phim <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={currentMovie.type}
                        onChange={(e) => setCurrentMovie({ ...currentMovie, type: e.target.value, episodes: [] })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                      >
                        <option value="single">Phim lẻ</option>
                        <option value="series">Phim bộ</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Quốc gia
                      </label>
                      <select
                        value={currentMovie.country}
                        onChange={(e) => setCurrentMovie({ ...currentMovie, country: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                      >
                        <option value="">Chọn quốc gia</option>
                        {countryOptions.map((c) => (
                          <option key={c.id} value={c.quocgia}>{c.quocgia}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Năm phát hành
                      </label>
                      <input
                        type="number"
                        value={currentMovie.releaseYear}
                        onChange={(e) => setCurrentMovie({ ...currentMovie, releaseYear: parseInt(e.target.value) })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                        min="1900"
                        max="2030"
                      />
                    </div>

                    {currentMovie.type === 'single' && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Thời lượng (phút)
                        </label>
                        <input
                          type="number"
                          value={currentMovie.duration}
                          onChange={(e) => setCurrentMovie({ ...currentMovie, duration: parseInt(e.target.value) || 0 })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                          min="0"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Đạo diễn
                      </label>
                      <input
                        type="text"
                        value={currentMovie.daodien}
                        onChange={(e) => setCurrentMovie({ ...currentMovie, daodien: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                        placeholder="Nhập tên đạo diễn..."
                      />
                    </div>
                  </div>

                  {/* Categories Section */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <TagIcon className="inline h-4 w-4 mr-1" />
                      Thể loại
                    </label>

                    {/* Selected categories */}
                    {currentMovie.genres.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {currentMovie.genres.map((genre) => (
                          <span
                            key={genre.id}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                          >
                            {genre.ten}
                            <button
                              onClick={() => removeCategory(genre.id)}
                              className="hover:bg-purple-200 rounded-full p-0.5"
                            >
                              <XMarkIcon className="h-3.5 w-3.5" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Category search dropdown */}
                    <div className="relative" ref={categoryDropdownRef}>
                      <input
                        type="text"
                        value={categorySearch}
                        onChange={(e) => {
                          setCategorySearch(e.target.value);
                          setShowCategoryDropdown(true);
                        }}
                        onFocus={() => setShowCategoryDropdown(true)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                        placeholder="Tìm kiếm và chọn thể loại..."
                      />

                      {showCategoryDropdown && filteredCategories.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                          {filteredCategories.map((category) => (
                            <button
                              key={category.id}
                              onClick={() => addCategory(category)}
                              className="w-full px-4 py-2 text-left hover:bg-purple-50 hover:text-purple-700 transition-colors flex items-center justify-between group"
                            >
                              <span>{category.ten}</span>
                              <PlusIcon className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actors Section */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <UserIcon className="inline h-4 w-4 mr-1" />
                      Diễn viên
                    </label>

                    {/* Selected actors */}
                    {currentMovie.actors.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {currentMovie.actors.map((actor) => (
                          <span
                            key={actor.id}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                          >
                            {actor.ten}
                            <button
                              onClick={() => removeActor(actor.id)}
                              className="hover:bg-blue-200 rounded-full p-0.5"
                            >
                              <XMarkIcon className="h-3.5 w-3.5" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Actor search dropdown */}
                    <div className="relative" ref={actorDropdownRef}>
                      <input
                        type="text"
                        value={actorSearch}
                        onChange={(e) => {
                          setActorSearch(e.target.value);
                          setShowActorDropdown(true);
                        }}
                        onFocus={() => setShowActorDropdown(true)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                        placeholder="Tìm kiếm và chọn diễn viên..."
                      />

                      {showActorDropdown && filteredActors.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                          {filteredActors.map((actor) => (
                            <button
                              key={actor.id}
                              onClick={() => addActor(actor)}
                              className="w-full px-4 py-2 text-left hover:bg-blue-50 hover:text-blue-700 transition-colors flex items-center justify-between group"
                            >
                              <span>{actor.ten}</span>
                              <PlusIcon className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Upload Files */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <PhotoIcon className="inline h-4 w-4 mr-1" />
                        Poster phim
                      </label>
                      <div className="flex items-center gap-3">
                        <label className="flex-1">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleUploadPoster(e.target.files?.[0])}
                            className="hidden"
                          />
                          <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:border-purple-500 transition-colors">
                            {uploadingPoster ? (
                              <p className="text-gray-500">Đang tải lên...</p>
                            ) : currentMovie.poster ? (
                              <p className="text-green-600">✓ {currentMovie.poster}</p>
                            ) : (
                              <div>
                                <CloudArrowUpIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-500">Nhấn để chọn ảnh</p>
                              </div>
                            )}
                          </div>
                        </label>
                      </div>
                    </div>

                    {currentMovie.type === 'single' && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <PlayCircleIcon className="inline h-4 w-4 mr-1" />
                          Video phim
                        </label>
                        <div className="flex items-center gap-3">
                          <label className="flex-1">
                            <input
                              type="file"
                              accept="video/*"
                              onChange={(e) => handleUploadSingleVideo(e.target.files?.[0])}
                              className="hidden"
                            />
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:border-purple-500 transition-colors">
                              {uploadingVideo ? (
                                <p className="text-gray-500">Đang tải lên...</p>
                              ) : currentMovie.video_url ? (
                                <p className="text-green-600">✓ {currentMovie.video_url}</p>
                              ) : (
                                <div>
                                  <CloudArrowUpIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                  <p className="text-gray-500">Nhấn để chọn video</p>
                                </div>
                              )}
                            </div>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Mô tả
                    </label>
                    <textarea
                      value={currentMovie.mota}
                      onChange={(e) => setCurrentMovie({ ...currentMovie, mota: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none resize-none"
                      rows="4"
                      placeholder="Nhập mô tả phim..."
                    />
                  </div>
                </div>
              ) : (
                /* Episodes Tab */
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Danh sách tập phim</h3>
                    <button
                      onClick={addEpisode}
                      className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
                    >
                      <PlusIcon className="h-4 w-4" />
                      <span>Thêm tập</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {currentMovie.episodes.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 rounded-xl">
                        <PlayIcon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500">Chưa có tập phim nào</p>
                        <p className="text-gray-400 text-sm mt-1">Nhấn "Thêm tập" để bắt đầu</p>
                      </div>
                    ) : (
                      currentMovie.episodes.map((episode) => (
                        <div key={episode.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                          <div className="flex items-center gap-4">
                            <div className="flex-shrink-0">
                              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold">
                                {episode.episode}
                              </span>
                            </div>

                            <div className="flex-1">
                              <label className="block text-xs font-medium text-gray-600 mb-1">Video tập {episode.episode}</label>
                              <div className="flex items-center gap-2">
                                <label className="flex-1">
                                  <input
                                    type="file"
                                    accept="video/*"
                                    onChange={(e) => handleUploadEpisodeVideo(e.target.files?.[0], episode.id)}
                                    className="hidden"
                                  />
                                  <div className="border border-gray-300 rounded-lg px-3 py-2 cursor-pointer hover:border-purple-500 transition-colors">
                                    {episode.video_url ? (
                                      <span className="text-green-600 text-sm">✓ {episode.video_url}</span>
                                    ) : (
                                      <span className="text-gray-400 text-sm">Chọn video...</span>
                                    )}
                                  </div>
                                </label>
                              </div>
                            </div>

                            <button
                              onClick={() => removeEpisode(episode.id)}
                              className="flex-shrink-0 p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveMovie}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                {editingMovie ? 'Cập Nhật' : 'Thêm Mới'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieAdminInterface;