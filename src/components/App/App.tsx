import { useState } from 'react'
import css from "./App.module.css";
import SearchBar from "../SearchBar/SearchBar.tsx";
import apiMovie from "../../services/movieService.ts";
import toast, {Toaster} from "react-hot-toast";
import type {Movie} from "../../types/movie.ts";
import MovieGrid from "../MovieGrid/MovieGrid.tsx"
import Loader from "../Loader/Loader.tsx";
import ErrorMessage from "../ErrorMessage/ErrorMessage.tsx";
import MovieModal from "../MovieModal/MovieModal.tsx";

export default function App() {
    const [search, setSearch] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState(false);
    const [isSelectedMovie, setIsSelectedMovie] = useState<Movie | null>(null);

    const openModal = (movie: Movie) => {
      setIsSelectedMovie(movie);
    }

    const fetchSearch = async (searchQuery: string) => {
        try {
            setIsLoading(true);
            setIsError(false);
            setSearch([]);
            const movies = await apiMovie(searchQuery);

            if (movies.length === 0 ) {
                toast.error("No movies found for your request.");
                return;
            }
            setSearch(movies);
        } catch {
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={css.app}>
            <Toaster position={"top-center"}/>
            <SearchBar onSubmit={fetchSearch}/>
            <MovieGrid onSelect={openModal} movies={search}/>
            {isLoading && <Loader/>}
            {isError && <ErrorMessage/>}
            {isSelectedMovie && <MovieModal movie={isSelectedMovie} onClose={()=>setIsSelectedMovie(null)}/>}
        </div>
    );
}
