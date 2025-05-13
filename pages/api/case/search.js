import { connectToDatabase, searchCases } from '@/helpers/db-utils';
import { getSession } from 'next-auth/client';

async function handler(req, res) {
  // Get user session to verify authentication
  const session = await getSession({ req });
  
  if (!session) {
    return res.status(401).json({ message: 'Not authenticated!' });
  }

  const client = await connectToDatabase();

  try {
    // Only allow GET requests
    if (req.method !== 'GET') {
      return res.status(405).json({ message: 'Method not allowed' });
    }
    
    // Get query parameters for search
    const query = req.query.q || '';
    const filters = {
      email: session.user.email, // Only show user's own cases
      status: req.query.status,
      caseType: req.query.caseType,
      startDate: req.query.startDate,
      endDate: req.query.endDate
    };
    
    // Perform search
    const cases = await searchCases(client, query, filters);
    
    return res.status(200).json({ 
      cases,
      count: cases.length,
      filters: {
        query,
        ...filters
      }
    });
  } catch (error) {
    console.error('Error in case search API:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  } finally {
    client.close();
  }
}

export default handler; 