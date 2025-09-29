import { MongoClient } from 'mongodb';

const uri = process.env.DB_URI;
// const authPW = process.env.AUTH_PW
let client;

export default async function handler(req, res) {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }

//   if (req.body.authPW !== authPW)
//   {
//     res.status(401).end()
//     return
//   }


  
  if (req.method === 'GET') {
    res.status(200).json(getClasses())
  } else {
    res.status(405).end();
  }
}


async function getClasses()
{
    const db = client.db('AnwesenheitDB');
    const classes = db.collection('classes');
    let allClasses = await classes.find({}).toArray()
    return allClasses
    let res = []
    allClasses.forEach(c => {
        res.push(c.name)
        console.log(c)
        console.log(c.name + " !")
    })

    return res

}
