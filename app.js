const fs = require("fs");
const path = require("path");
const express = require("express");

const app = express();

app.set("view engine", "pug");
app.use("/compressed", express.static(path.join(__dirname, "compressed")));
app.use("/fullsize", express.static(path.join(__dirname, "fullsize")));
app.use("/stylesheets", express.static(path.join(__dirname, "stylesheets")));
app.use("/feed", express.static(path.join(__dirname, "feed")));

app.get("/", (req, res) => {
  //console.log(`GET ${req.path}`);

  // read cam list file each request, in case it changed
  const imageObject = JSON.parse(
    fs.readFileSync(path.join(__dirname, "feed/cams.json"), "utf8")
  );

  res.render("index", {
    title: "Alterra Thumbnails",
    imageObject,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
});
