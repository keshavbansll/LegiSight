const express = require("express");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

const app = express();
const port = 3000;

// Set up EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Create the 'uploads' directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

// Define routes
app.get("/", (req, res) => {
  res.render("index");
});

// Route to handle file uploads
app.post("/upload", upload.single("document"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file was uploaded.");
  }
  res.status(200).send("File uploaded successfully!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
