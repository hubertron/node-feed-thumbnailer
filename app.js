const fs = require("fs");
const path = require("path");
const express = require("express");

const app = express();
const multer = require('multer')

const storage = require('./upload-config')
const upload = multer(storage)

app.set("view engine", "pug");
app.use("/compressed", express.static(path.join(__dirname, "compressed")));
app.use("/fullsize", express.static(path.join(__dirname, "fullsize")));
app.use("/stylesheets", express.static(path.join(__dirname, "stylesheets")));
app.use("/stats", express.static(path.join(__dirname, "static")));


app.get("/", (req, res) => {
  console.log(`GET ${req.path} with proto ${req.protocol} from ip ${req.ip} at requested url: ${req.originalUrl}`);

  // read cam list file each request, in case it changed
  const imageObject = JSON.parse(
    fs.readFileSync(path.join(__dirname, "feed/cams.json"), "utf8")
  );

  res.render("index", {
    title: "Alterra Thumbnails",
    imageObject,
  });
});

const router = new express.Router
app.use(router)

router.get('/', (req, res) => {
    res.send('ok')
})
router.post('/upload',upload.single('image') ,async (req, res) => {

    return res.send('SUCCESS! You did it Jack Harris!')
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
});
