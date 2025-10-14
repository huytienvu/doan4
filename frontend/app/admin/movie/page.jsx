"use client"
import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X, Save, Eye } from 'lucide-react';
import { getListMovie, getMoviebyId, CreateMovie, UpdateMovie } from '../../../services/admin/movie';
import { getAllCategory } from '../../../services/category';
import { getAllActor } from '../../../services/actor';
import { getAllCountry } from '../../../services/quocgia';
import { APIUploadImage, APIUploadVideo } from '../../../services/upload';

const MovieAdminInterface = () => {
  const [phim, setPhim] = useState([]);
    
    const fet = async () => {
        try {
            const movies = await getListMovie();
            setPhim(Array.isArray(movies) ? movies : []);
        } catch (e) {
            console.error(e);
            setPhim([]);
        }
    }
    useEffect(() => {
        fet();
    }, [])

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [currentMovie, setCurrentMovie] = useState({
    title: '',
    tentienganh:'',
    daodien:'',
    mota:'',
    type: 'single',
    genres: [],
    actors: [],
    releaseYear: 2025,
    duration: 0,
    poster: '',
    video_url: '',
    country: '',
    episodes: []
  });
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [selectedActorIds, setSelectedActorIds] = useState([]);

  const [newGenre, setNewGenre] = useState('');
  const [newActor, setNewActor] = useState('');
  const [newEpisode, setNewEpisode] = useState({ season: 1, episode: 1, title: '', duration: 0 });
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [actorOptions, setActorOptions] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);

  const handleUploadPoster = async (file) => {
    try {
      if (!file) return;
      const res = await APIUploadImage(file);
      // backend returns { url: '/upload/anhdaidien/filename.ext' }
      const url = res?.url || '';
      const filename = url.split('/').pop() || '';
      setCurrentMovie({ ...currentMovie, poster: filename });
    } catch (e) {
      console.error(e);
      alert('Upload ảnh thất bại');
    }
  };

  const handleUploadSingleVideo = async (file) => {
    try {
      if (!file) return;
      const res = await APIUploadVideo(file);
      const url = res?.url || '';
      const filename = url.split('/').pop() || '';
      setCurrentMovie({ ...currentMovie, video_url: filename });
    } catch (e) {
      console.error(e);
      alert('Upload video thất bại');
    }
  };

  const handleUploadEpisodeVideo = async (file, season, episode) => {
    try {
      if (!file) return;
      const res = await APIUploadVideo(file);
      const url = res?.url || '';
      const filename = url.split('/').pop() || '';
      setCurrentMovie(prev => ({
        ...prev,
        episodes: (prev.episodes || []).map(ep =>
          ep.season === season && ep.episode === episode ? { ...ep, title: filename } : ep
        )
      }));
    } catch (e) {
      console.error(e);
      alert('Upload video tập thất bại');
    }
  };

  const openAddModal = () => {
    setCurrentMovie({
      title: '',
      type: 'single',
      tentienganh:'',
      daodien:'',
      mota:'',
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
    setIsModalOpen(true);
  };

  const mapApiMovieToForm = (detail) => {
    return {
      title: detail?.ten || '',
      type: detail?.loai === 'bo' ? 'series' : 'single',
      tentienganh: detail?.ten_tieng_anh || '',
      daodien: detail?.daodien || '',
      mota: detail?.mota || '',
      genres: Array.isArray(detail?.theloai) ? detail.theloai.map(g => (typeof g === 'object' && g ? (g.ten || '') : String(g))) : [],
      actors: Array.isArray(detail?.dienvien) ? detail.dienvien.map(a => (typeof a === 'object' && a ? (a.ten || '') : String(a))) : [],
      releaseYear: detail?.ngay_phat_hanh ,
      duration: Number(detail?.thoi_luong || 0),
      poster: detail?.anh_dai_dien || '',
      video_url: detail?.video_url || '',
      country: detail?.quocgia || '',
      episodes: Array.isArray(detail?.tapphim) ? detail.tapphim.map(ep => ({
        season: 1,
        episode: Number(ep?.so_tap || 0),
        title: ep?.video_url || '',
        duration: 0,
      })) : [],
    };
  };

  const openEditModal = async (movieId) => {
    try {
      setIsModalOpen(true);
      setEditingMovie(movieId);
      const res = await getMoviebyId(movieId);
      const detail = Array.isArray(res?.phim) ? res.phim[0] : res;
      const formData = mapApiMovieToForm(detail || {});
      setCurrentMovie(formData);
      // hydrate selected ids for edit mode
      setSelectedCategoryIds(Array.isArray(detail?.theloai) ? detail.theloai.map(g => g.id).filter(Boolean) : []);
      setSelectedActorIds(Array.isArray(detail?.dienvien) ? detail.dienvien.map(a => a.id).filter(Boolean) : []);
    } catch (e) {
      console.error(e);
    }
  };

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
        setCategoryOptions([]);
        setActorOptions([]);
        setCountryOptions([]);
      }
    };
    if (isModalOpen) {
      loadOptions();
    }
  }, [isModalOpen]);

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentMovie({
      title: '',
      type: 'single',
      genres: [],
      actors: [],
      releaseYear: new Date().getFullYear(),
      duration: 0,
      poster: '',
      episodes: []
    });
    setEditingMovie(null);
    setNewGenre('');
    setNewActor('');
    setNewEpisode({ season: 1, episode: 1, title: '', duration: 0 });
  };

  const handleSaveMovie = async () => {
    if (!currentMovie.title.trim()) {
      alert('Vui lòng nhập tên phim!');
      return;
    }

    if (editingMovie) {
      try {
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
            ? (currentMovie.episodes || [])
                .filter(ep => (ep?.title || '').trim())
                .map(ep => ({
                  so_tap: ep.episode,
                  video_url: ep.title.trim()
                }))
            : [],
          theloai_ids: selectedCategoryIds,
          dienvien_ids: selectedActorIds,
        };
        await UpdateMovie(editingMovie, payload);
        await fet();
        closeModal();
      } catch (e) {
        console.error(e);
        alert('Cập nhật phim thất bại');
      }
    } else {
      try {
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
            ? (currentMovie.episodes || [])
                .filter(ep => (ep?.title || '').trim())
                .map(ep => ({
                  so_tap: ep.episode,
                  video_url: ep.title.trim()
                }))
            : [],
          theloai_ids: selectedCategoryIds,
          dienvien_ids: selectedActorIds,
        };
        await CreateMovie(payload);
        await fet();
        closeModal();
      } catch (e) {
        console.error(e);
        alert('Thêm phim thất bại');
      }
    }
  };

  const handleDeleteMovie = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phim này?')) {
      alert("Sẽ cải tiến")
    }
  };

  const addGenre = () => {
    if (!newGenre) return;
    const found = categoryOptions.find(c => String(c.id) === String(newGenre));
    if (!found) return;
    if (!selectedCategoryIds.includes(found.id)) {
      setSelectedCategoryIds([...selectedCategoryIds, found.id]);
      setCurrentMovie({
        ...currentMovie,
        genres: [...currentMovie.genres, found.ten]
      });
    }
    setNewGenre('');
  };

  const removeGenre = (genreToRemove) => {
    const idx = currentMovie.genres.findIndex(g => g === genreToRemove);
    setCurrentMovie({
      ...currentMovie,
      genres: currentMovie.genres.filter((_, i) => i !== idx)
    });
    if (idx > -1) {
      setSelectedCategoryIds(selectedCategoryIds.filter((_, i) => i !== idx));
    }
  };

  const addActor = () => {
    if (!newActor) return;
    const found = actorOptions.find(a => String(a.id) === String(newActor));
    if (!found) return;
    if (!selectedActorIds.includes(found.id)) {
      setSelectedActorIds([...selectedActorIds, found.id]);
      setCurrentMovie({
        ...currentMovie,
        actors: [...currentMovie.actors, found.ten]
      });
    }
    setNewActor('');
  };

  const removeActor = (actorToRemove) => {
    const idx = currentMovie.actors.findIndex(a => a === actorToRemove);
    setCurrentMovie({
      ...currentMovie,
      actors: currentMovie.actors.filter((_, i) => i !== idx)
    });
    if (idx > -1) {
      setSelectedActorIds(selectedActorIds.filter((_, i) => i !== idx));
    }
  };

  const addEpisode = () => {
    if (newEpisode.title.trim()) {
      const episodeExists = currentMovie.episodes.some(ep => 
        ep.season === newEpisode.season && ep.episode === newEpisode.episode
      );
      
      if (!episodeExists) {
        setCurrentMovie({
          ...currentMovie,
          episodes: [...currentMovie.episodes, { ...newEpisode }].sort((a, b) => {
            if (a.season !== b.season) return a.season - b.season;
            return a.episode - b.episode;
          })
        });
        setNewEpisode({ season: 1, episode: 1, title: '', duration: 0 });
      } else {
        alert('Tập phim này đã tồn tại!');
      }
    }
  };

  const removeEpisode = (season, episode) => {
    setCurrentMovie({
      ...currentMovie,
      episodes: currentMovie.episodes.filter(ep => 
        !(ep.season === season && ep.episode === episode)
      )
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Quản Lý Phim</h1>
            <button
              onClick={openAddModal}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus size={20} />
              Thêm Phim Mới
            </button>
          </div>
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {phim.map((movie) => (
            <div key={movie.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative aspect-[0.8]">
                <img 
                  src={`http://localhost:5273/upload/anhdaidien/${movie.anh_dai_dien}` || 'https://via.placeholder.com/300x450?text=No+Image'} 
                  alt={movie.ten}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    movie.loai === 'bo' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {movie.loai === 'bo' ? 'Phim Bộ' : 'Phim Lẻ'}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">{movie.ten}</h3>
                <p className="text-gray-600 text-sm mb-2">Năm: {movie.ngay_phat_hanh}</p>
                
                <div className="mb-3">
                  <div className="flex flex-wrap gap-1">
                    {(movie.theloai || []).slice(0, 2).map((genre, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                        {typeof genre === 'object' && genre !== null ? (genre.ten || '') : String(genre)}
                      </span>
                    ))}
                    {(movie.theloai || []).length > 2 && (
                      <span className="text-gray-500 text-xs">+{(movie.theloai || []).length - 2} thể loại</span>
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-gray-600 text-sm">
                    Diễn viên: {(movie.dienvien || []).slice(0, 2).map((dv) => (typeof dv === 'object' && dv !== null ? (dv.ten || '') : String(dv))).join(', ')}
                    {(movie.dienvien || []).length > 2 && ` +${(movie.dienvien || []).length - 2} người`}
                  </p>
                </div>

                

                <div className="flex justify-between items-center">
                  <button
                    onClick={() => openEditModal(movie.id)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteMovie(movie.id)}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingMovie ? 'Chỉnh Sửa Phim' : 'Thêm Phim Mới'}
                </h2>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên Phim *</label>
                    <input
                      type="text"
                      value={currentMovie.title}
                      onChange={(e) => setCurrentMovie({...currentMovie, title: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập tên phim"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Loại Phim</label>
                    <select
                      value={currentMovie.type}
                      onChange={(e) => setCurrentMovie({...currentMovie, type: e.target.value, episodes: e.target.value === 'single' ? [] : currentMovie.episodes})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="single">Phim Lẻ</option>
                      <option value="series">Phim Bộ</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quốc Gia</label>
                    <select
                      value={currentMovie.country}
                      onChange={(e) => setCurrentMovie({ ...currentMovie, country: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Chọn quốc gia</option>
                      {countryOptions.map((c) => (
                        <option key={c.id || c.quocgia} value={c.quocgia || ''}>{c.quocgia}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Năm Phát Hành</label>
                    <input
                      type="number"
                      value={currentMovie.releaseYear}
                      onChange={(e) => setCurrentMovie({...currentMovie, releaseYear: parseInt(e.target.value)  })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1900"
                      max="2030"
                    />
                  </div>

                  {currentMovie.type === 'single' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Thời Lượng (phút)</label>
                      <input
                        type="number"
                        value={currentMovie.duration}
                        onChange={(e) => setCurrentMovie({...currentMovie, duration: parseInt(e.target.value) || 0})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="0"
                      />
                    </div>
                  )}

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Poster</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleUploadPoster(e.target.files?.[0])}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {currentMovie.poster && (
                        <span className="text-sm text-gray-600 truncate">{currentMovie.poster}</span>
                      )}
                    </div>
                  </div>
                  {currentMovie.type === 'single' && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Video (phim lẻ)</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) => handleUploadSingleVideo(e.target.files?.[0])}
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {currentMovie.video_url && (
                          <span className="text-sm text-gray-600 truncate">{currentMovie.video_url}</span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Đạo diễn</label>
                    <input
                      type="text"
                      value={currentMovie.daodien}
                      onChange={(e) => setCurrentMovie({...currentMovie, daodien: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com/poster.jpg"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên tiếng anh</label>
                    <input
                      type="text"
                      value={currentMovie.tentienganh}
                      onChange={(e) => setCurrentMovie({...currentMovie, tentienganh: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com/poster.jpg"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                    <input
                      type="text"
                      value={currentMovie.mota}
                      onChange={(e) => setCurrentMovie({...currentMovie, mota: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com/poster.jpg"
                    />
                  </div>
                </div>

                {/* Genres from API */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Thể Loại</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {currentMovie.genres.map((genre, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                        {genre}
                        <button
                          onClick={() => removeGenre(genre)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={newGenre}
                      onChange={(e) => setNewGenre(e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Chọn thể loại</option>
                      {categoryOptions
                        .filter(c => c && !selectedCategoryIds.includes(c.id))
                        .map((c) => (
                          <option key={c.id} value={c.id}>{c.ten}</option>
                        ))}
                    </select>
                    <button
                      onClick={addGenre}
                      
                      disabled={!newGenre}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Thêm
                    </button>
                  </div>
                </div>

                {/* Actors from API */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Diễn Viên</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {currentMovie.actors.map((actor, index) => (
                      <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                        {actor}
                        <button
                          onClick={() => removeActor(actor)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={newActor}
                      onChange={(e) => setNewActor(e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Chọn diễn viên</option>
                      {actorOptions
                        .filter(a => a && !selectedActorIds.includes(a.id))
                        .map((a) => (
                          <option key={a.id} value={a.id}>{a.ten}</option>
                        ))}
                    </select>
                    <button
                      onClick={addActor}
                      disabled={!newActor}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Thêm
                    </button>
                  </div>
                </div>

                {/* Episodes for Series */}
                {currentMovie.type === 'series' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Danh Sách Tập Phim</label>
                    
                    {/* Episode List */}
                    {currentMovie.episodes.length > 0 && (
                      <div className="mb-4 max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50 sticky top-0">
                            <tr>
                              <th className="px-3 py-2 text-left">Season</th>
                              <th className="px-3 py-2 text-left">Tập</th>
                              <th className="px-3 py-2 text-left">url VIDEO</th>
                              <th className="px-3 py-2 text-left">Thời lượng</th>
                              <th className="px-3 py-2"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentMovie.episodes.map((episode, index) => (
                              <tr key={index} className="border-t border-gray-200">
                                <td className="px-3 py-2">{episode.season}</td>
                                <td className="px-3 py-2">{episode.episode}</td>
                                <td className="px-3 py-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-700 truncate max-w-[200px]">{episode.title}</span>
                                    <input
                                      type="file"
                                      accept="video/*"
                                      onChange={(e) => handleUploadEpisodeVideo(e.target.files?.[0], episode.season, episode.episode)}
                                      className="text-sm"
                                    />
                                  </div>
                                </td>
                                <td className="px-3 py-2">{episode.duration} phút</td>
                                <td className="px-3 py-2">
                                  <button
                                    onClick={() => removeEpisode(episode.season, episode.episode)}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <X size={16} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Add Episode Form */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                      <input
                        type="number"
                        min="1"
                        value={newEpisode.season}
                        onChange={(e) => setNewEpisode({...newEpisode, season: parseInt(e.target.value) || 1})}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Season"
                      />
                      <input
                        type="number"
                        min="1"
                        value={newEpisode.episode}
                        onChange={(e) => setNewEpisode({...newEpisode, episode: parseInt(e.target.value) || 1})}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Tập"
                      />
                      <input
                        type="text"
                        value={newEpisode.title}
                        onChange={(e) => setNewEpisode({...newEpisode, title: e.target.value})}
                        className="md:col-span-2 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="URL tập phim"
                      />
                      <input
                        type="number"
                        min="0"
                        value={newEpisode.duration}
                        onChange={(e) => setNewEpisode({...newEpisode, duration: parseInt(e.target.value) || 0})}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Phút"
                      />
                    </div>
                    <button
                      onClick={addEpisode}
                      disabled={!newEpisode.title.trim()}
                      className="mt-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Thêm Tập
                    </button>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSaveMovie}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Save size={16} />
                  {editingMovie ? 'Cập Nhật' : 'Thêm Phim'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieAdminInterface;