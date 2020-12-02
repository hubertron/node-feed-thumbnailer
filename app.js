


const request = require('request')
const fs = require('file-system');
const yaml = require('js-yaml');
const Jimp = require('jimp');


let inputfile = [
  {
    "Name": "empire",
    "URL": "https://dv_cdn.deervalley.com/empire.jpg"
  },
  {
    "Name": "sultan",
    "URL": "https://dv_cdn.deervalley.com/sultan.jpg"
  },
  {
    "Name": "wasatchtop",
    "URL": "https://dv_cdn.deervalley.com/wasatchtop.jpg"
  },
  {
    "Name": "burnstop",
    "URL": "https://dv_cdn.deervalley.com/burnstop.jpg"
  },
  {
    "Name": "empiretop",
    "URL": "https://dv_cdn.deervalley.com/empiretop.jpg"
  },
  {
    "Name": "silverlake",
    "URL": "https://dv_cdn.deervalley.com/silverlake.jpg"
  },
  {
    "Name": "snowpark",
    "URL": "https://dv_cdn.deervalley.com/snowpark.jpg"
  },
  /*"https://dv_cdn.deervalley.com/silverstrike.jpg",
  "https://dv_cdn.deervalley.com/snowstake.jpg",
  "http://www.redbuttoncreative.com/cams/SmartAlecCam.jpg",
  "http://redbuttoncreative.com/cams/BlueMountainInnCam.jpg",
  "http://redbuttoncreative.com/cams/VillageCam.jpg",
  "https://storage.googleapis.com/prism-cam-00077/1080-watermark.jpg",
  "http://redbuttoncreative.com/cams/OrchardCam.jpg",
  http://73.114.177.111:82/axis-cgi/jpg/image.cgi",
  "http://73.114.177.111:81/axis-cgi/jpg/image.cgi",*/
  {
    "Name": "Stratton 1",
    "URL": "http://73.114.177.111/axis-cgi/jpg/image.cgi"
  } /*
  "https://evovision.citynet.net/snowshoe/images/snowshoeshaverscenter_thumb.png",
  "https://evovision.citynet.net/snowshoe/images/snowshoeboathouse_thumb.png",
  "https://evovision.citynet.net/snowshoe/images/snowshoevillage_thumb.png",
  "https://evovision.citynet.net/snowshoe/images/snowshoesilvercreek_thumb.png",
  "https://evovision.citynet.net/snowshoe/images/snowshoebasin_thumb.png",
  "https://streaming.tremblant.ca/sommet-low.jpg",
  "https://streaming.tremblant.ca/basesud-low.jpg",
  "https://streaming.tremblant.ca/voyageurs-low.jpg",
  "https://streaming.tremblant.ca/stbernard-low.jpg",
  "https://streaming.tremblant.ca/basenord-low.jpg",
  "http://cams.winterparkresort.com/winter-park-basecam.jpg",
  "http://cams.winterparkresort.com/best-western-cam.jpg",
  "http://cams.winterparkresort.com/WP-TUBE-C-101.jpg",
  "http://cams.winterparkresort.com/lrock-cam.jpg",
  "http://cams.winterparkresort.com/snow-stake-cam.jpg",
  "http://steamboatwebcams.com/image/christie.jpg",
  "https://b9b.hdrelay.com/cameras/e12dbfe2-9359-4b93-a8ce-b5e461b681d1/GetOneShot?size=1920x1080&f=300000",
  "http://steamboatwebcams.com/image/thunderhead.jpg",
  "http://steamboatwebcams.com/image/rendezvous.jpg",
  "http://steamboatwebcams.com/image/offline.jpg",
  "http://steamboatwebcams.com/image/fourpoints.jpg",
  "https://media.mammothresorts.com/mmsa/june/cams/June_June_Meadows_Chalet_1280x720.jpg",
  "https://media.mammothresorts.com/mmsa/june/cams/June_J3_June_Mountain_Summit_1280x720.jpg",
  "https://media.mammothresorts.com/mmsa/june/cams/June_Chair_J1_Top_1280x720.jpg",
  "https://media.mammothresorts.com/mmsa/june/cams/June_J3_Rainbow_Summit_1280x720.jpg",
  "https://relay.ozolio.com/pub.api?cmd=icon&oid=CID_ISWA00000886",
  "https://relay.ozolio.com/pub.api?cmd=icon&oid=CID_PUAQ000008EA",
  "https://relay.ozolio.com/pub.api?cmd=icon&oid=CID_PGUS00000B0B",
  "https://relay.ozolio.com/pub.api?cmd=icon&oid=CID_JLTR00000E44",
  "https://storage.googleapis.com/prism-cam-00089/180.jpg",
  "https://storage.googleapis.com/prism-cam-0016/180.jpg",
  "https://relay.ozolio.com/pub.api?cmd=icon&oid=CID_LAYK0000089F",
  "https://storage.googleapis.com/prism-cam-00019/180.jpg",
  "https://webcams.solitudemountain.com/rh2.jpg",
  "https://webcams.solitudemountain.com/LCMC.jpg",
  "https://webcams.solitudemountain.com/mbl.jpg",
  "https://webcams.solitudemountain.com/ph.jpg",
  "https://instacam.earthnetworks.com/instacamimg/CRYM2/CRYM2_s.jpg",
  "https://instacam.earthnetworks.com/instacamimg/CRYM7/CRYM7_l.jpg?_ck=1332521777",
  "https://instacam.earthnetworks.com/instacamimg/CRYM3/CRYM3_l.jpg",
  "https://instacam.earthnetworks.com/instacamimg/CRYM5/CRYM5_l.jpg",
  "https://instacam.earthnetworks.com/instacamimg/CRYM4/CRYM4_l.jpg",
  "https://instacam.earthnetworks.com/instacamimg/CRYM6/CRYM6_l.jpg"*/

];

const dateOptions = {
  year: "2-digit",
  month: "2-digit",
  day: "2-digit",
  hour: "numeric",
  minute: "numeric"
};



function getCams() {
  try {
    const webcamList = yaml.safeLoad(fs.readFileSync('test.yaml', 'utf8'));


    for (const i in webcamList) {
      Jimp.read(webcamList[i]["URL"])
        .then(data => {
          return data
            .resize(300, 169) // resize
            .quality(60) // set JPEG quality
            .writeAsync('compressed/' + webcamList[i]["Name"] + '.jpg');

        })
        .catch(err => {
          console.error(err, inputfile[i]["Name"]);
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
   res.render('index', { title: 'Alterra Thumbs', images: images })
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