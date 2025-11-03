"use client"
import React, { useEffect, useState } from 'react';
// import { useParams, useSearchParams } from 'next/navigation';

import MovieList from '@/components/user/listMovie/listmovie';
import { useParams, useSearchParams } from 'next/navigation';
import { SearchMovie } from '@/services/movie';
import { Search_actor } from '@/services/actor';
// import component vừa tách

const Search = () => {
    const [movies, setMovies] = useState([]);
    const [actor, setActor] = useState([]);
    const params = useSearchParams();

    const name = params.get("q");
    

    useEffect(() => {
        const fetchMovies = async () => {
            
            const res =await SearchMovie(name,1);
            setMovies(res.data)
            const res_actor =await Search_actor(name,1,20)
            setActor(res_actor.data);
            console.log(res_actor);
            
            
        };
        fetchMovies();
    }, [name]);

    // return (
    //     <div>huy 
    //         <p>huy</p>
    //         <p>abc</p>
    //     </div>
    // )
    return <MovieList movies={movies} actors={actor} search={true} />;
};

export default Search;
