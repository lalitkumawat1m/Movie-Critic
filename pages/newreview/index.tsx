import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

interface Movie {
  id: number;
  name: string;
  releaseDate: string;
}

const AddReview = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<number | null>(null);
  const [reviewer, setReviewer] = useState("");
  const [rating, setRating] = useState<number | undefined>(undefined);
  const [comment, setComment] = useState("");
  const router = useRouter();

  // Fetch all movies when the component loads
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get("/api/movies");
        setMovies(response.data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedMovie) {
      alert("Please select a movie.");
      return;
    }

    try {
      // Send review data to the backend
      await axios.post("/api/reviews", {
        movieId: selectedMovie,
        reviewer,
        rating,
        comment,
      });

      // Reset form after submission
      setSelectedMovie(null);
      setReviewer("");
      setRating(undefined);
      setComment("");
      alert("Review added successfully!");
      router.push('/');
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white text-black shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <h2 className="text-xl font-bold mb-4">Add new review</h2>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="movie"
          >
            Select a movie
          </label>
          <select
            id="movie"
            value={selectedMovie ?? ""}
            onChange={(e) => setSelectedMovie(Number(e.target.value))}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="" disabled>
              Select a movie
            </option>
            {movies.map((movie) => (
              <option key={movie.id} value={movie.id}>
                {movie.name} (Released:{" "}
                {new Date(movie.releaseDate).toLocaleDateString()})
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="reviewer"
          >
            Your name
          </label>
          <input
            id="reviewer"
            type="text"
            value={reviewer}
            onChange={(e) => setReviewer(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Your name"
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="rating"
          >
            Rating out of 10
          </label>
          <input
            id="rating"
            type="number"
            min="0"
            max="10"
            value={rating ?? ""}
            onChange={(e) => setRating(Number(e.target.value))}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="0"
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="comment"
          >
            Review comments
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Review comments"
            rows={4}
            required
          />
        </div>

        <div className="text-right">
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#6558f5] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Add review
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddReview;
