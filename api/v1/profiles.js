import { MongoClient } from 'mongodb';

const DB_URI = process.env.DB_URI;
let client;

export default async function handler(req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") return res.sendStatus(200);


	if (req.method !== 'GET') {
		res.status(405).end()
		return
	}
	
	if (!client) {
		client = new MongoClient(DB_URI);
		await client.connect();
	}

	const db = client.db('AnwesenheitDB');
	const profiles = db.collection('profiles');

	const allProfiles = await profiles.find({}).toArray()
	res.status(200).json(allProfiles)
}
