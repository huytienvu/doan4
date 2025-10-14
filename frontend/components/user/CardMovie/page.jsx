// components/MovieCard.js
import Image from 'next/image';

const MovieCard = ({ title, imageUrl, rating }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden transform hover:scale-105 transition duration-300 ease-in-out cursor-pointer">
      {/* Container cho ảnh và overlay Rating */}
      <div className="relative w-full h-72">
        <Image
          src={imageUrl}
          alt={title}
          layout="fill"
          objectFit="cover"
          className="transition-opacity duration-300"
        />
        {/* Rating Badge */}
        <span className="absolute top-2 right-2 bg-yellow-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md">
          {rating}
        </span>
      </div>
      
      {/* Thông tin phim */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
          {title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Phim Hành Động / Phiêu Lưu
        </p>
      </div>
    </div>
  );
};

export default MovieCard;