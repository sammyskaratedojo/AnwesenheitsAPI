import { MongoClient } from 'mongodb';

const DB_URI = process.env.DB_URI;
let client;

let db;
let zwDb;

export default async function handler(req, res)
{
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") return res.sendStatus(200);


	if (!client) {
		client = new MongoClient(DB_URI);
		await client.connect();
        db = client.db("AnwesenheitDB");
        zwDb = client.db('AnwesenheitZwischenspeicher');
	}

	
	if (req.method !== 'GET') {
		res.status(405).end()
		return
	}

    const { name } = req.query

    const profiles = db.collection("profiles")
    const zwProfiles = zwDb.collection("profiles")
    const found = await profiles.find({name: name}).toArray() || await zwProfiles.find({name: name}).toArray()

    console.log(found)

    if(found.length != 1)
        res.status(404).end()

	res.status(200).end();
}

