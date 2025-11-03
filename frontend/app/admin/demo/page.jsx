// app/admin/movie/page.jsx
'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  FilmIcon, 
  XMarkIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlayCircleIcon,
  CalendarIcon,
  ClockIcon,
  StarIcon,
  EyeIcon,
  PhotoIcon,
  PlayIcon,
  DocumentTextIcon,
  ChevronDownIcon,
  CheckIcon,
  UserIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

export default function MovieManagement() {
  // Mock data cho danh sách thể loại có sẵn
  const availableCategories = [
    'Hành động', 'Tình cảm', 'Kinh dị', 'Hài hước', 'Khoa học viễn tưởng',
    'Hoạt hình', 'Phiêu lưu', 'Tâm lý', 'Võ thuật', 'Chiến tranh',
    'Hình sự', 'Trinh thám', 'Thần thoại', 'Cổ trang', 'Học đường'
  ];

  // Mock data cho danh sách diễn viên có sẵn
  const availableActors = [
    { id: 1, name: 'Tom Cruise', avatar: 'https://via.placeholder.com/40' },
    { id: 2, name: 'Scarlett Johansson', avatar: 'https://via.placeholder.com/40' },
    { id: 3, name: 'Robert Downey Jr.', avatar: 'https://via.placeholder.com/40' },
    { id: 4, name: 'Chris Evans', avatar: 'https://via.placeholder.com/40' },
    { id: 5, name: 'Jennifer Lawrence', avatar: 'https://via.placeholder.com/40' },
    { id: 6, name: 'Leonardo DiCaprio', avatar: 'https://via.placeholder.com/40' },
    { id: 7, name: 'Brad Pitt', avatar: 'https://via.placeholder.com/40' },
    { id: 8, name: 'Angelina Jolie', avatar: 'https://via.placeholder.com/40' },
    { id: 9, name: 'Will Smith', avatar: 'https://via.placeholder.com/40' },
    { id: 10, name: 'Emma Stone', avatar: 'https://via.placeholder.com/40' },
    { id: 11, name: 'Ryan Gosling', avatar: 'https://via.placeholder.com/40' },
    { id: 12, name: 'Margot Robbie', avatar: 'https://via.placeholder.com/40' },
  ];

  const [movies, setMovies] = useState([
    {
      id: 1,
      title: 'Avatar: The Way of Water',
      type: 'single',
      categories: ['Khoa học viễn tưởng', 'Hành động', 'Phiêu lưu'],
      country: 'Mỹ',
      year: 2022,
      duration: '192 phút',
      rating: 4.5,
      views: 15420,
      status: 'active',
      poster: 'https://via.placeholder.com/300x450',
      description: 'Jake Sully và Neytiri đã thành lập một gia đình và đang làm mọi thứ để ở bên nhau.',
      actors: [
        { id: 1, name: 'Tom Cruise', avatar: 'https://via.placeholder.com/40' },
        { id: 2, name: 'Scarlett Johansson', avatar: 'https://via.placeholder.com/40' }
      ],
      director: 'James Cameron',
      episodes: null
    },
    {
      id: 2,
      title: 'The Last of Us',
      type: 'series',
      categories: ['Kinh dị', 'Tâm lý', 'Phiêu lưu'],
      country: 'Mỹ',
      year: 2023,
      duration: '50 phút/tập',
      rating: 4.8,
      views: 25630,
      status: 'active',
      poster: 'https://via.placeholder.com/300x450',
      description: 'Trong một thế giới hậu tận thế, Joel và Ellie phải sinh tồn.',
      actors: [
        { id: 6, name: 'Leonardo DiCaprio', avatar: 'https://via.placeholder.com/40' },
        { id: 7, name: 'Brad Pitt', avatar: 'https://via.placeholder.com/40' }
      ],
      director: 'Craig Mazin',
      totalEpisodes: 9,
      currentEpisode: 9,
      episodes: [
        { id: 1, episodeNumber: 1, title: 'When You\'re Lost in the Darkness', duration: '81 phút', url: 'http://example.com/ep1' },
        { id: 2, episodeNumber: 2, title: 'Infected', duration: '53 phút', url: 'http://example.com/ep2' },
      ]
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [activeTab, setActiveTab] = useState('info');
  
  // Form data với categories và actors là arrays
  const [formData, setFormData] = useState({
    title: '',
    type: 'single',
    categories: [],
    country: '',
    year: new Date().getFullYear(),
    duration: '',
    rating: 0,
    status: 'active',
    poster: '',
    description: '',
    actors: [],
    director: '',
    totalEpisodes: '',
    trailer: ''
  });
  
  const [episodes, setEpisodes] = useState([]);
  
  // States cho dropdown search
  const [categorySearch, setCategorySearch] = useState('');
  const [actorSearch, setActorSearch] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showActorDropdown, setShowActorDropdown] = useState(false);

  // Refs cho click outside
  const categoryDropdownRef = useRef(null);
  const actorDropdownRef = useRef(null);

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
  const filteredCategories = availableCategories.filter(cat =>
    cat.toLowerCase().includes(categorySearch.toLowerCase()) &&
    !formData.categories.includes(cat)
  );

  // Filter actors for dropdown
  const filteredActors = availableActors.filter(actor =>
    actor.name.toLowerCase().includes(actorSearch.toLowerCase()) &&
    !formData.actors.some(a => a.id === actor.id)
  );

  // Filter movies
  const filteredMovies = movies.filter(movie => {
    const matchSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       movie.categories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchType = filterType === 'all' || movie.type === filterType;
    return matchSearch && matchType;
  });

  // Add category to movie
  const addCategory = (category) => {
    setFormData({
      ...formData,
      categories: [...formData.categories, category]
    });
    setCategorySearch('');
    setShowCategoryDropdown(false);
  };

  // Remove category from movie
  const removeCategory = (category) => {
    setFormData({
      ...formData,
      categories: formData.categories.filter(c => c !== category)
    });
  };

  // Add actor to movie
  const addActor = (actor) => {
    setFormData({
      ...formData,
      actors: [...formData.actors, actor]
    });
    setActorSearch('');
    setShowActorDropdown(false);
  };

  // Remove actor from movie
  const removeActor = (actorId) => {
    setFormData({
      ...formData,
      actors: formData.actors.filter(a => a.id !== actorId)
    });
  };

  // Open add modal
  const handleAdd = () => {
    setEditingMovie(null);
    setFormData({
      title: '',
      type: 'single',
      categories: [],
      country: '',
      year: new Date().getFullYear(),
      duration: '',
      rating: 0,
      status: 'active',
      poster: '',
      description: '',
      actors: [],
      director: '',
      totalEpisodes: '',
      trailer: ''
    });
    setEpisodes([]);
    setActiveTab('info');
    setIsModalOpen(true);
  };

  // Open edit modal
  const handleEdit = (movie) => {
    setEditingMovie(movie);
    setFormData({
      ...movie
    });
    setEpisodes(movie.episodes || []);
    setActiveTab('info');
    setIsModalOpen(true);
  };

  // Delete movie
  const handleDelete = (id) => {
    if (confirm('Bạn có chắc chắn muốn xóa phim này?')) {
      setMovies(movies.filter(movie => movie.id !== id));
    }
  };

  // Add episode
  const handleAddEpisode = () => {
    const newEpisode = {
      id: Date.now(),
      episodeNumber: episodes.length + 1,
      title: '',
      duration: '',
      url: ''
    };
    setEpisodes([...episodes, newEpisode]);
  };

  // Update episode
  const handleUpdateEpisode = (id, field, value) => {
    setEpisodes(episodes.map(ep => 
      ep.id === id ? { ...ep, [field]: value } : ep
    ));
  };

  // Delete episode
  const handleDeleteEpisode = (id) => {
    setEpisodes(episodes.filter(ep => ep.id !== id));
  };

  // Save movie
  const handleSave = () => {
    if (!formData.title.trim()) {
      alert('Vui lòng nhập tên phim');
      return;
    }

    const movieData = {
      ...formData,
      episodes: formData.type === 'series' ? episodes : null,
      currentEpisode: formData.type === 'series' ? episodes.length : null
    };

    if (editingMovie) {
      setMovies(movies.map(movie => 
        movie.id === editingMovie.id ? { ...movie, ...movieData } : movie
      ));
    } else {
      setMovies([...movies, { ...movieData, id: Date.now(), views: 0 }]);
    }

    setIsModalOpen(false);
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
              onClick={handleAdd}
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
                  placeholder="Tìm kiếm phim, thể loại..."
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
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMovies.map((movie) => (
            <div key={movie.id} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200 overflow-hidden group">
              {/* Poster */}
              <div className="relative aspect-[2/3] bg-gray-100">
                <img 
                  src={movie.poster} 
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
                {/* Overlay with actions */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-white text-sm mb-1">{movie.year} • {movie.country}</p>
                        <h3 className="text-white text-lg font-bold">{movie.title}</h3>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(movie)}
                          className="bg-blue-500/80 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(movie.id)}
                          className="bg-red-500/80 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Type badge */}
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-lg text-xs font-semibold backdrop-blur-sm ${
                    movie.type === 'series' 
                      ? 'bg-purple-500/80 text-white' 
                      : 'bg-blue-500/80 text-white'
                  }`}>
                    {movie.type === 'series' ? `Phim bộ (${movie.currentEpisode}/${movie.totalEpisodes} tập)` : 'Phim lẻ'}
                  </span>
                </div>

                {/* Rating */}
                <div className="absolute top-4 right-4">
                  <div className="bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center space-x-1">
                    <StarIconSolid className="h-4 w-4 text-yellow-400" />
                    <span className="text-white text-sm font-semibold">{movie.rating}</span>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                {/* Categories */}
                <div className="flex flex-wrap gap-1 mb-2">
                  {movie.categories.slice(0, 3).map((cat, index) => (
                    <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                      {cat}
                    </span>
                  ))}
                  {movie.categories.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{movie.categories.length - 3}
                    </span>
                  )}
                </div>
                
                <h3 className="font-bold text-gray-800 mb-2 line-clamp-1">{movie.title}</h3>
                
                {/* Actors preview */}
                <div className="flex items-center mb-2">
                  <div className="flex -space-x-2">
                    {movie.actors.slice(0, 3).map((actor, index) => (
                      <img
                        key={actor.id}
                        src={actor.avatar}
                        alt={actor.name}
                        className="w-6 h-6 rounded-full border-2 border-white"
                        title={actor.name}
                      />
                    ))}
                    {movie.actors.length > 3 && (
                      <div className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center">
                        <span className="text-xs text-gray-600">+{movie.actors.length - 3}</span>
                      </div>
                    )}
                  </div>
                  <span className="ml-2 text-xs text-gray-500">{movie.actors.length} diễn viên</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-gray-500">
                    <EyeIcon className="h-4 w-4" />
                    <span className="text-sm">{movie.views.toLocaleString()}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    movie.status === 'active' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {movie.status === 'active' ? 'Đang chiếu' : 'Ngừng chiếu'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Tổng phim</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{movies.length}</p>
              </div>
              <FilmIcon className="h-10 w-10 text-purple-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Phim lẻ</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {movies.filter(m => m.type === 'single').length}
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
                  {movies.filter(m => m.type === 'series').length}
                </p>
              </div>
              <DocumentTextIcon className="h-10 w-10 text-pink-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Tổng lượt xem</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">
                  {movies.reduce((sum, m) => sum + m.views, 0).toLocaleString()}
                </p>
              </div>
              <EyeIcon className="h-10 w-10 text-green-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Modal Add/Edit Movie */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  {editingMovie ? 'Chỉnh Sửa Phim' : 'Thêm Phim Mới'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
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
                  className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'info'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Thông tin phim
                </button>
                {formData.type === 'series' && (
                  <button
                    onClick={() => setActiveTab('episodes')}
                    className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === 'episodes'
                        ? 'border-purple-500 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Danh sách tập ({episodes.length})
                  </button>
                )}
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {activeTab === 'info' ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Title and Type */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Tên phim <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                        placeholder="Nhập tên phim..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Loại phim <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                      >
                        <option value="single">Phim lẻ</option>
                        <option value="series">Phim bộ</option>
                      </select>
                    </div>
                  </div>

                  {/* Categories Section */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <TagIcon className="inline h-4 w-4 mr-1" />
                      Thể loại
                    </label>
                    
                    {/* Selected categories */}
                    {formData.categories.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {formData.categories.map((category, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                          >
                            {category}
                            <button
                              onClick={() => removeCategory(category)}
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
                          {filteredCategories.map((category, index) => (
                            <button
                              key={index}
                              onClick={() => addCategory(category)}
                              className="w-full px-4 py-2 text-left hover:bg-purple-50 hover:text-purple-700 transition-colors flex items-center justify-between group"
                            >
                              <span>{category}</span>
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
                    {formData.actors.length > 0 && (
                      <div className="flex flex-wrap gap-3 mb-3">
                        {formData.actors.map((actor) => (
                          <div
                            key={actor.id}
                            className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg"
                          >
                            <img
                              src={actor.avatar}
                              alt={actor.name}
                              className="w-6 h-6 rounded-full"
                            />
                            <span className="text-sm font-medium text-blue-700">{actor.name}</span>
                            <button
                              onClick={() => removeActor(actor.id)}
                              className="hover:bg-blue-100 rounded-full p-0.5"
                            >
                              <XMarkIcon className="h-3.5 w-3.5 text-blue-600" />
                            </button>
                          </div>
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
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-y-auto">
                          {filteredActors.map((actor) => (
                            <button
                              key={actor.id}
                              onClick={() => addActor(actor)}
                              className="w-full px-4 py-3 text-left hover:bg-blue-50 hover:text-blue-700 transition-colors flex items-center justify-between group"
                            >
                              <div className="flex items-center gap-3">
                                <img
                                  src={actor.avatar}
                                  alt={actor.name}
                                  className="w-8 h-8 rounded-full"
                                />
                                <span>{actor.name}</span>
                              </div>
                              <PlusIcon className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Other fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Quốc gia
                      </label>
                      <select
                        value={formData.country}
                        onChange={(e) => setFormData({...formData, country: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                      >
                        <option value="">Chọn quốc gia</option>
                        <option value="Việt Nam">Việt Nam</option>
                        <option value="Mỹ">Mỹ</option>
                        <option value="Hàn Quốc">Hàn Quốc</option>
                        <option value="Nhật Bản">Nhật Bản</option>
                        <option value="Trung Quốc">Trung Quốc</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Năm sản xuất
                      </label>
                      <input
                        type="number"
                        value={formData.year}
                        onChange={(e) => setFormData({...formData, year: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                        min="1900"
                        max="2030"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Thời lượng
                      </label>
                      <input
                        type="text"
                        value={formData.duration}
                        onChange={(e) => setFormData({...formData, duration: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                        placeholder={formData.type === 'series' ? 'VD: 45 phút/tập' : 'VD: 120 phút'}
                      />
                    </div>

                    {formData.type === 'series' && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Tổng số tập
                        </label>
                        <input
                          type="number"
                          value={formData.totalEpisodes}
                          onChange={(e) => setFormData({...formData, totalEpisodes: e.target.value})}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                          placeholder="Nhập tổng số tập"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Đạo diễn
                      </label>
                      <input
                        type="text"
                        value={formData.director}
                        onChange={(e) => setFormData({...formData, director: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                        placeholder="Nhập tên đạo diễn..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Link Poster
                      </label>
                      <input
                        type="text"
                        value={formData.poster}
                        onChange={(e) => setFormData({...formData, poster: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                        placeholder="URL poster phim..."
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Mô tả
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none resize-none"
                      rows="4"
                      placeholder="Nhập mô tả phim..."
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Trạng thái
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="active"
                          checked={formData.status === 'active'}
                          onChange={(e) => setFormData({...formData, status: e.target.value})}
                          className="mr-2"
                        />
                        <span className="text-green-600 font-medium">Đang chiếu</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="inactive"
                          checked={formData.status === 'inactive'}
                          onChange={(e) => setFormData({...formData, status: e.target.value})}
                          className="mr-2"
                        />
                        <span className="text-gray-600 font-medium">Ngừng chiếu</span>
                      </label>
                    </div>
                  </div>
                </div>
              ) : (
                /* Episodes Tab */
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Danh sách tập phim</h3>
                    <button
                      onClick={handleAddEpisode}
                      className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
                    >
                      <PlusIcon className="h-4 w-4" />
                      <span>Thêm tập</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {episodes.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 rounded-xl">
                        <PlayIcon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500">Chưa có tập phim nào</p>
                        <p className="text-gray-400 text-sm mt-1">Nhấn "Thêm tập" để bắt đầu</p>
                      </div>
                    ) : (
                      episodes.map((episode) => (
                        <div key={episode.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Tập</label>
                              <input
                                type="number"
                                value={episode.episodeNumber}
                                onChange={(e) => handleUpdateEpisode(episode.id, 'episodeNumber', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                                placeholder="Số tập"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Tên tập</label>
                              <input
                                type="text"
                                value={episode.title}
                                onChange={(e) => handleUpdateEpisode(episode.id, 'title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                                placeholder="Tên tập phim"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Thời lượng</label>
                              <input
                                type="text"
                                value={episode.duration}
                                onChange={(e) => handleUpdateEpisode(episode.id, 'duration', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                                placeholder="VD: 45 phút"
                              />
                            </div>
                            <div className="flex items-end">
                              <button
                                onClick={() => handleDeleteEpisode(episode.id)}
                                className="w-full px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          <div className="mt-3">
                            <label className="block text-xs font-medium text-gray-600 mb-1">Link video</label>
                            <input
                              type="text"
                              value={episode.url}
                              onChange={(e) => handleUpdateEpisode(episode.id, 'url', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                              placeholder="URL video..."
                            />
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
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
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
}