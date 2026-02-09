import { MongoClient } from 'mongodb';

const DB_URI = process.env.DB_URI;
let client;

let zwDb;

export default async function handler(req, res) {
    
    if (req.method !== 'GET') {
        res.status(405).end()
        return
    }
    
    
    if (!client) {
        client = new MongoClient(DB_URI);
        await client.connect();
        zwDb = client.db('AnwesenheitZwischenspeicher');
    }

    const sessions = db.collection('sessions');
    const allSessions = sessions.find({}).toArray()

    result = []
    
    allSessions.forEach(s => {
		result.push({date: s.session_date, class: s.class_name})
	})

	res.status(200).json(result)
}
