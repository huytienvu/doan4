"use client";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { getAllCategory } from "@/services/category";
import { getAllCountry } from "@/services/quocgia";
import { useRouter } from "next/navigation";

export default function MovieFilter() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    countries: [],
    types: [],
    genres: [],
    years: [],
  });
  const [countryList, setCountryList] = useState([]);
  const [genreList, setGenreList] = useState([]);
  const [loading, setLoading] = useState(false);

  const typeList = ["Phim bộ", "Phim lẻ"];
  const yearList = Array.from({ length: 15 }, (_, i) => 2025 - i);

  // Load data từ API
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [countries, categories] = await Promise.all([
          getAllCountry(),
          getAllCategory()
        ]);
        setCountryList(countries);
        setGenreList(categories);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);


  const toggleFilter = (category, value) => {
    setFilters((prev) => {
      const current = prev[category];
      const isSelected = current.includes(value);
      return {
        ...prev,
        [category]: isSelected
          ? current.filter((v) => v !== value)
          : [...current, value],
      };
    });
  };

  const applyFilter = () => {
    // Tạo query parameters
    const params = new URLSearchParams();

    // Quốc gia: lấy tên
    if (filters.countries.length > 0) {
      params.append('quocgia', filters.countries.map(c => c.quocgia).join(','));
    } else {
      params.append('quocgia', '');
    }

    // Thể loại: lấy id
    if (filters.genres.length > 0) {
      const genreIds = filters.genres.map(genre => genre.id).join(',');
      params.append('theloai_id', genreIds);
    } else {
      params.append('theloai_id', '');
    }

    // Loại phim
    if (filters.types.length > 0) {
      const typeValues = filters.types.map(type => type === 'Phim bộ' ? 'bo' : 'le').join(',');
      params.append('loai', typeValues);
    } else {
      params.append('loai', '');
    }

    // Năm
    if (filters.years.length > 0) {
      params.append('nam', filters.years.join(','));
    } else {
      params.append('nam', '');
    }

    // Chuyển đến trang filter
    router.push(`/filter?${params.toString()}`);
    setIsOpen(false);
  };

  const clearAll = () => {
    setFilters({ countries: [], types: [], genres: [], years: [] });
  };

  return (
    <div className="relative page-container">
      <button
        onClick={() => setIsOpen(true)}
        className="bg-red-400 my-10 text-white px-4 py-2 rounded-lg hover:bg-red-500"
      >
        Bộ lọc
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-gray-900 w-full max-w-3xl rounded-xl shadow-lg p-6 relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={22} />
            </button>

            <h2 className="text-xl font-semibold mb-4 text-white">
              Bộ lọc phim
            </h2>

            {/* Quốc gia */}
            <div className="mb-4">
              <h3 className="font-medium text-red-400 mb-2">Quốc gia</h3>
              {loading ? (
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="px-3 py-1.5 bg-gray-200 rounded-full animate-pulse">
                      <div className="w-16 h-4"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {countryList.map((country) => {
                    const isSelected = filters.countries.some(selectedCountry =>
                      selectedCountry.id === country.id
                    );

                    return (
                      <button
                        key={country.id}
                        onClick={() => toggleFilter("countries", country)}
                        className={`px-3 py-1.5 rounded-full border text-sm transition ${isSelected
                            ? "bg-gray-900 text-red-400 border-gray-900"
                            : "bg-gray-900 text-white border-gray-900 hover:text-white"
                          }`}
                      >
                        {country.quocgia}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Loại */}
            <div className="mb-4">
              <h3 className="font-medium text-red-400 mb-2">Loại phim</h3>
              <div className="flex flex-wrap gap-2">
                {typeList.map((type) => {
                  const isSelected = filters.types.includes(type);

                  return (
                    <button
                      key={type}
                      onClick={() => toggleFilter("types", type)}
                      className={`px-3 py-1.5 rounded-full border text-sm transition ${isSelected
                          ? "bg-gray-900 text-red-400 border-gray-900"
                          : "bg-gray-900 text-white border-gray-900 hover:text-white"
                        }`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Thể loại */}
            <div className="mb-4">
              <h3 className="font-medium text-red-400 mb-2">Thể loại</h3>
              {loading ? (
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="px-3 py-1.5 bg-gray-200 rounded-full animate-pulse">
                      <div className="w-16 h-4"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {genreList.map((genre) => {
                    const isSelected = filters.genres.some(selectedGenre =>
                      selectedGenre.id === genre.id
                    );

                    return (
                      <button
                        key={genre.id}
                        onClick={() => toggleFilter("genres", genre)}
                        className={`px-3 py-1.5 rounded-full border text-sm transition ${isSelected
                            ? "bg-gray-900 text-red-400 border-gray-900"
                            : "bg-gray-900 text-white border-gray-900 hover:text-white"
                          }`}
                      >
                        {genre.ten}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Năm phát hành */}
            <div className="mb-4">
              <h3 className="font-medium text-red-400 mb-2">Năm phát hành</h3>
              <div className="flex flex-wrap gap-2">
                {yearList.map((year) => {
                  const isSelected = filters.years.includes(year);

                  return (
                    <button
                      key={year}
                      onClick={() => toggleFilter("years", year)}
                      className={`px-3 py-1.5 rounded-full border text-sm transition ${isSelected
                          ? "bg-gray-900 text-red-400 border-gray-900"
                            : "bg-gray-900 text-white border-gray-900 hover:text-white"
                        }`}
                    >
                      {year}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={clearAll}
                className="px-4 py-2 border rounded-lg text-white"
              >
                Xóa tất cả
              </button>
              <button
                onClick={applyFilter}
                className="px-4 py-2 bg-red-400  text-white rounded-lg hover:bg-red-500"
              >
                Áp dụng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

