import { MongoClient } from 'mongodb';

const uri = process.env.DB_URI;
// const authPW = process.env.AUTH_PW
let client;

export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }
    
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Only POST allowed!" });
    }

    if (!client) {
        client = new MongoClient(uri);
        await client.connect();
    }

    //   if (req.body.authPW !== authPW)
    //   {
    //     res.status(401).end()
    //     return
    //   }

    const { date, className } = req.body;


    const db = client.db('AnwesenheitDB');
    const sessions = db.collection('sessions');

    const session = await sessions.find({"session_date": date, "class_name": className}).toArray()

    if(session.length != 0)
    {
        res.status(400).json({error: "Die Sitzung existiert bereits"})
        return;
    }
    else
    {
        res.status(200).json("ok")
    }
}
