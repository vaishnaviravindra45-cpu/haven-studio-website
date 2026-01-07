import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
const PORT = 5000;
const DB_FILE = "./users.json";

/* Middleware */
app.use(cors());
app.use(express.json());

/* Helper functions */
function getUsers() {
  const data = fs.readFileSync(DB_FILE, "utf-8");
  return JSON.parse(data);
}

function saveUsers(users) {
  fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2));
}

/* Test route */
app.get("/", (req, res) => {
  res.send("Haven Studio Backend is Running 🚀");
});

/* REGISTER API */
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const users = getUsers();

  const exists = users.find(user => user.email === email);
  if (exists) {
    return res.status(409).json({ message: "User already exists" });
  }

  const newUser = {
    id: Date.now(),
    name,
    email,
    password
  };

  users.push(newUser);
  saveUsers(users);

  res.status(201).json({ message: "Registration successful" });
});

/* LOGIN API */
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const users = getUsers();

  const user = users.find(
    u => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  res.json({
    message: "Login successful",
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  });
});

/* GET USERS (for testing only) */
app.get("/users", (req, res) => {
  const users = getUsers();
  res.json(users);
});

/* Start Server */
app.listen(PORT, () => {
  console.log(✅ Server running at http://localhost:${PORT});
});
