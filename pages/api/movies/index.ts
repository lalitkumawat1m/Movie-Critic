import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const movies = await prisma.movie.findMany({
      include: { reviews: true },
    });
    res.status(200).json(movies);
  } else if (req.method === 'POST') {
    const { name, releaseDate } = req.body;
    const newMovie = await prisma.movie.create({
      data: { name, releaseDate: new Date(releaseDate) },
    });
    res.status(201).json(newMovie);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
