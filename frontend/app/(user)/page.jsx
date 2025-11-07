"use client"
import MovieBannerSlider from "@/components/user/Banner/banner";
import MovieSlider from "../../components/user/Slide/slide";
import { useRouter } from "next/navigation";
import { getHistoryUser } from "@/services/history";
import { useEffect, useState } from "react";
import { IMAGE_URL } from "@/config/config";
import { ArrowRight } from "lucide-react"; // 🠔 thêm icon
import { getMovieLoai } from "@/services/movie";
import { Getiduser } from "@/utils/auth";

export default function Home() {
    const router = useRouter();
    const [movie, setMovie] = useState([]);
    const [loading, setLoading] = useState(true);
    const [movieLe, setMovieLe] = useState([]);
    const [movieBo, setMovieBo] = useState([]);


    const fetchdata = async () => {
        try {
            const res = await getHistoryUser(Getiduser());
            const resLe = await getMovieLoai('le',1)
            const resBo = await getMovieLoai('bo',1)

            setMovieLe(resLe.phim)
            setMovieBo(resBo.phim)

            setMovie((res || []).slice(0, 8));
        } catch (error) {
            console.error("Lỗi khi load danh sách phim:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchdata();
    }, []);

    return (
        <>
            <MovieBannerSlider />
            {movie.length > 0 && (

                <div className="bg-black text-gray-100 px-4 py-16">
                    <div className="w-full px-10">
                        {/* Tiêu đề + nút xem thêm */}
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-yellow-500 flex items-center gap-2">
                                🎬 Phim bạn đang xem
                            </h2>
                            <button
                                onClick={() => router.push("/history")}
                                className="flex items-center gap-2 text-sm md:text-base text-red-500 hover:text-yellow-400 transition-colors duration-300"
                            >
                                <span>Xem thêm</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Danh sách phim */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-6">
                            {movie.map((m) => (
                                <div
                                    key={m.phim_id}
                                    className="group bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-red-600 hover:shadow-[0_0_15px_rgba(255,0,0,0.3)] transition-all duration-300 cursor-pointer"
                                    onClick={() => {
                                        if (m.so_tap != null && m.so_tap !== "") {
                                            router.push(`/moviedetail?id=${m.phim_id}&tap=${m.so_tap}`);
                                        } else {
                                            router.push(`/moviedetail?id=${m.phim_id}`);
                                        }
                                    }}
                                >
                                    <div className="relative overflow-hidden aspect-[3/4]">
                                        <img
                                            src={`${IMAGE_URL}/${m.anh_dai_dien}`}
                                            alt={m.ten}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>

                                    <div className="p-3">
                                        <h3 className="text-center text-white font-semibold text-sm md:text-base mb-1 line-clamp-2">
                                            {m.ten}
                                        </h3>
                                        <p className="text-center text-gray-400 text-xs md:text-sm line-clamp-1 italic">
                                            {m.ten_tieng_anh}
                                        </p>
                                        {m.so_tap != null && m.so_tap !== "" && (
                                            <p className="text-center text-amber-200 text-xs font-medium mt-1">
                                                🎞️ Tập đang xem: {m.so_tap}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <MovieSlider huy={"Phim lẻ"} data={movieLe} />
            <MovieSlider huy={"Phim bộ"} data={movieBo} />
            {/* <MovieSlider huy={"Phim chiếu rạp"} /> */}
        </>
    );
}
