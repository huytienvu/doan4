"use client"
import React, { useEffect, useState } from 'react';
// import { useParams, useSearchParams } from 'next/navigation';
import { getMovieCategory, getMovieCountry, getMovieLoai } from '@/services/movie';
import MovieList from '@/components/user/listMovie/listmovie';
import { useParams } from 'next/navigation';
import ReactPaginate from 'react-paginate';
// import component vừa tách

const Page = () => {
    const [movies, setMovies] = useState([]);
    const params = useParams()
    const quocgia = params?.sluug;

    const handlePageClick = (event) => {
        settranghientai(event.selected);

    };
    const [tranghientai, settranghientai] = useState(0);
    const [tongtrang, settongtrang] = useState(0);

    useEffect(() => {
        const fetchMovies = async (page) => {
            try {
                let data = [];

                const result = await getMovieCountry(quocgia, page + 1);
                data = result.phim;
                settongtrang(result.total_pages)

                setMovies(data);
            } catch (err) {
                console.error('Lỗi khi lấy danh sách phim:', err);
            }
        };
        fetchMovies(tranghientai);
    }, [quocgia, tranghientai]);

    return (
        <div>
            <MovieList movies={movies} />
            <div className="bg-gray-900 px-4 py-4 ">
                <ReactPaginate
                    breakLabel="..."
                    nextLabel=">"
                    onPageChange={
                        handlePageClick
                    }
                    pageRangeDisplayed={3}
                    pageCount={tongtrang} // Sử dụng giá trị total từ API (đã là tổng số trang)
                    previousLabel="<"
                    renderOnZeroPageCount={null}
                    containerClassName="pagination"
                    pageLinkClassName="page-num"
                    previousLinkClassName="page-num"
                    nextLinkClassName="page-num"
                    activeLinkClassName="active"
                    forcePage={tranghientai} // Đảm bảo trang hiện tại được highlight đúng
                />
            </div>

        </div>
    )
};

export default Page;
