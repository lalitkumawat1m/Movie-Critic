import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    const movie = await prisma.movie.findUnique({
      where: { id: Number(id) },
      include: { reviews: true },
    });
    res.status(200).json(movie);
  } else if (req.method === 'PUT') {
    const { name, releaseDate } = req.body;
    const updatedMovie = await prisma.movie.update({
      where: { id: Number(id) },
      data: { name, releaseDate: new Date(releaseDate) },
    });
    res.status(200).json(updatedMovie);
  } else if (req.method === 'DELETE') {
    await prisma.review.deleteMany({ where: { movieId: Number(id) } }); // Delete associated reviews
    await prisma.movie.delete({ where: { id: Number(id) } });
    res.status(204).end();
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
