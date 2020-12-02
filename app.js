


const request = require('request')
const fs = require('file-system');
const yaml = require('js-yaml');
const Jimp = require('jimp');




const dateOptions = {
  year: "2-digit",
  month: "2-digit",
  day: "2-digit",
  hour: "numeric",
  minute: "numeric"
};



function getCams() {
  try {
    const webcamList = yaml.safeLoad(fs.readFileSync('webcams.yaml', 'utf8'));


    for (const i in webcamList) {
      Jimp.read(webcamList[i]["URL"])
        .then(data => {
          return data
            .resize(300, 169) // resize
            .quality(60) // set JPEG quality
            .writeAsync('compressed/' + webcamList[i]["Name"] + '.jpg');

        })
        .catch(err => {
          console.error(err, webcamList[i]["Name"] webcamList[i]["URL]);
        });
    }

  } catch (e) {
    console.log(e);
  } finally {
    const today = new Date();
    let timeFormat = today.toLocaleDateString("en-US", dateOptions);

    console.log("fetched webcams at:", timeFormat)
  }
}

setInterval(getCams, 180000);




/* Express Server Setup and Config */

const express = require("express")
const path = require("path")

const PORT = process.env.PORT || 5000

const app = express()

app.set('view engine', 'pug');
app.use("/compressed", express.static(path.join(__dirname, "compressed")));
app.use("/stylesheets", express.static(path.join(__dirname, "stylesheets")));


app.get('/view-images', (req, res) => {
  let images = allImages;
  let camTitle = "Some Title";
   res.render('index', { 
     title: 'Alterra Thumbnails', 
     images: images,
     camTitle: camTitle })
});

let allImages = [];

var directoryPath = path.join(__dirname, 'compressed');
//passsing directoryPath and callback function
fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    //listing all files using forEach
    files.forEach(function (file) {
        // Do whatever you want to do with the file 
        allImages.push('compressed/'+file);
    });
    return allImages;
});


app.listen(PORT, function () {
  console.log(`Express server listening on port ${PORT}`)
})

/*

https://coderrocketfuel.com/article/how-to-serve-static-files-using-node-js-and-express
https://coderrocketfuel.com/article/deploy-a-nodejs-application-to-digital-ocean-with-https


*/