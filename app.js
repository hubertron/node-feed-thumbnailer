
// Express
const express = require("express")
const path = require("path")

// Read/Write Cams
const fs = require('file-system');
const yaml = require('js-yaml');
const Jimp = require('jimp');


// Format  Dates
const dateOptions = {
  year: "2-digit",
  month: "2-digit",
  day: "2-digit",
  hour: "numeric",
  minute: "numeric"
};

// Config Options
const refreshInterval = 300000;
const thumbnailWidth = 300;
const thumbnailHeight = 169;
const thumbnailQuality = 60;
const fullsizeWidth = 1280;
const fullsizeHeight = 720;
const fullsizeQuality = 70;


let imageObjects = [];

var directoryPath = path.join(__dirname, 'compressed');

async function getCams() {
  try {
    const webcamList = yaml.safeLoad(fs.readFileSync('webcams.yaml', 'utf8'));

    for (const i in webcamList) {
      
      Jimp.read(webcamList[i]["URL"])
        .then(data => {
          return data
            .resize(thumbnailWidth, thumbnailHeight) // resize
            .quality(thumbnailQuality) // set JPEG quality
            .writeAsync('compressed/' + webcamList[i]["Name"] + '_300x169' + '.jpg');
        })
        .then(data => {
          return data
            .resize(fullsizeWidth, fullsizeHeight) // resize
            .quality(fullsizeQuality) // set JPEG quality
            .writeAsync('fullsize/' + webcamList[i]["Name"] + '_1280x720' + '.jpg');
        })
        .catch(err => {
          console.error(err, webcamList[i]["Name"], webcamList[i]["URL"]);
        });
    }
  } catch (e) {
    console.log(e);
  } finally {
    const today = new Date();
    let timeFormat = today.toLocaleDateString("en-US", dateOptions);

    console.log("fetched webcams at:", timeFormat);

    //passsing directoryPath and callback function
    fs.readdir(directoryPath, function (err, files) {
      // Clear our image object
      imageObjects = [];
      //handling error
      if (err) {
        return console.log('Unable to scan directory: ' + err);
      }
      //listing all files using forEach
      files.forEach(function (file) {
        // Get when the file was last updated and push to an object array       
        var stats = fs.statSync('compressed/' + file);
        var mtime = stats.mtime;
        var localTime = mtime.toLocaleDateString("en-US", dateOptions);
        imageObjects.push({ timeStamp: localTime, imageURL: 'compressed/' + file, name: file.slice(0, -11) });
      });
      
      writeJSON(imageObjects);
      
      return imageObjects;
    });
  };

} setInterval(getCams, refreshInterval);

// Write to JSON
function writeJSON(imageObjects){
  const data = JSON.stringify(imageObjects, null, 2);
  fs.writeFile('compressed/cams.json', data, 'utf8', (err) => {
    if (err) {
      console.log(`Error writing file: ${err}`);
    } 
  });
};

/* Express Server Setup and Config */

const PORT = process.env.PORT || 5000
const app = express()

app.set('view engine', 'pug');
app.use("/compressed", express.static(path.join(__dirname, "compressed")));
app.use("/fullsize", express.static(path.join(__dirname, "fullsize")));
app.use("/stylesheets", express.static(path.join(__dirname, "stylesheets")));


app.get('/', (req, res) => {
  let imageObject = imageObjects;
  res.render('index', {
    title: 'Alterra Thumbnails',
    imageObject: imageObject
  })
});

app.listen(PORT, function () {
  console.log(`Express server listening on port ${PORT}`)
})