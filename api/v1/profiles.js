import { MongoClient } from 'mongodb';

let client;
let db;
let zwDb;

export default async function handler(req, res) {
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
		db = client.db('AnwesenheitDB');
		zwDb = client.db("AnwesenheitZwischenspeicher")
	}

	const profiles = db.collection('profiles');
	const zwProfiles = zwDb.collection("profiles")

	const allProfiles = await profiles.find({}).toArray()
	const allZwProfiles = await zwProfiles.find({}).toArray()
	res.status(200).json(allProfiles.concat(allZwProfiles))
}
