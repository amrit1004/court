import { MongoClient, ObjectID } from 'mongodb';
const MONGODB_URI = process.env.MONGODB_URI;

export async function connectToDatabase() {
  const client = await MongoClient.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  return client;
}

export async function getAllLawyerProfiles(client) {
  const db = client.db();

  const documents = await db.collection('lawyersList').find().toArray();
   console.log(documents);

  return documents;
}

export async function getLawyerProfile(client, id) {
  const db = client.db();

  const lawyerProfile = await db.collection('lawyersList').findOne({
    bar_council_id: id,
  });

  return lawyerProfile;
}

export async function getLawyerId(client, id) {
  const db = client.db();

  const lawyerProfile = await db.collection('lawyersList').findOne({
    bar_council_id: id,
  });

  return lawyerProfile;
}

// Get all reviews for a lawyer
export async function getLawyerReviews(client, lawyerId) {
  const db = client.db();
  
  const reviews = await db.collection('lawyerReviews')
    .find({ lawyerId: lawyerId })
    .sort({ createdAt: -1 })
    .toArray();
    
  return reviews;
}

// Add a review for a lawyer
export async function addLawyerReview(client, reviewData) {
  const db = client.db();
  
  const result = await db.collection('lawyerReviews').insertOne({
    ...reviewData,
    createdAt: new Date()
  });
  
  // Update lawyer's average rating
  await updateLawyerRating(client, reviewData.lawyerId);
  
  return result;
}

// Update lawyer's average rating
async function updateLawyerRating(client, lawyerId) {
  const db = client.db();
  
  // Calculate average rating
  const pipeline = [
    { $match: { lawyerId: lawyerId } },
    { $group: { _id: "$lawyerId", averageRating: { $avg: "$rating" }, count: { $sum: 1 } } }
  ];
  
  const ratingData = await db.collection('lawyerReviews').aggregate(pipeline).toArray();
  
  if (ratingData.length > 0) {
    // Update lawyer profile with new rating
    await db.collection('lawyersList').updateOne(
      { bar_council_id: lawyerId },
      { 
        $set: { 
          averageRating: Math.round(ratingData[0].averageRating * 10) / 10,
          reviewCount: ratingData[0].count
        } 
      }
    );
  }
}

// Get case status updates
export async function getCaseStatusUpdates(client, caseId) {
  const db = client.db();
  
  const statusUpdates = await db.collection('caseStatusUpdates')
    .find({ caseId: caseId })
    .sort({ updatedAt: -1 })
    .toArray();
    
  return statusUpdates;
}

// Add a case status update
export async function addCaseStatusUpdate(client, statusData) {
  const db = client.db();
  
  const result = await db.collection('caseStatusUpdates').insertOne({
    ...statusData,
    updatedAt: new Date()
  });
  
  // Update the case with the latest status
  await db.collection('cases').updateOne(
    { uid: statusData.caseId },
    { $set: { currentStatus: statusData.status } }
  );
  
  return result;
}

// Add document to a case
export async function addCaseDocument(client, documentData) {
  const db = client.db();
  
  const result = await db.collection('caseDocuments').insertOne({
    ...documentData,
    uploadedAt: new Date()
  });
  
  return result;
}

// Get documents for a case
export async function getCaseDocuments(client, caseId) {
  const db = client.db();
  
  const documents = await db.collection('caseDocuments')
    .find({ caseId: caseId })
    .sort({ uploadedAt: -1 })
    .toArray();
    
  return documents;
}

// Search cases with filters
export async function searchCases(client, query, filters) {
  const db = client.db();
  
  let searchQuery = {};
  
  // Text search if search term provided
  if (query && query.trim() !== '') {
    searchQuery = {
      $or: [
        { Case_Type: { $regex: query, $options: 'i' } },
        { Case_desciption: { $regex: query, $options: 'i' } },
        { Lawyer_Name: { $regex: query, $options: 'i' } },
        { Court_Type: { $regex: query, $options: 'i' } }
      ]
    };
  }
  
  // Add filters if provided
  if (filters) {
    if (filters.email) {
      searchQuery.email = filters.email;
    }
    if (filters.status) {
      searchQuery.currentStatus = filters.status;
    }
    if (filters.caseType) {
      searchQuery.Case_Type = filters.caseType;
    }
    if (filters.startDate && filters.endDate) {
      searchQuery.Hearing_Date = {
        $gte: filters.startDate,
        $lte: filters.endDate
      };
    } else if (filters.startDate) {
      searchQuery.Hearing_Date = { $gte: filters.startDate };
    } else if (filters.endDate) {
      searchQuery.Hearing_Date = { $lte: filters.endDate };
    }
  }
  
  const cases = await db.collection('cases')
    .find(searchQuery)
    .sort({ Hearing_Date: 1 })
    .toArray();
    
  return cases;
}
