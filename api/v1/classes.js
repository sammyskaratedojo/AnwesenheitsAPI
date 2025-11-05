import { MongoClient } from 'mongodb';

const DB_URI = process.env.DB_URI;
let client;

export default async function handler(req, res)
{
	res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS")
    {
        return res.status(200).end();
    }
	
	
	if (!client) {
		client = new MongoClient(DB_URI);
		await client.connect();
	}


	const db = client.db('AnwesenheitDB');
	const classes = db.collection('classes');

	if (req.method === 'GET') {
		const allClasses = await classes.find({}).toArray()
		let result = []
		allClasses.forEach(c => {
			result.push(c.name)
		})

		res.status(200).json(result)
	} else {
		res.status(405).end()
	}
}
