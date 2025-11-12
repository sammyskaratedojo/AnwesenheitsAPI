import { MongoClient } from 'mongodb';

// const DB_URI = process.env.DB_URI
let client;

let zwDb;
let db

let allProfiles = [];
let allZwProfiles = []

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

	
    
    const profiles = db.collection("profiles");
    const zwProfiles = zwDb.collection("profiles")
    allProfiles = await profiles.find({}).toArray();
    allZwProfiles = await zwProfiles.find({}).toArray()
    
    const { sessionClass, sessionDate, sessionInfo, members, creator } = req.body;
    const sessionId = await classIdFromName(sessionClass)

    const newMembers = [
        // { id, status }
    ]

    for(let member of members)
    {
        console.log("mem name '" + member.name + "'")
        newMembers.push({id: await nameToId(member.name), status: member.status})
    }
    console.log(newMembers)

    const zwSessions = zwDb.collection("sessions");
    zwSessions.updateOne(
        { class_name: sessionId,  session_date: sessionDate },
        { $set: { info: sessionInfo, members: newMembers, creator: creator } }
    );

	res.status(200).end();
}


function nameToId(name) {
    let profile = allProfiles.find(p => p.name === name);
    
    if(profile) return profile._id

    profile = allZwProfiles.find(p => p.name === name);

    if(profile) return profile._id

    throw new Error("Profilname " + name + " nicht gefunden.")
}

async function classIdFromName(name)
{
    const classes = db.collection("classes")
    const classId = await classes.findOne({"name": name})
    return classId ? classId._id : "Klasse nicht gefunden"
}
