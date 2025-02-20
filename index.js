// npx nodemon index.js
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5001;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      // "https://career-portal-ph.web.app",
      // "https://career-portal-ph.web.app",
    ], // can be multiple
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// verify token hook / middleware
const verifyToken = (req, res, next) => {
  const token = req?.cookies?.token;
  // console.log(token);
  if (!token) {
    return res.status(401).send({ message: "unAuthorized access" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized access" });
    }
    req.user = decoded;
    next();
  });
};

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
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );

    // Database and collections sections
    const taskCollection = client.db("TaskManagement").collection("tasks");

    //. Auth related APIs [JWT token]--//
    app.post("/jwt", async (req, res) => {
      // console.log("JWT request received");

      const user = req.body;
      if (!user.email) {
        return res.status(400).send({ message: "Email is required" });
      }

      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "5h",
      });

      // console.log("Generated Token:", token);

      res
        .cookie("token", token, {
          httpOnly: true,
          // secure: false, // set to true only if you're using HTTPS
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        })
        .send({ success: true });
    });

    // clear token
    app.post("/logout", (req, res) => {
      res
        .clearCookie("token", {
          httpOnly: true,
          secure: false, // set true for https
        })
        .send({ success: true });
    });
    // . ends here              //

    //----------------- All APIs -----------------//
    app.get("/tasks", async (req, res) => {
      const result = await taskCollection.find().toArray();
      res.send(result);
    });

    // ? patch drag info
    app.patch("/tasks", async (req, res) => {
      const { taskId, newCategory } = req.body;

      // Ensure taskId and newCategory are provided
      if (!taskId || !newCategory) {
        return res
          .status(400)
          .json({ message: "Task ID and new category are required." });
      }

      try {
        // Use the $set operator to update the category
        const task = await taskCollection.findOneAndUpdate(
          { id: taskId }, // Query by 'id'
          { $set: { category: newCategory } }, // Use $set to update the category field
          { new: true } // Return the updated document
        );

        if (!task) {
          return res.status(404).json({ message: "Task not found." });
        }

        return res.status(200).json(task); // Return the updated task
      } catch (error) {
        console.error(error);
        return res
          .status(500)
          .json({ message: "An error occurred while updating the task." });
      }
    });

    //--------------------------------------------//
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("project is running");
});

app.listen(port, () => {
  console.log(`project is waiting at: ${port}`);
});
