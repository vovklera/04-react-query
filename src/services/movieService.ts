import axios from "axios";
import type { Movie } from "../types/movie";

export const BASE_URL = "https://api.themoviedb.org/3/search/movie";

interface MoviesHttpResponse{
    results: Movie[];
    total_pages: number;
}

export default async function apiMovie(query:string, page: number = 1): Promise<MoviesHttpResponse> {
    const response = await axios.get<MoviesHttpResponse>(`${BASE_URL}`, {
        params: {
            query,
            page,
            hitsPerPage: 10,
        },
        headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
        }
    })
    return response.data;
}