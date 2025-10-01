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

    const { date, className } = req.body;

    const db = client.db('AnwesenheitDB');
    const sessions = db.collection('sessions');
    const profiles = db.collection('profiles');

    const zwDb = client.db("AnwesenheitZwischenspeicher")
    const zwSessions = zwDb.collection("sessions")
    const zwProfiles = zwDb.collection("profiles")


    const mainSession = await sessions.find({"session_date": date, "class_name": className}).toArray()
    if(mainSession.length != 0)
    {
        res.status(400).json({errorCode: 1, error: "Die Sitzung existiert bereits in der Datenbank und kann nicht geändert werden."})
        return;
    }
    
    const zwSession = await zwSessions.find({"session_date": date, "class_name": className}).toArray()
    if(zwSession.length != 0)
    {
        res.status(400).json({errorCode: 2, error: "Die Sitzung wurde bereits erstellt, kann aber noch bearbeitet werden. Diese Sitzung bearbeiten?"})
        return;
    }


    res.status(200).json({errorCode: 0})
}
