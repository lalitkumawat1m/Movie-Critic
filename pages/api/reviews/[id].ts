import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    // Fetch a specific review by ID
    const review = await prisma.review.findUnique({
      where: { id: Number(id) },
    });
    
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    res.status(200).json(review);
    
  } else if (req.method === 'PUT') {
    // Update a specific review
    const { reviewer, rating, comment } = req.body;

    try {
      const updatedReview = await prisma.review.update({
        where: { id: Number(id) },
        data: { reviewer, rating, comment },
      });
      res.status(200).json(updatedReview);
    } catch (error) {
      console.error('Error updating review:', error);
      res.status(500).json({ error: 'Error updating review' });
    }
    
  } else if (req.method === 'DELETE') {
    // Delete a specific review
    try {
      await prisma.review.delete({
        where: { id: Number(id) },
      });
      res.status(204).end(); // No content response
    } catch (error) {
      console.error('Error deleting review:', error);
      res.status(500).json({ error: 'Error deleting review' });
    }
    
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
