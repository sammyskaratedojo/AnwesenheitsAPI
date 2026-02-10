import { MongoClient } from 'mongodb';

let client;

let zwDb;
let db;

export default async function handler(req, res)
{
    // --- CORS ---
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
	
	if (req.method === "OPTIONS") {
		res.status(200).end();
		return;
	}
    
    
    if (req.method !== 'GET') {
        res.status(405).end()
        return
    }
    
    
    if (!client) {
		const DB_URI = process.env.DB_URI
        client = new MongoClient(DB_URI);
        await client.connect();
        zwDb = client.db('AnwesenheitZwischenspeicher');
        db = client.db('AnwesenheitDB');
    }

    const sessions = zwDb.collection('sessions');
    const allSessions = await sessions.find({}).toArray();

    const result = [];
    
    for (const s of allSessions) {
        result.push({
            date: s.session_date,
            class_name: await classNameFromID(s.class_name)
        })
    }

	res.status(200).json(result)
}


async function classNameFromID(id) {
  const classes = db.collection("classes")

  const doc = await classes.findOne({ _id: id })
  return doc?.name
}

