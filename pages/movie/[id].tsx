import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import '@fortawesome/fontawesome-free/css/all.min.css';

interface Review {
  id: number;
  reviewer?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface Movie {
  id: number;
  name: string;
  releaseDate: string;
  averageRating?: number;
  reviews: Review[];
}

export default function MovieDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [movie, setMovie] = useState<Movie | null>(null);

  useEffect(() => {
    if (id) {
      fetchMovie();
    }
  }, [id]);

  const fetchMovie = async () => {
    try {
      const response = await axios.get(`/api/movies/${id}`);
      setMovie(response.data);
    } catch (error) {
      console.error('Error fetching movie:', error);
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (confirm("Are you sure you want to delete this review?")) {
      try {
        await axios.delete(`/api/reviews/${reviewId}`); // Call your delete API
        alert('Review deleted successfully!');
        fetchMovie(); // Refresh the movie data to update the reviews list
      } catch (error) {
        console.error('Error deleting review:', error);
      }
    }
  };
  

  if (!movie) return <div>Loading...</div>;

  return (

    <div className="min-h-screen bg-gray-100 text-black">
    {/* Header */}
    <div className="bg-gray-200">
    <header className="container mx-auto p-4 flex justify-between items-center">
      <h1 className="text-xl text-black font-medium">MOVIECRITIC</h1>
      <div>
      <Link href={`/newmovie`}>
        <button className="bg-white text-[#6558f5] border-[#6558f5]  px-4 py-2 rounded-md mr-2">
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

    <div className="container mx-auto p-4">
      {/* Movie Title and Rating */}
      <div className="flex justify-between items-center border-b-2 pb-4 mb-4">
        <h1 className="text-3xl font-medium">{movie.name}</h1>
        <p className="text-3xl font-medium text-[#6558f5]">
          {movie.averageRating ? movie.averageRating.toFixed(2) : 'N/A'}/10
        </p>
      </div>

      {/* Reviews Section */}
      <h2 className="text-xl font-semibold mb-4">Reviews</h2>
      {movie.reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        <div className="space-y-4">
          {movie.reviews.map((review) => (
            <div key={review.id} className="border p-4 bg-gray-50 shadow-md flex justify-between items-start border-gray-600">
              <div className='flex-col justify-between' >
                <p>{review.comment ? review.comment: 'N/A'}</p>
                <p className="text-sm text-gray-500 mt-2">By {review.reviewer || 'Anonymous'}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-[#6558f5]">{review.rating}/10</p>
                <div className="flex justify-end mt-2 space-x-4">
                <Link href={`/movie/${movie.id}/review/${review.id}/edit`}>
                  <button className="text-gray-600 hover:text-gray-800">
                    <i className="fas fa-edit"></i>
                  </button>
                  </Link>
                  <button className="text-gray-600 hover:text-gray-800" onClick={() => handleDeleteReview(review.id)}>
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
}
