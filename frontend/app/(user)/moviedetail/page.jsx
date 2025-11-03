"use client"
import React, { useEffect, useState } from 'react';
import { Play, Star, Calendar, Clock, Eye, Heart, Share2, Download, ChevronRight } from 'lucide-react';
import { getMoviebyId } from '@/services/movie';
import { IMAGE_URL } from '@/config/config';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { createHistory } from '@/services/history';
import { Getiduser } from '@/utils/auth';
import CommentBox from '@/components/user/Comments/comments';


const MovieWatchPage = () => {
  const [currentEpisode, setCurrentEpisode] = useState(1);
  const [activeTab, setActiveTab] = useState('');
  const router = useRouter();

  // Dữ liệu phim mẫu
  const movieData = {
    title: 'Breaking Bad',
    originalTitle: 'Breaking Bad',
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=450&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1574267432644-f610f53c2fd4?w=1200&h=400&fit=crop',
    rating: 9.5,
    year: 2008,
    duration: '45-60 phút/tập',
    views: '2.5M',
    genres: ['Drama', 'Crime', 'Thriller', 'Suspense'],
    country: 'Mỹ',
    director: 'Vince Gilligan',
    description: 'Một giáo viên hóa học trung học được chẩn đoán mắc bệnh ung thư phổi giai đoạn cuối quyết định sản xuất và bán methamphetamine để đảm bảo tương lai tài chính cho gia đình mình. Cùng với một cựu học sinh, anh ta tham gia vào thế giới ngầm đầy nguy hiểm của ma túy.',
    actors: [
      { name: 'Bryan Cranston', role: 'Walter White', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop' },
      { name: 'Aaron Paul', role: 'Jesse Pinkman', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
      { name: 'Anna Gunn', role: 'Skyler White', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
      { name: 'Dean Norris', role: 'Hank Schrader', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop' },
      { name: 'Betsy Brandt', role: 'Marie Schrader', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop' },
      { name: 'RJ Mitte', role: 'Walter White Jr.', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop' },
    ],
    seasons: [
      {
        season: 1,
        episodes: [
          { ep: 1, title: 'Pilot', duration: '58 phút' },
          { ep: 2, title: 'Cat\'s in the Bag...', duration: '48 phút' },
          { ep: 3, title: '...And the Bag\'s in the River', duration: '48 phút' },
          { ep: 4, title: 'Cancer Man', duration: '48 phút' },
          { ep: 5, title: 'Gray Matter', duration: '48 phút' },
          { ep: 6, title: 'Crazy Handful of Nothin\'', duration: '48 phút' },
          { ep: 7, title: 'A No-Rough-Stuff-Type Deal', duration: '48 phút' },
        ]
      },
      {
        season: 2,
        episodes: [
          { ep: 1, title: 'Seven Thirty-Seven', duration: '47 phút' },
          { ep: 2, title: 'Grilled', duration: '47 phút' },
          { ep: 3, title: 'Bit by a Dead Bee', duration: '47 phút' },
          { ep: 4, title: 'Down', duration: '47 phút' },
          { ep: 5, title: 'Breakage', duration: '47 phút' },
          { ep: 6, title: 'Peekaboo', duration: '47 phút' },
          { ep: 7, title: 'Negro y Azul', duration: '47 phút' },
          { ep: 8, title: 'Better Call Saul', duration: '47 phút' },
        ]
      }
    ],
    relatedMovies: [
      { id: 1, title: 'Better Call Saul', image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=200&h=300&fit=crop', rating: 8.9 },
      { id: 2, title: 'Ozark', image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=200&h=300&fit=crop', rating: 8.5 },
      { id: 3, title: 'The Wire', image: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=200&h=300&fit=crop', rating: 9.3 },
      { id: 4, title: 'Narcos', image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=200&h=300&fit=crop', rating: 8.8 },
    ]
  };

  const [selectedSeason, setSelectedSeason] = useState(1);

  const paramsId = useSearchParams();
  const idMovie = paramsId.get('id');
  const tapParam = paramsId.get('tap');

  const [movie, setMovie] = useState({});
  const [loai, setloai] = useState('');
  const [videourl, setvideoUrl] = useState('');

  const fetdata = async () => {
    const data = await getMoviebyId(idMovie);
    setMovie(data);
    setloai(data.loai)

    if (data.loai === "le") {
      setvideoUrl(data.video_url);
    } else if (data.loai === "bo" && data.tapphim?.length > 0) {
      // Nếu có param tập => chọn đúng tập
      const sorted = [...data.tapphim].sort((a, b) => a.so_tap - b.so_tap);
      const selectedEp = tapParam
        ? sorted.find(ep => ep.so_tap === parseInt(tapParam))
        : sorted[0];
      setvideoUrl(selectedEp.video_url);
      setCurrentEpisode(selectedEp.id);
    }



  }
  const res = async () => {
    
  }
  
  useEffect(() => {
    fetdata();
    res()
  }, [idMovie, tapParam])

  useEffect(() => {
    if (loai === 'bo') {
      setActiveTab('episodes');
    } else if (loai === 'le') {
      setActiveTab('info');

    }
  }, [loai]);
  return (
    <div className="min-h-screen bg-black text-gray-100" onClick={ async()=> {
      await createHistory(
        {
          user_id: Getiduser(),
          phim_id: idMovie,
          so_tap: tapParam
        }
      )
    }}>
      {/* Video Player */}
      
      <video controls width={1500}  className='max-w-7xl mx-auto px-4 py-8' src={`http://localhost:5273/upload/video/${videourl}`}></video>
      {/* <div className="relative w-full bg-gray-900 aspect-video">
        <img
          src={movieData.coverImage}
          alt="Video player"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <button className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors">
            <Play className="w-10 h-10 text-white ml-1" fill="white" />
          </button>
        </div>


        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6">
          <div className="max-w-7xl mx-auto">
            <p className="text-gray-400 text-sm mb-1">Đang xem</p>
            <h2 className="text-2xl font-bold text-white">Tập {currentEpisode}: {movieData.seasons[0].episodes[0].title}</h2>
          </div>
        </div>
      </div> */}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Movie Info */}
            <div className="bg-gray-900 rounded-lg p-6 mb-6 border border-gray-800">
              <div className="flex gap-6 mb-6">
                <img
                  src={`${IMAGE_URL}/${movie?.anh_dai_dien}`}
                  alt={movie.ten}
                  className="w-32 h-48 object-cover rounded-lg border-2 border-gray-800"
                />
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-white mb-2">{movie?.ten}</h1>
                  <p className="text-gray-400 mb-4">{movie?.ten_tieng_anh}</p>

                  <div className="flex flex-wrap gap-4 mb-4">
                    {/* <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="text-white font-semibold">100</span>
                    </div> */}
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar className="w-5 h-5" />
                      <span>{movie.ngay_phat_hanh}</span>
                    </div>
                    {/* <div className="flex items-center gap-2 text-gray-400">
                      <Clock className="w-5 h-5" />
                      <span>{movieData.duration}</span>
                    </div> */}
                    {/* <div className="flex items-center gap-2 text-gray-400">
                      <Eye className="w-5 h-5" />
                      <span>{movieData.views}</span>
                    </div> */}
                  </div>

                  <div className="flex gap-2 mb-4">
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      Yêu thích
                    </button>
                    <button className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2">
                      <Share2 className="w-4 h-4" />
                      Chia sẻ
                    </button>
                    <button className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Tải xuống
                    </button>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-800 mb-6">
                <div className="flex gap-6">
                  {/* Nếu là phim bộ thì mới có tab Danh sách tập */}
                  {loai === 'bo' && (
                    <button
                      onClick={() => setActiveTab('episodes')}
                      className={`pb-3 font-semibold transition-colors ${activeTab === 'episodes'
                        ? 'text-red-600 border-b-2 border-red-600'
                        : 'text-gray-400 hover:text-white'
                        }`}
                    >
                      Danh sách tập
                    </button>
                  )}

                  <button
                    onClick={() => setActiveTab('info')}
                    className={`pb-3 font-semibold transition-colors ${activeTab === 'info'
                      ? 'text-red-600 border-b-2 border-red-600'
                      : 'text-gray-400 hover:text-white'
                      }`}
                  >
                    Thông tin
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              {loai === 'bo' && activeTab === 'episodes' && (
                <div>
                  {/* Episodes List */}
                  <div className="flex space-x-2 overflow-x-auto">
                    {movie.tapphim.map((episode, index) => (
                      <div
                        key={index}
                        onClick={() => { router.push(`/moviedetail?id=${idMovie}&tap=${episode.so_tap}`); }}
                        className={`p-4 rounded-lg cursor-pointer transition-all min-w-[90px] ${currentEpisode === episode.id
                          ? 'bg-red-600 bg-opacity-20 border border-red-600'
                          : 'bg-gray-800 hover:bg-gray-750 border border-gray-700'
                          }`}
                      >
                        Tập {episode.so_tap}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'info' && (
                <div className="space-y-6">
                  {/* Description */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">Nội dung</h3>
                    <p className="text-gray-400 leading-relaxed">{movie.mota}</p>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-gray-500 text-sm mb-1">Quốc gia</h4>
                      <p className="text-white">{movie.quocgia}</p>
                    </div>
                    <div>
                      <h4 className="text-gray-500 text-sm mb-1">Đạo diễn</h4>
                      <p className="text-white">{movie.daodien}</p>
                    </div>
                  </div>

                  {/* Genres */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">Thể loại</h3>
                    <div className="flex flex-wrap gap-2">
                      {movie.theloai.map((theloai, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-gray-800 text-gray-300 rounded-full text-sm border border-gray-700 hover:border-red-600 hover:text-red-600 transition-colors cursor-pointer"
                        >
                          {theloai.ten}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Cast */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">Diễn viên</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {movie.dienvien.map((dienvien, index) => (
                        <div key={index} className="flex items-center gap-3 bg-gray-800 p-3 rounded-lg border border-gray-700 hover:border-red-600 transition-colors cursor-pointer">
                          {/* <img
                            src={actor.image}
                            alt={actor.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-gray-700"
                          /> */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-semibold text-sm truncate">{dienvien.ten}</h4>
                            {/* <p className="text-gray-400 text-xs truncate">{actor.role}</p> */}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <CommentBox id={idMovie} />
          </div>

          {/* Sidebar - Related Movies */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 sticky top-4">
              <h3 className="text-xl font-bold text-white mb-4">Phim liên quan</h3>
              <div className="space-y-4">
                {movieData.relatedMovies.map((movie) => (
                  <div
                    key={movie.id}
                    className="flex gap-3 bg-gray-800 p-3 rounded-lg border border-gray-700 hover:border-red-600 transition-all cursor-pointer group"
                  >
                    <img
                      src={movie.image}
                      alt={movie.title}
                      className="w-20 h-28 object-cover rounded border border-gray-700 group-hover:border-red-600 transition-colors"
                    />
                    <div className="flex-1">
                      <h4 className="text-white font-semibold mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                        {movie.title}
                      </h4>
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-semibold">{movie.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MovieWatchPage;