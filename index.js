var express = require("express");
var MongoClient = require("mongodb").MongoClient;
var cors = require("cors");
const multer = require("multer");

var app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// MongoDB connection details
const CONNECTION_STRING = "mongodb+srv://Admin:Admin546950@cluster0.xbuch.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const DATABASENAME = "mongodbproject";
var database;

// Connect to MongoDB on startup
app.listen(5038, async () => {
    try {
        const client = await MongoClient.connect(CONNECTION_STRING, { useUnifiedTopology: true });
        database = client.db(DATABASENAME);
        console.log("MongoDB Connection Successful");
    } catch (error) {
        console.error("MongoDB Connection Failed", error);
    }
});

// 1. GET route to fetch all data
app.get("/getAll", async (req, res) => {
    try {
        const data = await database.collection("mongodbprojectcollection").find({}).toArray();
        res.status(200).json(data); // Send the data as JSON
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

// 2. POST route to add data
app.post("/add", async (req, res) => {
    const { id, description } = req.body; // Extract id and description from the request body
    if (!id || !description) {
        return res.status(400).json({ error: "id and description are required" });
    }

    try {
        // Insert the new document into the collection
        const result = await database.collection("mongodbprojectcollection").insertOne({
            id,
            description
        });

        // Respond with the inserted document
        res.status(201).json({ message: "Data added successfully", data: result.ops[0] });
    } catch (error) {
        console.error("Error adding data:", error);
        res.status(500).json({ error: "Failed to add data" });
    }
});

// 3. DELETE route to delete data by id
app.delete("/delete/:id", async (req, res) => {
    const { id } = req.params; // Get id from the URL parameter
    if (!id) {
        return res.status(400).json({ error: "id is required" });
    }

    try {
        // Delete the document with the specified id
        const result = await database.collection("mongodbprojectcollection").deleteOne({ id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Data not found with the specified id" });
        }

        res.status(200).json({ message: "Data deleted successfully" });
    } catch (error) {
        console.error("Error deleting data:", error);
        res.status(500).json({ error: "Failed to delete data" });
    }
});
