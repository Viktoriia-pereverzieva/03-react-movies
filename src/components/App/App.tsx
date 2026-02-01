import css from './App.module.css'
import ErrorMessage from '../ErrorMessage/ErrorMessage'
import Loader from '../Loader/Loader'
import MovieGrid from '../MovieGrid/MovieGrid'
import MovieModal from '../MovieModal/MovieModal'
import SearchBar from '../SearchBar/SearchBar'
import { Toaster, toast }from 'react-hot-toast';
import type { Movie } from '../../types/movie';
import axios from 'axios';
import { useState } from 'react';


interface MovieHttpResponse {
  results: Movie[];
}
export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);


  const handleSearch = async (query: string) => {
    setMovies([]);
    setIsLoading(true);

    try {
      const response = await axios.get<MovieHttpResponse>(
        `https://api.themoviedb.org/3/search/movie?query=${query}`,
        {
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
          },
        }
      );
      const resultData = response.data.results;
    
      if (resultData.length === 0) {
        toast(
          "No movies found for your request",
          {
            duration: 6000,
          }
        );
      } else {
        setMovies(resultData);
      }

    } catch {
      setIsError(true);
    }
    finally {
      setIsLoading(false);
    }
  };


  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearch} />
      <Toaster position="top-center" reverseOrder={false} />
  
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
  
      {!isLoading && !isError && movies.length > 0 && (
        <MovieGrid
          movies={movies}
          onSelect={(movie) => {
            setSelectedMovie(movie);
            setIsModalOpen(true);
          }}
        />
      )}
  
      {isModalOpen && selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedMovie(null);
          }}
        />
      )}
    </div>
  );
}  