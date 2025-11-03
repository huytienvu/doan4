"use client"
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { filterMovie } from '@/services/movie';
import MovieList from '@/components/user/listMovie/listmovie';

const Page = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();

    useEffect(() => {
        const fetchFilteredMovies = async () => {
            setLoading(true);
            try {
                // Lấy các tham số từ URL
                const quocgia = searchParams.get('quocgia') || '';
                const theloai_id = searchParams.get('theloai_id') || '';
                const loai = searchParams.get('loai') || '';
                const nam = searchParams.get('nam') || '';

                console.log('Filter params:', { quocgia, theloai_id, loai, nam });

                // Gọi API lọc phim
                const data = await filterMovie(quocgia, theloai_id, loai, nam);
                setMovies(data);
            } catch (error) {
                console.error('Lỗi khi lọc phim:', error);
                setMovies([]);
            } finally {
                setLoading(false);
            }
        };

        fetchFilteredMovies();
    }, [searchParams]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                            <p className="text-gray-400">Đang tải kết quả lọc...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-2">Kết quả lọc phim</h1>
                    <p className="text-gray-400">
                        Tìm thấy {movies.length} phim phù hợp với bộ lọc của bạn
                    </p>
                </div>
                
                {movies.length > 0 ? (
                    <MovieList movies={movies} />
                ) : (
                    <div className="text-center py-16">
                        <div className="text-gray-400 mb-4">
                            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Không tìm thấy phim nào</h3>
                        <p className="text-gray-400 mb-6">
                            Hãy thử thay đổi bộ lọc để tìm thêm phim khác
                        </p>
                        <button 
                            onClick={() => window.history.back()}
                            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Quay lại
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Page;
