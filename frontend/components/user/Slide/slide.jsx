"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getListMovie } from "@/services/movie";
import { useRouter } from "next/navigation";
import { IMAGE_URL } from "@/config/config";
import { ArrowRight } from "lucide-react";

const Slider = dynamic(() => import("react-slick"), { ssr: false });

export default function MovieSlider({ huy , data=[]}) {
  const [movies, setMovies] = useState([]);
  const router = useRouter();

  const fet = async () => {
    const mivoe = await getListMovie();
    setMovies(mivoe);
  };

  useEffect(() => {
    fet();
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 4 } },
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section className="py-10 bg-black">
      <div className="w-full px-24 flex flex-col md:flex-row md:items-start gap-8">
        {/* BÊN TRÁI */}
        <div className="md:w-1/10 flex flex-col justify-between md:pt-4">
          <div>
            <h2 className="text-3xl font-bold text-purple-300 mb-3">
              {huy || "Phim Hàn Quốc mới"}
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Tuyển chọn những bộ phim {huy} mới nhất, hấp dẫn nhất dành cho bạn.
            </p>
          </div>
          <button
            onClick={() => router.push("/category/han-quoc")}
            className="mt-6 inline-flex items-center text-purple-200 hover:text-yellow-400 transition-colors duration-300 text-base font-medium"
          >
            <span>Xem toàn bộ</span>
            <ArrowRight className="ml-2 w-4 h-4" />
          </button>
        </div>

        {/* BÊN PHẢI */}
        <div className="md:w-9/10 w-full">
          <Slider {...settings}>
            {data.map((movie) => (
              <div
                key={movie.id}
                className="px-2 cursor-pointer"
                onClick={() => router.push(`/movie?id=${movie.id}`)}
              >
                <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105">
                  <div className="relative w-full h-48">
                    <Image
                      src={`${IMAGE_URL}/${movie.anh_dai_dien}`}
                      alt={movie.ten}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                  </div>
                  <div className="p-3 text-center">
                    <h3 className="text-sm font-semibold text-white truncate">
                      {movie.ten}
                    </h3>
                    {movie.ten_tieng_anh && (
                      <p className="text-xs text-gray-400 truncate italic">
                        {movie.ten_tieng_anh}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
}
