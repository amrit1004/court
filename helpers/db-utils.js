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
