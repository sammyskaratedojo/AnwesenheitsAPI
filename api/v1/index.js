import { MongoClient } from 'mongodb';

const DB_URI = process.env.DB_URI;
let client;

let db;
let zwDb;

export default async function handler(req, res) {
	
	if (req.method !== 'GET') {
		res.status(405).end()
		return
	}
    
    
    if (!client) {
		client = new MongoClient(DB_URI);
		await client.connect();
        db = client.db('AnwesenheitDB');
        zwDb = client.db('AnwesenheitZwischenspeicher');
	}

	
	res.status(200).end();
}
