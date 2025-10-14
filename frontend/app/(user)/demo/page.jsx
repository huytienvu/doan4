"use client"
import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, Save, Eye } from 'lucide-react';

const MovieAdminInterface = () => {
  const [movies, setMovies] = useState([
    {
      id: 1,
      title: 'Avengers: Endgame',
      type: 'single',
      genres: ['Hành động', 'Khoa học viễn tưởng'],
      actors: ['Robert Downey Jr.', 'Chris Evans', 'Scarlett Johansson'],
      releaseYear: 2019,
      duration: 181,
      poster: 'https://via.placeholder.com/200x300',
      episodes: []
    },
    {
      id: 2,
      title: 'Breaking Bad',
      type: 'series',
      genres: ['Drama', 'Tội phạm'],
      actors: ['Bryan Cranston', 'Aaron Paul', 'Anna Gunn'],
      releaseYear: 2008,
      poster: 'https://via.placeholder.com/200x300',
      episodes: [
        { season: 1, episode: 1, title: 'Pilot', duration: 58 },
        { season: 1, episode: 2, title: 'Cat\'s in the Bag...', duration: 48 }
      ]
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [currentMovie, setCurrentMovie] = useState({
    title: '',
    type: 'single',
    genres: [],
    actors: [],
    releaseYear: new Date().getFullYear(),
    duration: 0,
    poster: '',
    episodes: []
  });

  const [newGenre, setNewGenre] = useState('');
  const [newActor, setNewActor] = useState('');
  const [newEpisode, setNewEpisode] = useState({ season: 1, episode: 1, title: '', duration: 0 });

  const genreOptions = ['Hành động', 'Drama', 'Hài', 'Kinh dị', 'Tình cảm', 'Khoa học viễn tưởng', 'Tội phạm', 'Phiêu lưu', 'Hoạt hình'];

  const openAddModal = () => {
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
    setIsModalOpen(true);
  };

  const openEditModal = (movie) => {
    setCurrentMovie({ ...movie });
    setEditingMovie(movie.id);
    setIsModalOpen(true);
  };

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

  const handleSaveMovie = () => {
    if (!currentMovie.title.trim()) {
      alert('Vui lòng nhập tên phim!');
      return;
    }

    if (editingMovie) {
      setMovies(movies.map(movie =>
        movie.id === editingMovie ? { ...currentMovie, id: editingMovie } : movie
      ));
    } else {
      const newId = Math.max(...movies.map(m => m.id), 0) + 1;
      setMovies([...movies, { ...currentMovie, id: newId }]);
    }
    closeModal();
  };

  const handleDeleteMovie = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phim này?')) {
      setMovies(movies.filter(movie => movie.id !== id));
    }
  };

  const addGenre = () => {
    if (newGenre.trim() && !currentMovie.genres.includes(newGenre.trim())) {
      setCurrentMovie({
        ...currentMovie,
        genres: [...currentMovie.genres, newGenre.trim()]
      });
      setNewGenre('');
    }
  };

  const removeGenre = (genreToRemove) => {
    setCurrentMovie({
      ...currentMovie,
      genres: currentMovie.genres.filter(genre => genre !== genreToRemove)
    });
  };

  const addActor = () => {
    if (newActor.trim() && !currentMovie.actors.includes(newActor.trim())) {
      setCurrentMovie({
        ...currentMovie,
        actors: [...currentMovie.actors, newActor.trim()]
      });
      setNewActor('');
    }
  };

  const removeActor = (actorToRemove) => {
    setCurrentMovie({
      ...currentMovie,
      actors: currentMovie.actors.filter(actor => actor !== actorToRemove)
    });
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
      <div className=" w-96 bg-orange-300 p-3 items-center mx-auto text-center">
        Khối ra giữa ngang
      </div>
      
      


      <nav>
        <div className='max-w-7xl flex justify-between items-center'>
          <ul className='flex'>
            <li className='px-4'>Home</li>
            <li className='px-4'>Product</li>
            <li className='px-4'>Sale</li>
            <li className='px-4'>Profile</li>
            <li className='px-4'> About</li>
          </ul>
          <p className='bg-sky-700 hover:bg-sky-300 rounded-2xl p-4'>Huy</p>
          <p>Vũ</p>
        </div>
      </nav>


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
          {movies.map((movie) => (
            <div key={movie.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative">
                <img
                  src={movie.poster || 'https://via.placeholder.com/300x450?text=No+Image'}
                  alt={movie.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${movie.type === 'series' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                    {movie.type === 'series' ? 'Phim Bộ' : 'Phim Lẻ'}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">{movie.title}</h3>
                <p className="text-gray-600 text-sm mb-2">Năm: {movie.releaseYear}</p>

                <div className="mb-3">
                  <div className="flex flex-wrap gap-1">
                    {movie.genres.slice(0, 2).map((genre, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                        {genre}
                      </span>
                    ))}
                    {movie.genres.length > 2 && (
                      <span className="text-gray-500 text-xs">+{movie.genres.length - 2} thể loại</span>
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-gray-600 text-sm">
                    Diễn viên: {movie.actors.slice(0, 2).join(', ')}
                    {movie.actors.length > 2 && ` +${movie.actors.length - 2} người`}
                  </p>
                </div>

                {movie.type === 'series' && (
                  <p className="text-gray-600 text-sm mb-3">{movie.episodes.length} tập</p>
                )}

                <div className="flex justify-between items-center">
                  <button
                    onClick={() => openEditModal(movie)}
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
                      onChange={(e) => setCurrentMovie({ ...currentMovie, title: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập tên phim"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Loại Phim</label>
                    <select
                      value={currentMovie.type}
                      onChange={(e) => setCurrentMovie({ ...currentMovie, type: e.target.value, episodes: e.target.value === 'single' ? [] : currentMovie.episodes })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="single">Phim Lẻ</option>
                      <option value="series">Phim Bộ</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Năm Phát Hành</label>
                    <input
                      type="number"
                      value={currentMovie.releaseYear}
                      onChange={(e) => setCurrentMovie({ ...currentMovie, releaseYear: parseInt(e.target.value) || new Date().getFullYear() })}
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
                        onChange={(e) => setCurrentMovie({ ...currentMovie, duration: parseInt(e.target.value) || 0 })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="0"
                      />
                    </div>
                  )}

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL Poster</label>
                    <input
                      type="url"
                      value={currentMovie.poster}
                      onChange={(e) => setCurrentMovie({ ...currentMovie, poster: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com/poster.jpg"
                    />
                  </div>
                </div>

                {/* Genres */}
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
                      {genreOptions.filter(genre => !currentMovie.genres.includes(genre)).map((genre) => (
                        <option key={genre} value={genre}>{genre}</option>
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

                {/* Actors */}
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
                    <input
                      type="text"
                      value={newActor}
                      onChange={(e) => setNewActor(e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập tên diễn viên"
                      onKeyPress={(e) => e.key === 'Enter' && addActor()}
                    />
                    <button
                      onClick={addActor}
                      disabled={!newActor.trim()}
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
                              <th className="px-3 py-2 text-left">Tiêu đề</th>
                              <th className="px-3 py-2 text-left">Thời lượng</th>
                              <th className="px-3 py-2"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentMovie.episodes.map((episode, index) => (
                              <tr key={index} className="border-t border-gray-200">
                                <td className="px-3 py-2">{episode.season}</td>
                                <td className="px-3 py-2">{episode.episode}</td>
                                <td className="px-3 py-2">{episode.title}</td>
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
                        onChange={(e) => setNewEpisode({ ...newEpisode, season: parseInt(e.target.value) || 1 })}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Season"
                      />
                      <input
                        type="number"
                        min="1"
                        value={newEpisode.episode}
                        onChange={(e) => setNewEpisode({ ...newEpisode, episode: parseInt(e.target.value) || 1 })}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Tập"
                      />
                      <input
                        type="text"
                        value={newEpisode.title}
                        onChange={(e) => setNewEpisode({ ...newEpisode, title: e.target.value })}
                        className="md:col-span-2 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Tiêu đề tập phim"
                      />
                      <input
                        type="number"
                        min="0"
                        value={newEpisode.duration}
                        onChange={(e) => setNewEpisode({ ...newEpisode, duration: parseInt(e.target.value) || 0 })}
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