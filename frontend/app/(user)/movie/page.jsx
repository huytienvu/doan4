"use client"
import React, { useEffect, useState } from 'react';
import { FaPlay, FaEye } from 'react-icons/fa'; // Cần cài đặt react-icons
import { AiFillStar } from 'react-icons/ai'; // Cần cài đặt react-icons
import { getMoviebyId } from '@/services/movie';
import { useRouter, useSearchParams } from 'next/navigation';
import { IMAGE_URL } from '@/config/config';
import { Heart } from 'lucide-react';
import { checkFavorite, createFavorite, deleteFavorite } from '@/services/favorite';
import { Getiduser } from '@/utils/auth';
import { toast } from 'react-toastify';

const MovieDetail = () => {
    const [movie, setmoview] = useState(null);
    const [liked, setLiked] = useState(false);
    const paramsId = useSearchParams();
    const idMovie = paramsId.get('id');
    const router = useRouter();
    useEffect(() => {
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

        fetdata();
    }, [idMovie])

    async function toggleFavorite() {

        if(Getiduser()===null){
            toast.error("Bạn phải đăng nhập để sử dụng tính năng này")
        }
        if (liked) {
            await deleteFavorite(
                Getiduser(),
                idMovie

            );
            setLiked(false);

        } else {
            await createFavorite(
                {
                    "user_id": Getiduser(),
                    "phim_id": idMovie
                }
            );
            setLiked(true);
        }

    }
    return (
        <div className="bg-gray-900 min-h-screen">
            <div className="bg-gray-900 text-white min-h-screen p-4 mx-auto max-w-6xl">
                {/* Breadcrumb - Dùng để điều hướng */}
                <div className="text-gray-400 text-sm mb-4">
                    <span>Xem phim</span> &gt; <span>Phim Hài Hước</span> &gt; <span>Phim Chiếu Rạp</span> &gt; <span className="text-white">Em Xinh Tinh Quái</span>
                </div>

                {/* Main Content - Vùng chứa thông tin chính của phim */}
                <div className="relative rounded-lg overflow-hidden mb-6">
                    {/* Poster và Video Player - Hiển thị ảnh và nút play */}
                    <div className="relative w-full h-160">
                        <img
                            src={`${IMAGE_URL}/${movie?.anh_dai_dien}`} // Đổi URL ảnh của bạn tại đây
                            alt="Em Xinh Tinh Quái Poster"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <button className="text-white text-6xl hover:scale-110 transition-transform duration-300">
                                <FaPlay className="text-white" />
                            </button>
                        </div>
                    </div>

                    {/* Info Box - Hộp thông tin nhỏ bên trái */}
                    <div className="absolute bottom-4 left-4 flex items-center space-x-2">
                        <img
                            src={`${IMAGE_URL}/${movie?.anh_dai_dien}`} // Ảnh nhỏ
                            alt="Thumbnail"
                            className="w-56 h-36 object-cover rounded-lg"
                        />
                        <div className="flex flex-col space-y-2">
                            <h1 className="text-2xl font-bold">{movie?.ten}</h1>
                            <h2 className="text-lg text-gray-400">{movie?.ten_tieng_anh}</h2>
                            <div className="flex space-x-2">
                                <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                                    <FaPlay className="inline mr-2" />
                                    Trailer
                                </button>
                                <button className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded" onClick={() => router.push(`/moviedetail?id=${idMovie}`)}>
                                    <FaEye className="inline mr-2" />
                                    Xem phim
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* User Actions - Các nút tương tác như Thích, Chia sẻ */}
                <div className="flex items-center space-x-4 mb-6">
                    <button
                        onClick={toggleFavorite}
                        className="text-white font-bold py-2 px-4 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-110"
                    >
                        <Heart
                            className={`w-6 h-6 transition-colors duration-300 ${liked ? "fill-red-500 text-red-500" : "fill-white text-white"
                                }`}
                        />
                    </button>
                    <button className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full">
                        Chia sẻ
                    </button>
                    <div className="flex items-center text-yellow-400">
                        <AiFillStar />
                        <AiFillStar />
                        <AiFillStar />
                        <AiFillStar />
                        <AiFillStar className="text-gray-500" />
                        <span className="text-sm ml-2 text-white">(8 đ/33 lượt)</span>
                    </div>
                </div>

                {/* Film Information Grid - Bảng thông tin chi tiết */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-400 mb-6">
                    <div>
                        <span className="font-bold text-white">Đang phát:</span> HD Vietsub
                    </div>
                    <div>
                        <span className="font-bold text-white">Năm Phát Hành:</span> {movie?.ngay_phat_hanh}
                    </div>
                    <div>
                        <span className="font-bold text-white">Quốc gia:</span> {movie?.quocgia}
                    </div>
                    <div>
                        <span className="font-bold text-white">Thể loại:</span>
                        {
                            movie?.theloai.map(theloai => (
                                <span> {theloai.ten}, </span>
                            ))
                        }
                    </div>
                    <div>
                        <span className="font-bold text-white">Đạo diễn:</span> {movie?.daodien}
                    </div>
                    <div>
                        <span className="font-bold text-white">Thời lượng:</span> {movie?.thoi_luong}
                    </div>
                    <div className="col-span-1 md:col-span-2 lg:col-span-3">
                        <span className="font-bold text-white">Diễn viên:</span>
                        {
                            movie?.dienvien.map(dienvien => (
                                <span> {dienvien.ten}, </span>
                            ))
                        }
                    </div>
                </div>

                {/* Description - Mô tả phim */}
                <div>
                    <h3 className="text-xl font-bold mb-2">Thông tin bộ phim</h3>
                    <p className="text-gray-400">
                        Em Xinh Tinh Quái Pretty Crazy 2025 Gil-goo là một thanh niên thất nghiệp sống trên một hòm hàng xóm mới chuyển vào tầng dưới là Seon-ji thu hút anh bởi vẻ dịu dàng như ban mai, nhưng một sáng sớm Seon-ji lại biến thành người khác — một thực thể quỷ dữ mà cô không nhờ được hành động của mình. Gia đình Seon-ji thuê Gil-goo để làm người bảo vệ vào những lúc cô bị "thúc đẩy" như vậy. Từ đó anh bị cuốn vào giữa sự tò mò và sợ hãi — liệu có thể giữ được lời nói bí mật về Seon-ji không? Hãy cùng phimmoi.com chờ xem.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MovieDetail;