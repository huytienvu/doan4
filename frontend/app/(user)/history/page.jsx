"use client";
import { IMAGE_URL } from "@/config/config";
import { getFavoriteUser } from "@/services/favorite";
import { deleteHistory, getHistoryUser } from "@/services/history";
import { Getiduser, getRole } from "@/utils/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function History() {
  const router = useRouter();
  const [movie, setMovie] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchdata = async () => {
    try {
      const res = await getHistoryUser(Getiduser());
      setMovie(res || []);

    } catch (error) {
      console.error("Lỗi khi load danh sách yêu thích:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchdata();
  }, []);
  const abc = async (id) => {
    await deleteHistory(Getiduser(), id)
    fetchdata();
  }

  return (
    <div className="min-h-screen bg-black text-gray-100 px-4 py-24">
      <div className="max-w-7xl mx-auto">
        {/* Header title */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-yellow-500 mb-3 tracking-wide">
            🎬 Phim bạn đang xem
          </h1>
          <div className="w-24 h-[2px] bg-red-600 mx-auto mb-6"></div>
          <p className="text-gray-400 text-sm md:text-base">
            Xem tiếp những bộ phim để trải nghiệm nào
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 text-gray-400">
            <div className="w-12 h-12 border-4 border-gray-700 border-t-red-600 rounded-full animate-spin mb-4"></div>
            <p>Đang tải danh sách yêu thích...</p>
          </div>
        ) : movie.length === 0 ? (
          // Không có phim
          <div className="flex flex-col items-center justify-center py-40 text-gray-400">
            <img
              src="/images/empty_favorite.png"
              alt="No favorites"
              className="w-40 h-40 mb-6 opacity-70"
            />
            <p className="text-xl font-semibold mb-2">
              Bạn chưa có phim yêu thích nào
            </p>
            <p className="text-gray-500">
              Hãy thêm một vài bộ phim để xem sau nhé ❤️
            </p>
          </div>
        ) : (
          // Danh sách phim
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {movie.map((m) => (
              <div
                key={m.phim_id}
                className="group relative bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-red-600 hover:shadow-[0_0_15px_rgba(255,0,0,0.3)] transition-all duration-300 cursor-pointer"
                
              >
                <div className="relative overflow-hidden aspect-[3/4]" onClick={() => {
                  if (m.so_tap != null && m.so_tap !== "") {

                    router.push(`/moviedetail?id=${m.phim_id}&tap=${m.so_tap}`)
                  }
                  else {

                    router.push(`/moviedetail?id=${m.phim_id}`)
                  }
                }
                }>
                  <img
                    src={`${IMAGE_URL}/${m.anh_dai_dien}`}
                    alt={m.ten}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-1 bg-red-600/90 backdrop-blur-sm text-white text-xs font-bold rounded">
                    HD
                  </span>
                </div>
                <div className="absolute top-2 right-2" onClick={() => abc(m.phim_id)}>
                  <span className="px-2 py-1 bg-white backdrop-blur-sm text-black text-xs font-bold rounded-2xl">
                    X
                  </span>
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
                      Tập đang xem: {m.so_tap}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
