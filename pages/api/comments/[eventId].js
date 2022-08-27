import { MongoClient } from "mongodb";

async function handler(req, res) {
  const eventId = req.query.eventId;
  
  const client = await MongoClient.connect(process.env.MONGO_URL)

  if (req.method === "POST") {
    // add server side validation

    const {email, name, text} = req.body;

    if (!email.includes("@") || !name || name.trim() === "" || !text || text.trim() === "" ) {
      res.status(422).json( {message: "Invalid Input"});
      return;
    }

    console.log(email, name, text);
    const newComment = {
      email,
      name,
      text,
      eventId
    };

    const db = client.db();
    const result = await db.collection("comments").insertOne(newComment);

    console.log(result);

    newComment.id = result.insertedId;
    
    res.status(201).json({ message: "Added comment", comment: newComment})

  } 

  if  (req.method === "GET") {
    const dummyList = [
      {id: "c1", name: "Max", text: "rando comment" },
      {id: "c2", name: "Minks", text: "rando comment 1" }
    ];

    res.status(200).json({comments: dummyList});
  }

  client.close();    
}

export default handler;