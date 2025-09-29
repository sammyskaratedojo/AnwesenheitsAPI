import { MongoClient } from 'mongodb';

const uri = process.env.DB_URI; // z.B. aus Vercel Environment Variables
let client;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
  
  // if (req.body.authPW !== authPW)
  // {
  //   res.status(401).json({test: req.body.authPW})
  //   return
  // }


  const db = client.db('AnwesenheitDB');
  const profiles = db.collection('profiles');

  if (req.method === 'GET') {
    const allProfiles = await profiles.find({}).toArray()
    res.status(200).json(allProfiles)
  } else {
    res.status(405).end()
  }
}
