import { MongoClient } from 'mongodb';

const DB_URI = process.env.DB_URI
let client;

let db
let zwDb

export default async function handler(req, res)
{
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") return res.sendStatus(200);
    
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Only POST allowed!" });
    }

    if (!client) {
        client = new MongoClient(DB_URI);
        await client.connect();

        db = client.db('AnwesenheitDB');
        zwDb = client.db("AnwesenheitZwischenspeicher")
    }
    

    const { date, className } = req.body;
    const classId = await classIdFromName(className)

    
    const sessions = db.collection('sessions');
    const zwSessions = zwDb.collection("sessions")


    const mainSession = await sessions.find({"session_date": date, "class_name": classId}).toArray()
    if(mainSession.length != 0)
    {
        res.status(400).json({errorCode: 1})
        return;
    }
    
    const zwSession = await zwSessions.find({"session_date": date, "class_name": classId}).toArray()
    if(zwSession.length != 0)
    {
        res.status(400).json({errorCode: 2})
        return;
    }

    res.status(200).json({errorCode: 0}) // doesnt exist
}


async function classIdFromName(name)
{
    const classes = db.collection("classes")
    const classId = await classes.findOne({"name": name})
    return classId ? classId._id : "Klasse nicht gefunden"
}
