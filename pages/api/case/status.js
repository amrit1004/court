import { connectToDatabase, getCaseStatusUpdates, addCaseStatusUpdate } from '@/helpers/db-utils';
import { getSession } from 'next-auth/client';

async function handler(req, res) {
  // Get user session to verify authentication
  const session = await getSession({ req });
  
  if (!session) {
    return res.status(401).json({ message: 'Not authenticated!' });
  }

  const client = await connectToDatabase();

  try {
    // GET request - fetch status updates for a case
    if (req.method === 'GET') {
      const caseId = req.query.caseId;
      
      if (!caseId) {
        return res.status(400).json({ message: 'Case ID is required' });
      }
      
      const statusUpdates = await getCaseStatusUpdates(client, caseId);
      return res.status(200).json({ statusUpdates });
    }
    
    // POST request - add a new status update
    if (req.method === 'POST') {
      const { caseId, status, notes } = req.body;
      
      if (!caseId || !status) {
        return res.status(400).json({ message: 'Case ID and status are required' });
      }
      
      const statusData = {
        caseId,
        status,
        notes: notes || '',
        updatedBy: session.user.email,
      };
      
      const result = await addCaseStatusUpdate(client, statusData);
      return res.status(201).json({ message: 'Status updated successfully', result });
    }
    
    // Method not allowed
    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Error in case status API:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  } finally {
    client.close();
  }
}

export default handler; 