import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface Movie {
  id: number;
  name: string;
  releaseDate: string;
}

export default function EditMovie() {
  const router = useRouter();
  const { id } = router.query;
  const [movie, setMovie] = useState<Movie | null>(null);
  const [name, setName] = useState('');
  const [releaseDate, setReleaseDate] = useState('');

  useEffect(() => {
    if (id) {
      fetchMovie();
    }
  }, [id]);

  const fetchMovie = async () => {
    try {
      const response = await axios.get(`/api/movies/${id}`);
      setMovie(response.data);
      setName(response.data.name);
      setReleaseDate(new Date(response.data.releaseDate).toISOString().split('T')[0]); // Format date for input
    } catch (error) {
      console.error('Error fetching movie:', error);
    }
  };

  const handleUpdateMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`/api/movies/${id}`, {
        name,
        releaseDate,
      });
      alert('Movie updated successfully!');
      router.push('/'); // Redirect to the home page after update
    } catch (error) {
      console.error('Error updating movie:', error);
      alert('Failed to update movie.');
    }
  };

  if (!movie) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10">

      <form onSubmit={handleUpdateMovie} className='bg-white text-black shadow-md rounded px-8 pt-6 pb-8 mb-4'>
      <h2 className="text-xl font-bold mb-4">Edit Movie</h2>
        <div className="mb-4">
          <label className="block text-black font-bold mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded-md px-4 py-2 w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-black font-bold mb-2">Release Date</label>
          <input
            type="date"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
            className="border rounded-md px-4 py-2 w-full"
            required
          />
        </div>
        <div className="text-right">
        <div className="flex justify-end">
        <button
          type="submit"
          className="bg-[#6558f5] text-white px-4 py-2 rounded-md"
        >
          Update Movie
        </button>
        </div>
        </div>
      </form>
    </div>
  );
}
