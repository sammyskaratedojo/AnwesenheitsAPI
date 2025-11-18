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

    //   \\
    
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
	const sessions = db.collection("sessions");
	const zwSessions = zwDb.collection("sessions");

    const classId = await classIdFromName(className) 

	const newSession = {
		class_name: classId,
		session_date: sessionDate,
		members: [],
		info: "",
        creator: "Web App",
	};

	let allSessions = await sessions.find({ class_name: classId }).toArray();
    
    for(let i of await zwSessions.find({ class_name: classId }).toArray())
    {
        allSessions.push(i);
    }

	const latestSessions = allSessions
        .filter(s => s.session_date) // falls es leere Einträge gibt
        .sort((a, b) => 
            DateTime.fromFormat(b.session_date, "dd.MM.yyyy").toMillis() 
            - DateTime.fromFormat(a.session_date, "dd.MM.yyyy").toMillis()
        )
        .slice(0, INIT_SESSION_MEMBERS);


    let activeMemberIds = []
    for(let session of latestSessions)
    {
        for(let member of session.members)
        {
            if(member.status === "Unbekannt") continue;
            if (isInList(member.id, activeMemberIds)) continue;
            
            activeMemberIds.push(member.id);
        }
    }


    newSession.members = activeMemberIds.map(id => ({ id: id, status: "Unbekannt" }));
    const mainTrainerId = (await db.collection("classes").findOne({ _id: classId })).main_trainer;
    
    for(let member of newSession.members)
    {
        if(member.id.toString() !== mainTrainerId.toString()) continue
        
        member.status = "Trainer"
    }

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
