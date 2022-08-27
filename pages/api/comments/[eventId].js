import { connectDatabase, insertDocument, getAllDocuments } from "../../../helpers/db-utils";

async function handler(req, res) {
  const eventId = req.query.eventId;

  let client;
  try {
    client = await connectDatabase();
  } catch (error) {
    res.status(500).json({message: "Failed to connect to the database"});
    return;
  }
  

  if (req.method === "POST") {
    // add server side validation

    const {email, name, text} = req.body;

    if (!email.includes("@") || !name || name.trim() === "" || !text || text.trim() === "" ) {
      res.status(422).json( {message: "Invalid Input"});
      client.close();  
      return;
    }

    console.log(email, name, text);
    const newComment = {
      email,
      name,
      text,
      eventId
    };

    let result;

    try {
      result = await insertDocument(client, "comments", newComment);
      newComment._id = result.insertedId;
      res.status(201).json({ message: "Added comment", comment: newComment})      
    } catch (error) {
      res.status(500).json({message: "Insert data failed"}); 
    }
  } 

  if  (req.method === "GET") {
    try {
      const documents = await getAllDocuments(client, "comments", {_id: -1}, { eventId: eventId });
      res.status(200).json({comments: documents});
    } catch (error) {
      res.status(500).json({message: "Failed to get comments"});
    }    
  }

  client.close();    
}

export default handler;