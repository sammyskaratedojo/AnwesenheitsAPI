import { MongoClient } from 'mongodb';

let client;

let db;
let zwDb;

export default async function handler(req, res) {

    res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
	
	if (req.method === "OPTIONS") {
		res.status(200).end();
		return;
	}
    
    if (req.method !== 'GET') {
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

    

    const { sessionClass, sessionDate } = req.query;
	
    const sessionClassId = await classIdFromName(sessionClass)
    
    const session = await getSession(sessionClassId, sessionDate);
    
    if(!session)
    {
        return res.status(404).json({ error: "Session not found" });
    }
    
    res.json(session).status(200)
}


async function getSession(classId, sessionDate) {
    const zwSessions = zwDb.collection("sessions");
    const classes = db.collection("classes")

    const session = await zwSessions.findOne({
        class_name: classId,
        session_date: sessionDate
    })
    session.classWeekday = (await classes.findOne({_id: classId})).weekday
    
    return await convertIdsToNames(session);
}


async function convertIdsToNames(session) {

    if(!session) return null;
    for (let member of session.members) {
        member.name = await profileNameFromId(member.id);
    }
    return session;
}

async function profileNameFromId(id) {
    const profiles = db.collection("profiles");
    const zwProfiles = zwDb.collection("profiles");
    const profile = await profiles.findOne({ _id: id }) || await zwProfiles.findOne({ _id: id });
    return profile ? profile.name : "Profil nicht gefunden";
}

async function classIdFromName(name)
{
    const classes = db.collection("classes")
    const classId = await classes.findOne({"name": name})
    return classId ? classId._id : "Klasse nicht gefunden"
}
