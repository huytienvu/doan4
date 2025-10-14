import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Play, Heart, Star, Plus } from 'lucide-react';
import { getMovieNEW } from '@/services/movie';
import { IMAGE_URL } from '@/config/config';
import { useRouter } from 'next/navigation';
import { checkFavorite, createFavorite, deleteFavorite } from '@/services/favorite';
import { Getiduser } from '@/utils/auth';
import { toast } from 'react-toastify';

const MovieBannerSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [movie, setMovie] = useState([]);
  const [liked, setLiked] = useState(false);

  const router = useRouter();
  const fetbanner = async () => {
    const api = await getMovieNEW();
    setMovie(api);
    setCurrentSlide(0);

  }
  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      if (movie.length === 0) return;
      const phimId = movie[currentSlide].id;
      const res = await checkFavorite({
        user_id: Getiduser(),
        phim_id: phimId
      });
      setLiked(res);
    };
    fetchFavoriteStatus();
  }, [movie, currentSlide]);
  
  
  const hanleFavorite = async (id) => {

    if(Getiduser()===null){
      toast.error("Bạn phải đăng nhập để sử dụng tính năng này")
      return;
    }
    if (liked) {
      await deleteFavorite(
        Getiduser(),
        id

      );
      setLiked(false);

    } else {
      await createFavorite(
        {
          "user_id": Getiduser(),
          "phim_id": id
        }
      );
      setLiked(true);
    }
  }
  useEffect(() => {
    fetbanner();
  }, [])



  const nextSlide = () => {
    if (movie.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % movie.length);
  };

  const prevSlide = () => {
    if (movie.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + movie.length) % movie.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };


  const currentBanner = movie[currentSlide];

  return (
    <div className="relative w-full bg-black overflow-hidden">
      {/* Banner Container */}
      <div className="relative w-full h-[500px]">
        {movie.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            Đang tải...
          </div>
        ) : (
          <>
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
              <img
                src={`${IMAGE_URL}/${currentBanner.anh_dai_dien}`}
                alt={currentBanner.ten}
                className="w-full h-full object-cover"
              />
              {/* Gradient Overlays */}
              {/* <div className="absolute inset-0 bg-gradient-to-r from-black via-black/10 to-transparent" /> */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-7xl mx-auto px-8 w-full">
                <div className="max-w-2xl">
                  {/* Title */}
                  <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                    {currentBanner.ten}
                  </h1>

                  {/* Rating & Year */}
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-gray-300 text-lg">{currentBanner.ngay_phat_hanh}</span>
                  </div>

                  {/* Genres */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {currentBanner.theloai.map((theloai, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium border border-white/30"
                      >
                        {theloai.ten}
                      </span>
                    ))}
                  </div>

                  {/* Description */}
                  <p className="text-gray-200 text-lg mb-8 line-clamp-3 drop-shadow-lg">
                    {currentBanner.mota}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <button className="px-4 py-4 bg-red-600 hover:bg-red-700 text-white rounded-4xl font-semibold flex items-center gap-3 transition-all transform hover:scale-105 shadow-lg" onClick={() => router.push(`moviedetail?id=${currentBanner.id}`)}>
                      <Play className="w-6 h-6" fill="white" />

                    </button>

                    <button
                      onClick={() => hanleFavorite(currentBanner.id)}
                      className="text-white font-bold py-2 px-4 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-110"
                    >
                      <Heart
                        className={`w-6 h-6 transition-colors duration-300 ${liked ? "fill-red-500 text-red-500" : "fill-white text-white"
                          }`}
                      />
                    </button>

                    <button className="px-6 py-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-lg font-semibold flex items-center gap-3 transition-all transform hover:scale-105 border border-white/30 shadow-lg">
                      <Plus className="w-6 h-6" />
                      Danh sách
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all border border-white/20 z-10"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all border border-white/20 z-10"
            >
              <ChevronRight className="w-7 h-7" />
            </button>
          </>
        )}
      </div>

      {/* Dots Indicator */}
      {/* <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all ${currentSlide === index
                ? 'w-12 h-3 bg-red-600'
                : 'w-3 h-3 bg-white/50 hover:bg-white/70'
              } rounded-full`}
          />
        ))}
      </div> */}

      {/* Thumbnails Preview (Optional) */}
      <div className="bg-gradient-to-b from-black/80 to-transparent py-4">

        <div className="max-w-7xl mx-auto px-8">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide">

            {movie.map((banner, index) => (
              <button
                key={banner.id}
                onClick={() => goToSlide(index)}
                className={`flex-shrink-0 relative group ${currentSlide === index ? 'ring-4 ring-red-600' : ''
                  } rounded-lg overflow-hidden transition-all`}
              >
                <img
                  src={`${IMAGE_URL}/${banner.anh_dai_dien}`}
                  alt={banner.ten}
                  className="w-28 h-12 object-cover"
                />
                <div className={`absolute inset-0 ${currentSlide === index
                  ? 'bg-red-600/20'
                  : 'bg-black/50 group-hover:bg-black/30'
                  } transition-all`} />

              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieBannerSlider;