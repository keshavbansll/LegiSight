const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files (CSS, JS, images, etc.) from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Define routes for your website pages
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/profile", (req, res) => {
  res.render("profile");
});

// Add new pricing route
app.get("/pricing", (req, res) => {
  res.render("pricing");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
