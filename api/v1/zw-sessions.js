import { MongoClient } from 'mongodb';

const DB_URI = process.env.DB_URI;
let client;

let zwDb;

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
        client = new MongoClient(DB_URI);
        await client.connect();
        zwDb = client.db('AnwesenheitZwischenspeicher');
    }

    const sessions = zwDb.collection('sessions');
    const allSessions = sessions.find({}).toArray()

    const result = []
    
    allSessions.forEach(s => {
		result.push({date: s.session_date, class: s.class_name})
	})

	res.status(200).json(result)
}


