require("dotenv").config();

const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri)

app.set("view engine", "ejs");
app.use(express.static("static"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connect
async function connectDB() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
  }
}

connectDB();

// --------------------
// Functie: Haal alle posts op
// --------------------
async function getPosts() {
  const database = client.db("bloktech");
  const collection = database.collection("posts");

  const posts = await collection.find({}).toArray();
  return posts;
}

// --------------------
// Functie: Voeg nieuwe post toe
// --------------------
async function insertPost(post) {
  const database = client.db("bloktech");
  const collection = database.collection("posts");

  await collection.insertOne({
    title: post.title,
    description: post.description,
    createdAt: new Date(),
  });
}

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/profile/:username", (req, res) => {
  res.send(`Profielpagina van ${req.params.username}`);
});

app.get("/detail", async (req, res) => {
  const posts = await getPosts();
  res.render("detail", { data: posts });
});

app.post("/detail", async (req, res) => {
  await insertPost({
    title: req.body.title,
    description: req.body.description,
  });
  res.redirect("/detail");
});

app.use((req, res) => {
  res.status(404).send("404 Not Found");
});

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});