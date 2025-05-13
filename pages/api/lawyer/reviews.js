import { connectToDatabase, getLawyerReviews, addLawyerReview } from '@/helpers/db-utils';
import { getSession } from 'next-auth/client';

async function handler(req, res) {
  // Get user session to verify authentication
  const session = await getSession({ req });
  
  if (!session) {
    return res.status(401).json({ message: 'Not authenticated!' });
  }

  const client = await connectToDatabase();

  try {
    // GET request - fetch reviews for a lawyer
    if (req.method === 'GET') {
      const lawyerId = req.query.lawyerId;
      
      if (!lawyerId) {
        return res.status(400).json({ message: 'Lawyer ID is required' });
      }
      
      const reviews = await getLawyerReviews(client, lawyerId);
      return res.status(200).json({ reviews });
    }
    
    // POST request - add a new review
    if (req.method === 'POST') {
      const { lawyerId, rating, comment, caseId } = req.body;
      
      if (!lawyerId || !rating || rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Valid lawyer ID and rating (1-5) are required' });
      }
      
      const reviewData = {
        lawyerId,
        rating: parseInt(rating),
        comment: comment || '',
        caseId: caseId || null,
        userEmail: session.user.email,
      };
      
      const result = await addLawyerReview(client, reviewData);
      return res.status(201).json({ message: 'Review added successfully', result });
    }
    
    // Method not allowed
    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Error in lawyer reviews API:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  } finally {
    client.close();
  }
}

export default handler; 