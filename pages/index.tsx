import axios from 'axios';
import { useEffect, useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Link from 'next/link';

// Movie Interface
interface Movie {
  id: number;
  name: string;
  releaseDate: string;
  averageRating?: number;
}

const Shimmer = () => {
  return (
    <div className="bg-[#e0defd] p-4 rounded-md shadow-lg animate-pulse">
      <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
      <div className="flex justify-end">
        <div className="h-4 bg-gray-300 rounded w-10 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-10 ml-2 mb-2"></div>
      </div>
    </div>
  );
};

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await axios.get('/api/movies');
      setMovies(response.data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false); // Stop loading when data is fetched
    }
  };

  const filteredMovies = movies.filter(movie =>
    movie.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeleteMovie = async (id: number) => {
    if (confirm('Are you sure you want to delete this movie?')) {
      try {
        await axios.delete(`/api/movies/${id}`);
        setMovies((prevMovies) => prevMovies.filter((movie) => movie.id !== id));
        alert('Movie and its reviews deleted successfully.');
      } catch (error) {
        console.error('Error deleting movie:', error);
        alert('Failed to delete movie.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gray-200">
        <header className="container mx-auto p-4 flex justify-between items-center">
          <h1 className="text-xl text-black font-medium">MOVIECRITIC</h1>
          <div>
            <Link href={`/newmovie`}>
              <button className="bg-white text-[#6558f5] border-[#6558f5] px-4 py-2 rounded-md mr-2">
                Add new movie
              </button>
            </Link>

            <Link href={`/newreview`}>
              <button className="bg-[#6558f5] text-white px-4 py-2 rounded-md">
                Add new review
              </button>
            </Link>
          </div>
        </header>
      </div>

      {/* Main Section */}
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-medium text-black mb-8">
          The best movie reviews site!
        </h2>

        {/* Search Bar */}
        <div className="mb-8 flex">
          <input
            type="text"
            placeholder="Search for your favourite movie"
            className="border border-[#6558f5] text-black focus:border-[#6558f5] rounded-md px-4 py-2 w-1/2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Movie Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Show shimmer effect if data is still loading
            <>
              <Shimmer />
              <Shimmer />
              <Shimmer />
            </>
          ) : filteredMovies.length > 0 ? (
            // Show filtered movies once loaded
            filteredMovies.map((movie) => (
              <div
                key={movie.id}
                className="bg-[#e0defd] p-4 rounded-md shadow-lg"
              >
                <Link href={`/movie/${movie.id}`}>
                  <h3 className="text-xl text-black font-normal mb-2">
                    {movie.name}
                  </h3>
                  <p className="text-gray-600 mb-2">
                    Released: {new Date(movie.releaseDate).toLocaleDateString()}
                  </p>
                  <p className="text-gray-800 font-semibold">
                    Rating: {movie.averageRating ? movie.averageRating.toFixed(2) : 'No ratings yet'}/10
                  </p>
                  </Link>
                  <div className="text-right">
                    <div className="flex justify-end space-x-4">
                    <Link href={`/movie/${movie.id}/edit`}>
                      <button className="text-gray-600 hover:text-gray-800">
                        <i className="fas fa-edit"></i>
                      </button>
                      </Link>
                      <button className="text-gray-600 hover:text-gray-800" onClick={() => handleDeleteMovie(movie.id)}>
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
               
              </div>
            ))
          ) : (
            <p>No movies found</p>
          )}
        </div>
      </main>
    </div>
  );
}
