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
import ReactPagination from "../ReactPaginate/Pagination.tsx";

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

    const handleSearch = async (newQuery: string) => {
        setQuery(newQuery);
        setCurrentPage(1);
    }

    return (
        <div className={css.app}>
            <Toaster position={"top-center"}/>
            <SearchBar onSubmit={handleSearch}/>
            {isSuccess && maxTotalPages > 1 && (
                <ReactPagination
                    pageCount={maxTotalPages}
                    forcePage={currentPage}
                    onPageChange={setCurrentPage}
                />
            )}
            {isLoading && <Loader/>}
            {isError && <ErrorMessage/>}
            {movies.length > 0 && (<MovieGrid onSelect={openModal} movies={movies}/>)}
            {isSelectedMovie && (<MovieModal movie={isSelectedMovie} onClose={()=>setIsSelectedMovie(null)}/>)}
        </div>
    );
}
