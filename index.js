
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const admin = require("firebase-admin");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


const serviceAccount = require("./firebase-service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rxq0qzb.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });


function verifyFirebaseToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send({ error: "Unauthorized: No token provided" });
  }

  const idToken = authHeader.split(" ")[1];

  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      req.user = decodedToken;
      next();
    })
    .catch((error) => {
      console.error("JWT Verification Error:", error);
      res.status(403).send({ error: "Forbidden: Invalid token" });
    });
}

async function run() {
  try {
    // await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("libraryDB");
    const booksCollection = db.collection("books");
    const borrowCollection = db.collection("borrowedBooks");

    
// book post
    app.post("/books", async (req, res) => {
      const result = await booksCollection.insertOne(req.body);
      res.send(result);
    });
//get books
    app.get("/books", async (req, res) => {
      const books = await booksCollection.find().sort({ _id: -1 }).toArray();
      res.send(books);
    });

    app.get("/books/:id",  async (req, res) => {
      const book = await booksCollection.findOne({ _id: new ObjectId(req.params.id) });
      res.send(book);
    });

    app.put("/books/:id",  async (req, res) => {
      const id = req.params.id;
      const updated = req.body;
      delete updated._id;
      const result = await booksCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updated }
      );
      res.send(result);
    });

    app.delete("/books/:id", async (req, res) => {
      const result = await booksCollection.deleteOne({ _id: new ObjectId(req.params.id) });
      res.send(result);
    });

    

    app.post("/borrow", verifyFirebaseToken, async (req, res) => {
      const borrowData = {
        ...req.body,
        email: req.user.email, 
        borrowDate: new Date(),
      };

      
      const alreadyBorrowed = await borrowCollection.findOne({
        email: borrowData.email,
        bookId: borrowData.bookId,
      });

      if (alreadyBorrowed) {
        return res.status(400).send({ error: "You already borrowed this book. Return it first." });
      }

     
      const book = await booksCollection.findOne({ _id: new ObjectId(borrowData.bookId) });
      if (!book || book.quantity <= 0) {
        return res.status(400).send({ error: "Book is out of stock." });
      }

     
      await booksCollection.updateOne(
        { _id: new ObjectId(borrowData.bookId) },
        { $inc: { quantity: -1 } }
      );

      const result = await borrowCollection.insertOne(borrowData);
      res.send(result);
    });

    app.get("/borrow/:email", verifyFirebaseToken, async (req, res) => {
     
      if (req.user.email !== req.params.email) {
        return res.status(403).send({ error: "Access denied." });
      }

      const result = await borrowCollection
        .find({ email: req.params.email })
        .sort({ borrowDate: -1 })
        .toArray();
      res.send(result);
    });

    app.delete("/borrow/:id", verifyFirebaseToken, async (req, res) => {
      const id = req.params.id;
      const borrowedBook = await borrowCollection.findOne({ _id: new ObjectId(id) });

      if (!borrowedBook) {
        return res.status(404).send({ error: "Borrowed book not found" });
      }

      
      if (borrowedBook.email !== req.user.email) {
        return res.status(403).send({ error: "You can't return a book you didn't borrow." });
      }

     
      await booksCollection.updateOne(
        { _id: new ObjectId(borrowedBook.bookId) },
        { $inc: { quantity: 1 } }
      );

      const result = await borrowCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });

  } catch (error) {
    console.error(error);
  }
  
}

run().catch(console.error);

app.get("/", (req, res) => {
  res.send("Shakil's Library Management System Server is Running now...");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
