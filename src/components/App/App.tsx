import {useEffect, useState} from 'react'
import css from "./App.module.css";
import SearchBar from "../SearchBar/SearchBar.tsx";
import apiMovie from "../../services/movieService.ts";
import toast, {Toaster} from "react-hot-toast";
import type {Movie} from "../../types/movie.ts";
import MovieGrid from "../MovieGrid/MovieGrid.tsx"
import Loader from "../Loader/Loader.tsx";
import ErrorMessage from "../ErrorMessage/ErrorMessage.tsx";
import MovieModal from "../MovieModal/MovieModal.tsx";
import {keepPreviousData, useQuery} from "@tanstack/react-query";
import Pagination from "../ReactPaginate/Pagination.tsx";

export default function App() {
    const [isSelectedMovie, setIsSelectedMovie] = useState<Movie | null>(null);

    const [query, setQuery] = useState("");

    const [currentPage, setCurrentPage] = useState(1);

    const {data, isLoading, isSuccess, isError } = useQuery({
        queryKey: ['movie', query, currentPage],
        queryFn: ()=> apiMovie(query, currentPage),
        enabled: query !== '',
        placeholderData: keepPreviousData,
    });

    const openModal = (movie: Movie) => {
      setIsSelectedMovie(movie);
    }

    useEffect(() => {
        if (isSuccess && data?.results.length === 0 ) {
            toast.error("No movies found for your request.");
            return;
        }
    }, [data, isSuccess]);

    const movies = data?.results ?? [];

    const totalPages = data?.total_pages ?? 0;
    const maxTotalPages = Math.min(totalPages, 10);

    const handlePageChange = async (newQuery: string) => {
        setQuery(newQuery);
        setCurrentPage(1);
    }

    return (
        <div className={css.app}>
            <Toaster position={"top-center"}/>
            <SearchBar onSubmit={handlePageChange}/>
            {isSuccess && totalPages > 1 && (
                <Pagination
                    page={currentPage}
                    totalPages={maxTotalPages}
                    setPage={setCurrentPage}
                />
            )}
            <MovieGrid onSelect={openModal} movies={movies}/>
            {isLoading && <Loader/>}
            {isError && <ErrorMessage/>}
            {isSelectedMovie && <MovieModal movie={isSelectedMovie} onClose={()=>setIsSelectedMovie(null)}/>}
        </div>
    );
}
