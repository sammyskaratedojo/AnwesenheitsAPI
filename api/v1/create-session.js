import { MongoClient } from 'mongodb';
import { DateTime } from "luxon";

const INIT_SESSION_MEMBERS = 5;
let client;

let db;
let zwDb;

export default async function handler(req, res)
{
    // Cookies \\
    res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
	
	if (req.method === "OPTIONS") {
		res.status(200).end();
		return;
	}

    
    if(req.method !== "POST")
    {
        res.status(405).end();
        return
    }
    
    if (!client)
    {
		const DB_URI = process.env.DB_URI
        client = new MongoClient(DB_URI);
        await client.connect();
        db = client.db('AnwesenheitDB');
        zwDb = client.db('AnwesenheitZwischenspeicher');
    }

    await createSession(req.body.className, req.body.sessionDate)
        
    res.status(201).end();
}


async function createSession(className, sessionDate)
{
	const zwSessions = zwDb.collection("sessions");

    const classId = await classIdFromName(className)
    const classes = db.collection("classes")

	const newSession = {
		class_name: classId,
		session_date: sessionDate,
		members: [],
		info: "",
        creator: "Web App",
	};

    const defaultMembers = (await classes.findOne({"_id": classId})).members
    newSession.members = defaultMembers

    await zwSessions.insertOne(newSession)
}


function isInList(id, list)
{

    for(let i of list)
    {
        if(i.toString() === id.toString()) return true
    }
    return false
}

async function classIdFromName(name)
{
    const classes = db.collection("classes")
    const classId = await classes.findOne({"name": name})
    return classId ? classId._id : "Klasse nicht gefunden"
}


// ganz viel redundanz bzgl checken dass die session nicht schon existiert, etc
