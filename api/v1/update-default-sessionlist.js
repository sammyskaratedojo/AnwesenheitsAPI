import { MongoClient } from 'mongodb';

const DB_URI = process.env.DB_URI;
let client;

let db;
let zwDb;

export default async function handler(req, res) {
    
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

    const classes = db.collection("classes");

    const { className, profileName } = req.body

    const profileID = await profileIDFromName(profileName)

    await collection.updateOne(
    { name: className },
    { $push: { members: {id: profileID, status: "Unbekannt"} } }
    );


    res.status(200).end();
}

async function profileIDFromName(name) {
    const profiles = db.collection("profiles");
    const zwProfiles = zwDb.collection("profiles");
    const profile = await profiles.findOne({ name: name }) || await zwProfiles.findOne({ name: name });
    return profile ? profile._id : "Profil nicht gefunden";
}