// pages/movie/[id]/review/[reviewId]/edit.tsx

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';

const EditReview = () => {
  const router = useRouter();
  const { id, reviewId } = router.query; // Get movie ID and review ID from URL
  const [review, setReview] = useState({ reviewer: '', rating: 0, comment: '' });

  useEffect(() => {
    if (id && reviewId) {
      fetchReview();
    }
  }, [id, reviewId]);

  const fetchReview = async () => {
    try {
      const response = await axios.get(`/api/reviews/${reviewId}`);
      setReview(response.data);
    } catch (error) {
      console.error('Error fetching review:', error);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`/api/reviews/${reviewId}`, review); // Update the review
      alert('Review updated successfully!');
      router.push(`/movie/${id}`); // Redirect back to the movie details page
    } catch (error) {
      console.error('Error updating review:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <form onSubmit={handleUpdate} className='bg-white text-black shadow-md rounded px-8 pt-6 pb-8 mb-4'>
      <h2 className="text-xl font-bold mb-4">Edit Review</h2>
        <div>
          <label htmlFor="reviewer">Reviewer</label>
          <input
            type="text"
            id="reviewer"
            value={review.reviewer}
            onChange={(e) => setReview({ ...review, reviewer: e.target.value })}
            className="border rounded-md p-2 w-full"
          />
        </div>
        <div>
          <label htmlFor="rating">Rating</label>
          <input
            type="number"
            id="rating"
            value={review.rating}
            onChange={(e) => setReview({ ...review, rating: Number(e.target.value) })}
            className="border rounded-md p-2 w-full"
            min={0}
            max={10}
          />
        </div>
        <div>
          <label htmlFor="comment">Comment</label>
          <textarea
            id="comment"
            value={review.comment}
            onChange={(e) => setReview({ ...review, comment: e.target.value })}
            className="border rounded-md p-2 w-full"
          />
        </div>
        <div className="text-right">
        <div className="flex justify-end">
        <button type="submit" className="bg-[#6558f5] text-white px-4 py-2 rounded-md mt-4">
          Update Review
        </button>
        </div>
        </div>
      </form>
    </div>
  );
};

export default EditReview;
