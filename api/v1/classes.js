import { MongoClient } from 'mongodb';

// const DB_URI = process.env.DB_URI; 

let client;

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
	
	//
	
	
	if (!client) {
		const DB_URI = process.env.DB_URI
		client = new MongoClient(DB_URI);
		await client.connect();
	}


	const db = client.db('AnwesenheitDB');
	const classes = db.collection('classes');

	if (req.method !== 'GET') return res.status(405).end()


	const allClasses = await classes.find({}).toArray()
	let result = []
	allClasses.forEach(c => {
		result.push(c.name)
	})

	res.status(200).json(result)
}
