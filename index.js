import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI; // z.B. aus Vercel Environment Variables
let client;

export default async function handler(req, res) {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }

  const db = client.db('meinedb');
  const collection = db.collection('meinecollection');

  if (req.method === 'GET') {
    const daten = await collection.find({}).toArray();
    res.status(200).json(daten);
  } else {
    res.status(405).end();
  }
}
