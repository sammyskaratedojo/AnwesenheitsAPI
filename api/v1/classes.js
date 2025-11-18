import { MongoClient } from 'mongodb';


let client;

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
	
	if (!client) {
		const DB_URI = process.env.DB_URI
		client = new MongoClient(DB_URI);
		await client.connect();
		db = client.db('AnwesenheitDB');
	}


	if (req.method !== 'GET') return res.status(405).end()


	
	const classes = db.collection('classes');

	const allClasses = await classes.find({}).toArray()
	let result = []
	allClasses.forEach(c => {
		result.push({name: c.name, weekday: c.weekday})
	})

	res.status(200).json(result)
}
