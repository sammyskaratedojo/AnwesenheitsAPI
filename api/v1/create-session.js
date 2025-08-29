import { MongoClient } from 'mongodb';

const uri = process.env.DB_URI;
let client;
let db;

export default async function handler(req, res) {
    if (!client) {
        client = new MongoClient(uri);
        await client.connect();
    }

    if (req.body.authPW !== authPW)
    {
        res.status(401).end()
        return
    }

    db = client.db('AnwesenheitDB');

    if (req.method === 'POST') {
        createSession(req.body.className, req.body.sessionDate, req.body.members)
        res.status(200).end();
    } else {
        res.status(405).end();
    }
}


function createSession(className, sessionDate, members)
{
    const newSessions = db.collection("newSessions")
    const newSession = {
        class_name: className,
        session_date: sessionDate, // as string
        members: members // as List[ {id, status} ]
    }
    newSessions.insertOne(newSession)
}
