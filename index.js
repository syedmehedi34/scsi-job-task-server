const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(express.json());

// ✅ Explicitly allow only your frontend
// CORS Configuration
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Local dev URL
      "https://my-todo-task-management.netlify.app", // Production URL
    ],
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Handle Preflight Requests
app.options("*", cors());

// ✅ Ensure CORS headers in every response
app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    "http://localhost:5173",
    "https://my-todo-task-management.netlify.app"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// ✅ MongoDB Connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0uhyg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();
    // console.log("✅ Connected to MongoDB");

    const taskCollection = client.db("TaskManagement").collection("tasks");

    // 🔹 GET Tasks by Email
    app.get("/tasks", async (req, res) => {
      const { email } = req.query;
      // console.log(email);
      if (!email) return res.status(400).json({ error: "Email is required" });

      const result = await taskCollection.find({ user: email }).toArray();
      // console.log(result);
      res.status(200).json(result);
    });

    // 🔹 PATCH: Update Task Category (Drag & Drop)
    app.patch("/drag_tasks", async (req, res) => {
      const { taskId, newCategory } = req.body;
      // console.log(taskId, newCategory);

      const task = await taskCollection.findOneAndUpdate(
        { id: taskId },
        { $set: { category: newCategory } },
        { returnDocument: "after" }
      );

      if (!task) return res.status(404).json({ error: "Task not found" });

      return res.status(200).json(task);
    });

    // 🔹 PATCH: Update or Insert Task
    app.patch("/tasks", async (req, res) => {
      const { newTask } = req.body;
      if (!newTask || !newTask.id)
        return res
          .status(400)
          .json({ error: "newTask with an id is required" });

      const existingTask = await taskCollection.findOne({
        id: newTask.id,
      });

      if (existingTask) {
        const updatedTask = await taskCollection.findOneAndUpdate(
          { id: newTask.id },
          { $set: newTask },
          { returnDocument: "after" }
        );
        return res.status(200).json(updatedTask);
      } else {
        const insertedTask = await taskCollection.insertOne(newTask);
        return res.status(201).json(insertedTask);
      }
    });

    // 🔹 DELETE: Remove Task
    app.delete("/tasks", async (req, res) => {
      const { taskId } = req.body;
      if (!taskId) return res.status(400).json({ error: "taskId is required" });

      const deletedTask = await taskCollection.deleteOne({
        id: taskId,
      });

      if (deletedTask.deletedCount === 0)
        return res.status(404).json({ error: "Task not found" });

      res.status(200).json({ message: "Task deleted successfully" });
    });

    // 🔹 Root Route
    app.get("/", (req, res) => {
      res.send("✅ Project is running...");
    });
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
  }
}
run().catch(console.dir);

// Start Server
app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});
