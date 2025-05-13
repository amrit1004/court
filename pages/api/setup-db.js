import { connectToDatabase } from '@/helpers/db-utils';

// This is a one-time setup script that you can run to initialize
// sample data for the new features

export default async function handler(req, res) {
  // Only allow this to run in development mode
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({ message: 'This endpoint is only available in development mode' });
  }

  const client = await connectToDatabase();
  const db = client.db();

  try {
    // 1. Create fees collection with sample data
    const lawyerNames = await db.collection('lawyersList').find({}).project({ name: 1 }).toArray();
    
    // Delete existing fees to avoid duplicates
    await db.collection('fees').deleteMany({});
    
    // Create fees for each lawyer
    for (const lawyer of lawyerNames) {
      await db.collection('fees').insertOne({
        LawyerName: lawyer.name,
        fees: Math.floor(Math.random() * 10000) + 5000, // Random fee between 5000-15000
        consultationFee: Math.floor(Math.random() * 2000) + 1000,
        hearingFee: Math.floor(Math.random() * 3000) + 2000,
      });
    }

    // 2. Create indexes for better performance
    await db.collection('cases').createIndex({ Hearing_Date: 1 });
    await db.collection('cases').createIndex({ email: 1 });
    await db.collection('cases').createIndex({ Lawyer_Name: 1 });
    
    // Create text index for search
    await db.collection('cases').createIndex({ 
      Case_Type: "text",
      Case_desciption: "text",
      Lawyer_Name: "text"
    });

    // 3. Add default status to existing cases
    await db.collection('cases').updateMany(
      { currentStatus: { $exists: false } },
      { $set: { currentStatus: 'Filed' } }
    );

    res.status(200).json({ 
      message: 'Database setup complete',
      collections: {
        fees: await db.collection('fees').countDocuments(),
        cases: await db.collection('cases').countDocuments(),
        lawyersList: await db.collection('lawyersList').countDocuments(),
      }
    });
  } catch (error) {
    console.error('Error setting up database:', error);
    res.status(500).json({ message: 'Error setting up database', error: error.message });
  } finally {
    client.close();
  }
} 