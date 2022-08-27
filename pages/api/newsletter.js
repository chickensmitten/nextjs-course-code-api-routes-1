import { MongoClient } from "mongodb";

async function handler(req, res) {
  if (req.method === "POST") {
    const userEmail = req.body.email;
    // server side validation for security and integrity
    if (!userEmail || !userEmail.includes("@")) {
      res.status(422).json({message: "Invalid email address."});
      return;
    }

    const client = await MongoClient.connect(process.env.MONGO_URL)
    const db = client.db();
    await db.collection("emails").insertOne({email: userEmail});
    client.close();

    res.status(201).json({message: "Signed up!"});
  }
}

export default handler;