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


  const db = client.db('AnwesenheitDB');
  const profiles = db.collection('profiles');

  if (req.method === 'GET') {
    const allProfiles = await profiles.find({}).toArray();
    res.status(200).json(allProfiles);
  } else {
    res.status(405).end();
  }
}

