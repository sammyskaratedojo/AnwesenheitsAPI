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
	
	
	if (req.method !== 'POST') {
		res.status(405).end()
		return
	}
    
    
    if (!client) {
		const DB_URI = process.env.DB_URI
		client = new MongoClient(DB_URI);
		await client.connect();
        db = client.db('AnwesenheitDB');
        zwDb = client.db('AnwesenheitZwischenspeicher');
	}

    const { profileName } = req.body

    const zwProfiles = zwDb.collection("profiles")
    zwProfiles.insertOne({name: profileName, status: "ZW-Profil", firstdate: "--.--.----"})

	res.status(201).end();
}
