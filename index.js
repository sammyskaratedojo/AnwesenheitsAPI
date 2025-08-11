import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI; // z.B. aus Vercel Environment Variables
let client;

export default async function handler(req, res) {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }

  const db = client.db('AnwesenheitDB');
  const collection = db.collection('profiles');

  if (req.method === 'GET') {
    const data = await collection.find({}).toArray();
    res.status(200).json(data);
  } else {
    res.status(405).end();
  }
}
