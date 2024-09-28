import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { movieId, reviewer, rating, comment } = req.body;
    const newReview = await prisma.review.create({
      data: { movieId, reviewer, rating, comment },
    });

    // Recalculate average rating for the movie
    // const reviews = await prisma.review.findMany({ where: { movieId } });
    // const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    // temp fix for the average rating
    const avgRating= 6;

    await prisma.movie.update({
      where: { id: movieId },
      data: { averageRating: avgRating },
    });

    res.status(201).json(newReview);
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
