import { MongoClient } from 'mongodb';

const DB_URI = process.env.DB_URI
let client;

let zwDb;
let db;

export default async function handler(req, res) {

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS")
    {
        return res.status(200).end();
    }
    
    if (req.method !== 'GET') {
		res.status(405).end()
		return
	}


    if (!client) {
		client = new MongoClient(DB_URI);
		await client.connect();
        db = client.db('AnwesenheitDB');
        zwDb = client.db('AnwesenheitZwischenspeicher');
	}

    

    const { sessionClass, sessionDate } = req.query;
    console.log("incoming get-session Request:", sessionClass, sessionDate);
	
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

    const session = await zwSessions.findOne({
        class_name: classId,
        session_date: sessionDate
    })
    return await convertIdsToNames(session);
}


async function convertIdsToNames(session) {
    if(!session) return null;
    for (let member of session.members) {
        member.name = await profileNameFromId(member.id);
    }  
    return session; //!!!!!!!!!!!!!\\
}

async function profileNameFromId(id) {
    const profiles = db.collection("profiles");
    const zwProfiles = zwDb.collection("profiles");
    const profile = await profiles.findOne({ _id: id }) || await zwProfiles.findOne({ id: id });
    return profile ? profile.name : "Profil nicht gefunden";
}

async function classIdFromName(name)
{
    const classes = db.collection("classes")
    const classId = await classes.findOne({"name": name})
    return classId ? classId._id : "Klasse nicht gefunden"
}
