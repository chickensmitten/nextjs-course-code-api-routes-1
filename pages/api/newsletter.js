import { MongoClient } from "mongodb";


async function connectDatabase() {
  const client = await MongoClient.connect(process.env.MONGO_URL);
  return client;
}

async function insertDocument(client, document) {
  const db = client.db();
  await db.collection("emails").insertOne(document);
}

async function handler(req, res) {
  if (req.method === "POST") {
    const userEmail = req.body.email;
    // server side validation for security and integrity
    if (!userEmail || !userEmail.includes("@")) {
      res.status(422).json({message: "Invalid email address."});
      return;
    }

    let client;

    try {
      client = await connectDatabase();
    } catch (error) {
      res.status(500).json({message: "Failed to connect to the database"});
      return;
    }

    try {
      await insertDocument(client, { email: userEmail });
      client.close();
    } catch (error) {
      res.status(500).json({message: "Insert data failed"});
      return;      
    }

    res.status(201).json({message: "Signed up!"});
  }
}

export default handler;