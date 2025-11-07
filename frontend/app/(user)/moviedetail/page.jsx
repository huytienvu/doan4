"use client"
import React, { useEffect, useState } from 'react';
import { Play, Star, Calendar, Clock, Eye, Heart, Share2, Download, ChevronRight, Film, Globe, User } from 'lucide-react';
import { getMoviebyId } from '@/services/movie';
import { IMAGE_URL } from '@/config/config';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { createHistory } from '@/services/history';
import { Getiduser } from '@/utils/auth';
import CommentBox from '@/components/user/Comments/comments';
import { checkFavorite, createFavorite, deleteFavorite } from '@/services/favorite';
import { toast } from 'react-toastify';
import { FaShare } from 'react-icons/fa';
import { AiFillStar } from 'react-icons/ai';


const MovieWatchPage = () => {
  const [currentEpisode, setCurrentEpisode] = useState(1);
  const [activeTab, setActiveTab] = useState('');
  const [liked, setLiked] = useState(false);
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

    const objCheck = {
      user_id: Getiduser(),
      phim_id: idMovie
    }
    const res = await checkFavorite(objCheck);
    setLiked(res);



  }
  async function toggleFavorite() {
    if (Getiduser() === null) {
      toast.error("Bạn phải đăng nhập để sử dụng tính năng này")
      return;
    }
    if (liked) {
      await deleteFavorite(Getiduser(), idMovie);
      setLiked(false);
    } else {
      await createFavorite({
        "user_id": Getiduser(),
        "phim_id": idMovie
      });
      setLiked(true);
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
    <div className="min-h-screen bg-black text-gray-100" onClick={async () => {
      await createHistory(
        {
          user_id: Getiduser(),
          phim_id: idMovie,
          so_tap: tapParam
        }
      )
    }}>
      {/* Video Player */}

      <video controls width={1500} className='max-w-7xl mx-auto px-4 py-8' src={`http://localhost:5273/upload/video/${videourl}`}></video>
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
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="text-white font-semibold">{movie?.danhgia?.diem_tb || 0} / 10 </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar className="w-5 h-5" />
                      <span>{movie.ngay_phat_hanh}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock className="w-5 h-5" />
                      <span>45 phút</span>
                    </div>
                    
                  </div>

                  <div className="flex items-center gap-4 mb-8 flex-wrap">
                    <button
                      onClick={toggleFavorite}
                      className="group relative"
                    >
                      <div className={`
                                              flex items-center gap-2 px-5 py-3 rounded-xl transition-all duration-300
                                              ${liked
                          ? 'bg-red-500/20 border-2 border-red-500'
                          : 'bg-gray-800/50 border-2 border-gray-700 hover:border-gray-600'
                        }
                                          `}>
                        <Heart
                          className={`w-5 h-5 transition-all duration-300 ${liked ? "fill-red-500 text-red-500" : "text-gray-400 group-hover:text-red-500"
                            }`}
                        />
                        <span className={`font-medium ${liked ? 'text-red-500' : 'text-gray-400'}`}>
                          {liked ? 'Đã thích' : 'Yêu thích'}
                        </span>
                      </div>
                    </button>

                    <button className="flex items-center gap-2 bg-gray-800/50 backdrop-blur hover:bg-gray-700 text-gray-300 font-medium py-3 px-5 rounded-xl transition-all duration-300 border-2 border-gray-700 hover:border-gray-600">
                      <FaShare />
                      Chia sẻ
                    </button>

                    <button
                      // onClick={() => setIsRatingModalOpen(true)}
                      className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      <AiFillStar />
                      Đánh giá
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


                  <div className="bg-gray-900/50 backdrop-blur rounded-2xl p-8 mb-8 border border-gray-800">
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                      <Film className="text-red-500" />
                      Thông tin phim
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-800 rounded-lg">
                          <Calendar className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                          <span className="text-gray-500 text-sm">Năm phát hành</span>
                          <p className="text-white font-medium">{movie?.ngay_phat_hanh}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-800 rounded-lg">
                          <Globe className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                          <span className="text-gray-500 text-sm">Quốc gia</span>
                          <p className="text-white font-medium">{movie?.quocgia}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-800 rounded-lg">
                          <Clock className="w-5 h-5 text-green-500" />
                        </div>
                        <div>
                          <span className="text-gray-500 text-sm">Thời lượng</span>
                          <p className="text-white font-medium">{movie?.thoi_luong}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-800 rounded-lg">
                          <Film className="w-5 h-5 text-purple-500" />
                        </div>
                        <div>
                          <span className="text-gray-500 text-sm">Thể loại</span>
                          <p className="text-white font-medium">
                            {movie?.theloai?.map((tl, index) => (
                              <span key={index}>
                                {tl.ten}{index < movie.theloai.length - 1 ? ', ' : ''}
                              </span>
                            ))}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-800 rounded-lg">
                          <User className="w-5 h-5 text-yellow-500" />
                        </div>
                        <div>
                          <span className="text-gray-500 text-sm">Đạo diễn</span>
                          <p className="text-white font-medium">{movie?.daodien}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-800 rounded-lg">
                          <span className="text-orange-500 font-bold">HD</span>
                        </div>
                        <div>
                          <span className="text-gray-500 text-sm">Chất lượng</span>
                          <p className="text-white font-medium">HD Vietsub</p>
                        </div>
                      </div>


                    </div>
                  </div>

                  {/* dien vien */}
                  <div className="bg-gray-900/50 backdrop-blur rounded-2xl p-8 mb-8 border border-gray-800">
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-white mb-1">Dàn Diễn Viên</h3>
                      <div className="h-1 w-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
                    </div>

                    {/* Cast Grid */}
                    <div className="relative">
                      {/* Scroll Container */}
                      <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4">
                        {movie?.dienvien?.map((dv, index) => (
                          <div
                            key={dv.id}
                            onClick={() => router.push(`/actor/${dv.id}`)}
                            className="flex-shrink-0 group cursor-pointer transform transition-all duration-300 hover:scale-105"
                          >
                            {/* Actor Card */}
                            <div className="text-center w-28 md:w-32">
                              {/* Avatar Container */}
                              <div className="relative mb-3">
                                <div className="relative w-24 h-24 md:w-28 md:h-28 mx-auto">
                                  {/* Glow Effect on Hover */}
                                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"></div>

                                  {/* Avatar Image */}
                                  <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-gray-700 group-hover:border-red-500 transition-colors duration-300">
                                    {dv.anh ? (
                                      <img
                                        src={dv.anh}
                                        alt={dv.ten}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        onError={(e) => {
                                          e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(dv.ten) + '&background=1f2937&color=fff&size=200';
                                        }}
                                      />
                                    ) : (
                                      <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                                        <svg className="w-12 h-12 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                      </div>
                                    )}
                                  </div>

                                  {/* Online/Active Indicator (optional) */}
                                  {index === 0 && (
                                    <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                                      Chính
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Actor Name */}
                              <p className="text-white font-medium text-sm group-hover:text-red-400 transition-colors duration-300 line-clamp-2">
                                {dv.ten}
                              </p>

                              {/* Role (if available) */}
                              {dv.vaitro && (
                                <p className="text-gray-500 text-xs mt-1 line-clamp-1">
                                  {dv.vaitro}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}

                        {/* View More Button (if many actors) */}
                        {movie?.dienvien?.length > 8 && (
                          <div className="flex-shrink-0 flex items-center">
                            <button
                              onClick={() => router.push(`/movie/${movie.id}/cast`)}
                              className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gray-800/50 border-2 border-gray-700 hover:border-red-500 flex flex-col items-center justify-center group transition-all duration-300 hover:scale-105"
                            >
                              <svg className="w-8 h-8 text-gray-400 group-hover:text-red-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </svg>
                              <span className="text-gray-400 group-hover:text-red-400 text-xs mt-1 transition-colors">Xem thêm</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Gradient Fade Edges */}
                      {movie?.dienvien?.length > 5 && (
                        <>
                          <div className="absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-gray-900 to-transparent pointer-events-none"></div>
                          <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-gray-900 to-transparent pointer-events-none"></div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* CSS cho scrollbar ẩn */}
                  <style jsx>{`
    .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
    .scrollbar-hide::-webkit-scrollbar {
        display: none;
    }
`}</style>
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