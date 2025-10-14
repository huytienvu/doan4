"use client"
import React, { useEffect, useState } from 'react';
// import { useParams, useSearchParams } from 'next/navigation';
import { getMovieCategory, getMovieCountry, getMovieLoai } from '@/services/movie';
import MovieList from '@/components/user/listMovie/listmovie';
import { useParams } from 'next/navigation';
// import component vừa tách

const Page = () => {
    const [movies, setMovies] = useState([]);
    const params = useParams()
    const bo = params?.type;


    useEffect(() => {
        const fetchMovies = async () => {
            try {
                let data = [];
                
                    const result = await getMovieLoai(bo);
                    data = result;
                
                setMovies(data);
            } catch (err) {
                console.error('Lỗi khi lấy danh sách phim:', err);
            }
        };
        fetchMovies();
    }, [bo]);

    return <MovieList movies={movies} />;
};

export default Page;
