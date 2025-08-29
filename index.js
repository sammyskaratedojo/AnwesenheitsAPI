import { MongoClient } from 'mongodb';

const uri = process.env.DB_URI; // z.B. aus Vercel Environment Variables
const authPW = process.env.AUTH_PW
let client;

export default async function handler(req, res) {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }

  if (req.body.authPW !== authPW)
  {
    res.status(401).end()
    return
  }

  
  if (req.method === 'GET') {
    res.status(200).end()
  } else {
    res.status(405).end();
  }
}
