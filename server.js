const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/profile", (req, res) => {
  res.render("profile");
});

app.get("/pricing", (req, res) => {
  res.render("pricing");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
