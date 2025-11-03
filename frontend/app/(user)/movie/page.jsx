"use client"
import React, { useEffect, useState } from 'react';
import { FaPlay, FaEye, FaShare, FaTimes } from 'react-icons/fa';
import { AiFillStar } from 'react-icons/ai';
import { getMoviebyId } from '@/services/movie';
import { useRouter, useSearchParams } from 'next/navigation';
import { IMAGE_URL } from '@/config/config';
import { Heart, Calendar, Clock, Globe, Film, User } from 'lucide-react';
import { checkFavorite, createFavorite, deleteFavorite } from '@/services/favorite';
import { Getiduser } from '@/utils/auth';
import { toast } from 'react-toastify';
import CommentBox from '@/components/user/Comments/comments';
import { addRatingMovie, CheckRatingMovie } from '@/services/rating';

// Rating Modal Component
const RatingModal = ({ isOpen, onClose, movieTitle,onRatingSuccess }) => {
    const [selectedRating, setSelectedRating] = useState(null);
    const [reviewText, setReviewText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const ratings = [
        { value: 10, emoji: '😍', label: 'Tuyệt vời', color: 'from-green-500 to-emerald-500' },
        { value: 8, emoji: '😊', label: 'Phim hay', color: 'from-blue-500 to-cyan-500' },
        { value: 6, emoji: '😐', label: 'Khá ổn', color: 'from-yellow-500 to-amber-500' },
        { value: 4, emoji: '😴', label: 'Phim chán', color: 'from-orange-500 to-red-500' },
        { value: 2, emoji: '🤮', label: 'Dở tệ', color: 'from-red-600 to-red-800' }
    ];
    
  const paramsId = useSearchParams();
  const idMovie = paramsId.get('id');

    const handleSubmit = async () => {
        if (!selectedRating) {
            toast.error('Vui lòng chọn mức đánh giá');
            return;
        }
        if(Getiduser() === null){
            toast.error("Bạn phải đăng nhập để sử dụng tính năng này")
            return;
        }
        
        const check = await CheckRatingMovie(
            {
                "user_id":Getiduser(),
                "phim_id": idMovie
            }
        )
        if(check){
            toast.error("Ban da danh gia")
            return;
        }
        setIsSubmitting(true);
        // Simulate API call
        setTimeout( async () => {
            
            await addRatingMovie (
                {
                    "user_id": Getiduser(),
                    "phim_id":idMovie,
                    "diem": selectedRating,
                    "danhgia":reviewText
                }
            )
            if (onRatingSuccess) {
                onRatingSuccess();
            }
            toast.success('Đánh giá của bạn đã được gửi!');
            onClose();
            setSelectedRating(null);
            setReviewText('');
            setIsSubmitting(false);
        }, 1000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-gradient-to-b from-gray-900 to-gray-950 rounded-2xl shadow-2xl border border-gray-800 w-full max-w-lg overflow-hidden animate-slideUp">
                {/* Header */}
                <div className="bg-gradient-to-r from-red-600/20 to-purple-600/20 p-6 border-b border-gray-800">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-1">Đánh giá phim</h2>
                            <p className="text-gray-400 text-sm">{movieTitle}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
                        >
                            <FaTimes size={20} />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6">
                    {/* Rating Selection */}
                    <div className="mb-6">
                        <p className="text-gray-300 text-sm mb-4">Bạn cảm thấy phim này như thế nào?</p>
                        <div className="grid grid-cols-5 gap-3">
                            {ratings.map((rating) => (
                                <button
                                    key={rating.value}
                                    onClick={() => setSelectedRating(rating.value)}
                                    className={`relative group transition-all duration-300 ${selectedRating === rating.value ? 'scale-110' : 'hover:scale-105'
                                        }`}
                                >
                                    <div className={`
                                        p-4 rounded-xl border-2 transition-all duration-300
                                        ${selectedRating === rating.value
                                            ? `bg-gradient-to-br ${rating.color} border-transparent shadow-lg`
                                            : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                                        }
                                    `}>
                                        <div className="text-3xl mb-1">{rating.emoji}</div>
                                        <div className={`text-xs font-medium ${selectedRating === rating.value ? 'text-white' : 'text-gray-400'
                                            }`}>
                                            {rating.label}
                                        </div>
                                    </div>
                                    {selectedRating === rating.value && (
                                        <div className="absolute -top-2 -right-2 bg-white rounded-full p-1">
                                            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Review Text */}
                    <div className="mb-6">
                        <label className="block text-gray-300 text-sm mb-2">
                            Chia sẻ thêm về cảm nhận của bạn (tùy chọn)
                        </label>
                        <textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder="Viết đánh giá của bạn..."
                            className="w-full bg-gray-800/50 text-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-gray-800 transition-all placeholder-gray-500 resize-none h-32"
                        />
                        <div className="text-right mt-1">
                            <span className="text-xs text-gray-500">{reviewText.length}/500</span>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!selectedRating || isSubmitting}
                            className={`flex-1 font-semibold py-3 px-6 rounded-xl transition-all duration-300 ${selectedRating
                                    ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white transform hover:scale-105 shadow-lg'
                                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Đang gửi...
                                </span>
                            ) : (
                                'Gửi đánh giá'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MovieDetail = () => {
    const [movie, setmoview] = useState(null);
    const [liked, setLiked] = useState(false);
    const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const paramsId = useSearchParams();
    const idMovie = paramsId.get('id');
    const router = useRouter();

    const fetdata = async () => {
        const data = await getMoviebyId(idMovie);
        setmoview(data);

        const objCheck = {
            user_id: Getiduser(),
            phim_id: idMovie
        }
        const res = await checkFavorite(objCheck);
        setLiked(res);
    }

    useEffect(() => { 
        fetdata();
    }, [idMovie])

    const handleRatingSuccess = async () => {
        // Force refresh CommentBox bằng cách thay đổi key
        setRefreshKey(prev => prev + 1);
        
        // Cập nhật lại thông tin phim để có điểm đánh giá mới
        const updatedMovie = await getMoviebyId(idMovie);
        setmoview(updatedMovie);
    };


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

    return (
        <div className="page-container bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 min-h-screen">
            <div className="text-white min-h-screen p-4 mx-auto max-w-7xl">
                {/* Breadcrumb */}
                <div className="text-gray-500 text-sm mb-6 flex items-center gap-2">
                    <span className="hover:text-gray-300 cursor-pointer transition-colors">Xem phim</span>
                    <span>›</span>
                    <span className="hover:text-gray-300 cursor-pointer transition-colors">Phim Hài Hước</span>
                    <span>›</span>
                    <span className="hover:text-gray-300 cursor-pointer transition-colors">Phim Chiếu Rạp</span>
                    <span>›</span>
                    <span className="text-white font-semibold">{movie?.ten}</span>
                </div>

                {/* Main Content */}
                <div className="relative rounded-2xl overflow-hidden mb-8 shadow-2xl">
                    {/* Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent z-10" />

                    {/* Poster và Video Player */}
                    <div className="relative w-full h-[500px]">
                        <img
                            src={`${IMAGE_URL}/${movie?.anh_dai_dien}`}
                            alt={movie?.ten}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center z-20">
                            <button className="group relative">
                                <div className="absolute inset-0 bg-red-600 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300 opacity-60" />
                                <div className="relative bg-red-600/90 backdrop-blur p-6 rounded-full hover:bg-red-700 transition-all duration-300 hover:scale-110">
                                    <FaPlay className="text-white text-3xl ml-1" />
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Info Box */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                        <div className="flex items-end gap-6">
                            <img
                                src={`${IMAGE_URL}/${movie?.anh_dai_dien}`}
                                alt="Thumbnail"
                                className="w-48 h-72 object-cover rounded-xl shadow-2xl border-2 border-gray-800"
                            />
                            <div className="flex-1 space-y-4">
                                <div>
                                    <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                        {movie?.ten}
                                    </h1>
                                    <h2 className="text-xl text-gray-400">{movie?.ten_tieng_anh}</h2>
                                </div>

                                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-900/20 via-amber-900/20 to-yellow-900/20 px-5 py-2.5 rounded-full border border-yellow-500/30 backdrop-blur">
                                    {/* Star Icon */}
                                    <AiFillStar className="text-yellow-400 text-xl animate-pulse" />

                                    {/* Rating */}
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-400">
                                            {movie?.danhgia?.diem_tb || 0}
                                        </span>
                                        <span className="text-yellow-500 text-sm">/10</span>
                                    </div>

                                    {/* Divider */}
                                    <div className="w-px h-5 bg-yellow-500/30"></div>

                                    {/* Count */}
                                    <span className="text-yellow-400 font-medium">
                                        {movie?.danhgia?.so_luot || 0} đánh giá
                                    </span>
                                </div>

                                <div className="flex gap-3">
                                    <button className="group bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2">
                                        <FaPlay className="group-hover:scale-110 transition-transform" />
                                        Trailer
                                    </button>
                                    <button
                                        onClick={() => router.push(`/moviedetail?id=${idMovie}`)}
                                        className="bg-gray-800/80 backdrop-blur hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 border border-gray-700 hover:border-gray-600 flex items-center gap-2"
                                    >
                                        <FaEye />
                                        Xem phim
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* User Actions */}
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
                        onClick={() => setIsRatingModalOpen(true)}
                        className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                        <AiFillStar />
                        Đánh giá
                    </button>
                </div>

                {/* Film Information Grid */}
                <div className="bg-gray-900/50 backdrop-blur rounded-2xl p-8 mb-8 border border-gray-800">
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <Film className="text-red-500" />
                        Thông tin phim
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

                        <div className="col-span-full">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-gray-800 rounded-lg mt-1">
                                    <User className="w-5 h-5 text-cyan-500" />
                                </div>
                                <div className="flex-1">
                                    <span className="text-gray-500 text-sm">Diễn viên</span>
                                    <p className="text-white font-medium">
                                        {movie?.dienvien?.map((dv, index) => (
                                            <span onClick={() => router.push(`/actor/${dv.id}`)} key={index} className="inline-block hover: cursor-pointer mr-2 mb-2 px-3 py-1 bg-gray-800 rounded-lg text-sm">
                                                {dv.ten}
                                            </span>
                                        ))}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="bg-gray-900/50 backdrop-blur rounded-2xl p-8 mb-8 border border-gray-800">
                    <h3 className="text-2xl font-bold mb-4">Nội dung phim</h3>
                    <p className="text-gray-400 leading-relaxed">
                        {movie?.mota}
                    </p>
                </div>

                <CommentBox key={refreshKey} id={idMovie} />
            </div>

            {/* Rating Modal */}
            <RatingModal
                isOpen={isRatingModalOpen}
                onClose={() => setIsRatingModalOpen(false)}
                movieTitle={movie?.ten}
                onRatingSuccess={handleRatingSuccess}
            />
        </div>
    );
};

export default MovieDetail;